import CtaBanner from "@/components/mainComponents/CtaBanner"
import Story from "@/components/mainComponents/Story"
import Marquee from "@/components/mainComponents/Marquee";
import FanFav from "@/components/mainComponents/FanFav";
import Hero from "@/components/mainComponents/Hero"
import Features from "@/components/mainComponents/Features"

export default function Home() {
  return (
    <main className="w-full overflow-x-clip">
      <Hero />
      <Marquee />
      <Features />
      <FanFav />
      <Story />
      <CtaBanner />
    </main>
  );
}
