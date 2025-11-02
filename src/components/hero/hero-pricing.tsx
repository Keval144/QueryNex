import Link from "next/link";

function HeroPricing() {
  return (
    <section
      id="pricing"
      className="animate-slide-up-fade fill-mode-[both] relative flex h-auto flex-col items-center justify-center overflow-hidden px-6 pt-4 text-center"
    >
      {/* Subtle gradient blur background */}

      <div className="max-w-3xl space-y-6">
        <h1 className="bg-linear-to-r text-5xl font-semibold [animation-delay:200ms]">
          Pricing? What Price?
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed [animation-delay:400ms]">
          Query Nex has some limit of pre-purchased tokens — just hop on and
          try! <br />
          If you exceed your free limit, only then it becomes paid. <br />
          Until then, enjoy the experience.
        </p>

        <div className="mt-8 flex justify-center [animation-delay:600ms]">
          <Link href={"/sign-in"}>
            <button className="bg-primary cursor-pointer rounded-2xl p-3 text-center text-white hover:shadow-xl">
              Start Exploring Free
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroPricing;
