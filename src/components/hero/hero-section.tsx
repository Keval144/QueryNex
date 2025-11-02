import Link from "next/link";

function HeroSection() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="from-foreground to-muted-foreground animate-slide-up-fade fill-mode-[both] bg-linear-to-r bg-clip-text text-5xl leading-tight font-semibold text-transparent [animation-delay:200ms] sm:text-6xl md:text-7xl">
        The Next Generation <br /> Query Explorer
      </h1>

      <p className="text-muted-foreground animate-slide-up-fade fill-mode-[both] mt-6 max-w-2xl text-base opacity-90 [animation-delay:400ms] sm:text-lg md:text-lg">
        Explore data intuitively, visualize queries effortlessly, and unlock
        insights with the most powerful query explorer built for developers and
        analysts.
      </p>

      <div className="animate-slide-up-fade fill-mode-[both] mt-10 flex flex-wrap justify-center gap-4 [animation-delay:600ms]">
        <a href="https://github.com/Keval144/QueryNex">
          <button className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-medium shadow-md transition hover:opacity-90 sm:text-base">
            See Github
          </button>
        </a>
        <Link href={"/sign-in"}>
          <button className="border-foreground hover:bg-foreground/10 rounded-full border px-6 py-2 text-sm font-medium transition sm:text-base">
            Sign Up
          </button>
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
