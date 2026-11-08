import Link from "next/link";
import Image from "next/image";
import FoodDoodle from "@/assets/food doodle.jpg";
import burgerLogo from "@/assets/logo-no-background.png";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

export default function layout({ children }: {children:ReactNode}) {
  return (
    <section className="flex h-screen w-full">
      <div className="flex w-full flex-col bg-cream px-6 pb-6 pt-4 md:w-1/2 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href={"/"} className="flex items-center">
            <Image
              alt={"BurgerHouse logo"}
              className="mr-2"
              src={burgerLogo}
              width={44}
              height={44}
            />

            <span className="font-display text-xl font-bold tracking-tight text-ink">
              Burger<span className="text-orange">House.</span>
            </span>
          </Link>

          <Link
            href={"/"}
            className="relative mr-2 flex items-center text-sm font-medium text-muted transition-colors hover:text-orange
              after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0
              after:bg-orange after:transition-all after:duration-300
              hover:after:w-full"
          >
            <span className="mr-2">
              <ArrowLeft size={18} />
            </span>
            back to home
          </Link>
        </div>

        <div className="flex flex-1 justify-center overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Food doodle panel */}
      <div className="relative hidden h-full w-1/2 overflow-hidden bg-cream-deep md:block">
        {/* Low-opacity food doodle */}
        <Image
          src={FoodDoodle}
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover opacity-[0.55]"
        />
      </div>
    </section>
  );
}