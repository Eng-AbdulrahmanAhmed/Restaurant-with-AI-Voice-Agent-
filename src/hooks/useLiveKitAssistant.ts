"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  Room,
  RoomEvent,
  Track,
  type Participant,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
} from "livekit-client";

export type AssistantStatus =
  | "disconnected"
  | "connecting"
  /** Connected to the room, waiting for the agent to be dispatched into it. */
  | "waiting"
  | "listening"
  | "speaking"
  | "error";

export type AssistantMessage = {
  id: string;
  role: "agent" | "user";
  text: string;
  at: number;
};

/** How long we wait for the dispatched agent to actually join the room. */
const AGENT_JOIN_TIMEOUT_MS = 30_000;

/**
 * Connects the browser to a LiveKit room that has the restaurant voice agent
 * dispatched into it, plays the agent's audio, and exposes the session state
 * the UI needs to show that something is really happening.
 */
export function useLiveKitAssistant() {
  const roomRef = useRef<Room | null>(null);
  const audioElementsRef = useRef<HTMLAudioElement[]>([]);
  const attachedTrackSidsRef = useRef<Set<string>>(new Set());
  const connectingRef = useRef(false);
  const agentJoinedRef = useRef(false);
  const agentSpeakingRef = useRef(false);
  const micEnabledRef = useRef(false);
  const agentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status, setStatus] = useState<AssistantStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [agentJoined, setAgentJoined] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);

  const clearAgentTimeout = useCallback(() => {
    if (agentTimeoutRef.current !== null) {
      clearTimeout(agentTimeoutRef.current);
      agentTimeoutRef.current = null;
    }
  }, []);

  /** Removes every audio element we attached and resets session flags. */
  const releaseAudio = useCallback(() => {
    for (const element of audioElementsRef.current) {
      element.pause();
      element.srcObject = null;
      element.remove();
    }
    audioElementsRef.current = [];
    attachedTrackSidsRef.current.clear();
  }, []);

  const resetSession = useCallback(() => {
    clearAgentTimeout();
    releaseAudio();
    agentJoinedRef.current = false;
    agentSpeakingRef.current = false;
    micEnabledRef.current = false;
    setAgentJoined(false);
    setMicEnabled(false);
    setAudioBlocked(false);
  }, [clearAgentTimeout, releaseAudio]);

  const syncStatus = useCallback(() => {
    if (!agentJoinedRef.current) {
      setStatus("waiting");
      return;
    }
    setStatus(agentSpeakingRef.current ? "speaking" : "listening");
  }, []);

  const connect = useCallback(async () => {
    if (roomRef.current || connectingRef.current) return;

    connectingRef.current = true;
    setStatus("connecting");
    setError(null);
    setMessages([]);
    agentJoinedRef.current = false;
    agentSpeakingRef.current = false;

    let room: Room | null = null;

    try {
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        cache: "no-store",
      });

      const data = (await response.json().catch(() => null)) as
        | {
            serverUrl?: string;
            participantToken?: string;
            error?: string;
          }
        | null;

      if (!response.ok || !data?.serverUrl || !data?.participantToken) {
        throw new Error(
          data?.error ?? `Could not get a LiveKit token (HTTP ${response.status}).`
        );
      }

      const roomInstance = new Room();
      room = roomInstance;
      roomRef.current = roomInstance;

      // --- Agent audio ------------------------------------------------------
      roomInstance.on(
        RoomEvent.TrackSubscribed,
        (track: RemoteTrack, publication: RemoteTrackPublication) => {
          if (track.kind !== Track.Kind.Audio) return;

          // A re-subscribe (reconnect, agent restart) can fire again for the
          // same track; never stack a second audio element on top of it.
          const trackSid = publication.trackSid;
          if (trackSid) {
            if (attachedTrackSidsRef.current.has(trackSid)) return;
            attachedTrackSidsRef.current.add(trackSid);
          }

          const element = track.attach() as HTMLAudioElement;
          element.autoplay = true;
          element.setAttribute("data-livekit-audio", "true");
          audioElementsRef.current.push(element);
          document.body.appendChild(element);

          element
            .play()
            .then(() => setAudioBlocked(false))
            .catch((playError: unknown) => {
              // Browsers can block audible playback that starts outside a user
              // gesture. Surface it in the UI so "tap to enable sound" can fix it.
              console.warn("Agent audio playback was blocked:", playError);
              setAudioBlocked(true);
            });
        }
      );

      roomInstance.on(
        RoomEvent.TrackUnsubscribed,
        (track: RemoteTrack, publication: RemoteTrackPublication) => {
          if (publication.trackSid) {
            attachedTrackSidsRef.current.delete(publication.trackSid);
          }

          for (const element of track.detach()) {
            audioElementsRef.current = audioElementsRef.current.filter(
              (candidate) => candidate !== element
            );
            element.remove();
          }
        }
      );

      // --- Session / agent presence ----------------------------------------
      roomInstance.on(RoomEvent.ParticipantConnected, (participant) => {
        if (participant.identity === roomInstance.localParticipant.identity) return;

        agentJoinedRef.current = true;
        setAgentJoined(true);
        clearAgentTimeout();
        setError(null);
        syncStatus();
      });

      roomInstance.on(
        RoomEvent.ParticipantDisconnected,
        (participant: RemoteParticipant) => {
          if (participant.identity === roomInstance.localParticipant.identity) return;

          agentJoinedRef.current = false;
          agentSpeakingRef.current = false;
          setAgentJoined(false);
          syncStatus();
          setError("The AI assistant left the room. Reconnect to keep ordering.");
        }
      );

      roomInstance.on(RoomEvent.ActiveSpeakersChanged, (speakers: Participant[]) => {
        agentSpeakingRef.current = speakers.some(
          (speaker) => speaker.identity !== roomInstance.localParticipant.identity
        );
        syncStatus();
      });

      roomInstance.on(RoomEvent.AudioPlaybackStatusChanged, () => {
        setAudioBlocked(!roomInstance.canPlaybackAudio);
      });

      // --- Transcripts (agent + guest) -------------------------------------
      roomInstance.on(RoomEvent.TranscriptionReceived, (segments, participant) => {
        const role: AssistantMessage["role"] =
          participant?.identity === roomInstance.localParticipant.identity
            ? "user"
            : "agent";

        setMessages((previous) => {
          const next = [...previous];

          for (const segment of segments) {
            const text = segment.text?.trim();
            if (!text) continue;

            const id = `${participant?.identity ?? "unknown"}:${segment.id}`;
            const index = next.findIndex((message) => message.id === id);

            if (index >= 0) {
              next[index] = { ...next[index], text, at: Date.now() };
            } else {
              next.push({ id, role, text, at: Date.now() });
            }
          }

          return next.slice(-40);
        });
      });

      roomInstance.on(RoomEvent.ConnectionStateChanged, (state) => {
        if (state === ConnectionState.Reconnecting) {
          setStatus("connecting");
        }
      });

      roomInstance.on(RoomEvent.Disconnected, () => {
        if (roomRef.current === roomInstance) roomRef.current = null;
        connectingRef.current = false;
        resetSession();
        setStatus("disconnected");
      });

      await roomInstance.connect(data.serverUrl, data.participantToken);
      connectingRef.current = false;
      setStatus("waiting");

      agentTimeoutRef.current = setTimeout(() => {
        if (!agentJoinedRef.current) {
          setError(
            "Connected to the room, but the AI agent never joined. Check that the agent deployment is running."
          );
        }
      }, AGENT_JOIN_TIMEOUT_MS);

      // The mic is best-effort: the agent can still talk to us if the user
      // denies microphone access, so a failure here must not kill the session.
      try {
        await roomInstance.localParticipant.setMicrophoneEnabled(true);
        micEnabledRef.current = roomInstance.localParticipant.isMicrophoneEnabled;
        setMicEnabled(micEnabledRef.current);

        if (!micEnabledRef.current) {
          setError("Microphone access was blocked. Allow the mic to speak to GrillBot.");
        }
      } catch (micError) {
        console.warn("Microphone could not be enabled:", micError);
        setError("Microphone access was blocked. Allow the mic to speak to GrillBot.");
      }

      setAudioBlocked(!roomInstance.canPlaybackAudio);
    } catch (err) {
      console.error("LiveKit connection failed:", err);

      if (room) {
        try {
          await room.disconnect();
        } catch {
          // Already torn down.
        }
      }

      roomRef.current = null;
      resetSession();
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong connecting to the assistant."
      );
    } finally {
      connectingRef.current = false;
    }
  }, [clearAgentTimeout, resetSession, syncStatus]);

  const disconnect = useCallback(async () => {
    const room = roomRef.current;
    roomRef.current = null;
    connectingRef.current = false;

    if (room) {
      try {
        await room.disconnect();
      } catch {
        // Already disconnected.
      }
    }

    resetSession();
    setStatus("disconnected");
    setError(null);
  }, [resetSession]);

  /** Mute/unmute the guest mic without tearing down the agent session. */
  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;

    const nextEnabled = !micEnabledRef.current;

    try {
      await room.localParticipant.setMicrophoneEnabled(nextEnabled);
      micEnabledRef.current = room.localParticipant.isMicrophoneEnabled;
      setMicEnabled(micEnabledRef.current);

      if (nextEnabled && !micEnabledRef.current) {
        setError("Microphone access was blocked. Allow the mic to speak to GrillBot.");
      }
    } catch (micError) {
      console.warn("Could not change microphone state:", micError);
      setError("Microphone access was blocked. Allow the mic to speak to GrillBot.");
    }
  }, []);

  /** Recover from browser autoplay blocking; must run inside a user gesture. */
  const enableAudio = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;

    try {
      await room.startAudio();
    } catch (audioError) {
      console.warn("Could not resume audio playback:", audioError);
    }

    setAudioBlocked(!room.canPlaybackAudio);
  }, []);

  useEffect(() => {
    return () => {
      const room = roomRef.current;
      roomRef.current = null;

      if (room) {
        void room.disconnect();
      }

      clearAgentTimeout();
      releaseAudio();
    };
  }, [clearAgentTimeout, releaseAudio]);

  const isStreaming = status === "listening" || status === "speaking";

  return {
    status,
    error,
    messages,
    agentJoined,
    micEnabled,
    audioBlocked,
    isConnected: isStreaming || status === "waiting",
    isConnecting: status === "connecting",
    isSpeaking: status === "speaking",
    isLive: agentJoined && isStreaming,
    connect,
    disconnect,
    toggleMic,
    enableAudio,
  };
}
