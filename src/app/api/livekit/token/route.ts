import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { RoomConfiguration, RoomAgentDispatch } from "@livekit/protocol";

export const runtime = "nodejs";

// The agent that must be dispatched into every guest room. Both values can be
// overridden per environment so the UI is not hard-wired to one deployment.
const AGENT_NAME = process.env.LIVEKIT_AGENT_NAME ?? "my-agent";
const AGENT_DEPLOYMENT = process.env.LIVEKIT_AGENT_DEPLOYMENT ?? "burgerhouse-dev";

export async function POST() {
  try {
    const livekitUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      console.error("Missing LiveKit environment variables.");

      return NextResponse.json(
        { error: "LiveKit is not configured." },
        { status: 500 }
      );
    }

    // Generate a private room and identity for this guest session.
    const roomName = `burgerhouse-${randomUUID()}`;
    const participantIdentity = `guest-${randomUUID()}`;

    const accessToken = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: "Guest",
      ttl: "10m",
    });

    accessToken.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Dispatching through the token is what actually puts the voice agent in
    // the room; without this the guest joins an empty room and hears nothing.
    accessToken.roomConfig = new RoomConfiguration({
      agents: [
        new RoomAgentDispatch({
          agentName: AGENT_NAME,
          ...(AGENT_DEPLOYMENT ? { deployment: AGENT_DEPLOYMENT } : {}),
        }),
      ],
    });

    const participantToken = await accessToken.toJwt();

    return NextResponse.json(
      {
        serverUrl: livekitUrl,
        participantToken,
        roomName,
        participantIdentity,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("LiveKit token generation failed:", error);

    return NextResponse.json(
      { error: "Unable to generate a LiveKit token." },
      { status: 500 }
    );
  }
}
