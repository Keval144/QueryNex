import Image from "next/image";

function BentoFeatures() {
  return (
    <section className="min-h-screen py-8 md:py-16 lg:py-20" id="features">
      <div className="text-center text-4xl md:mb-12 md:text-5xl lg:mb-16 lg:text-6xl">
        Features
      </div>

      <div className="font-inter mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Mobile Layout (Stacked) */}
        <div className="flex flex-col gap-4 md:hidden">
          {/* Cloud Solutions */}
          <div className="bg-card border-border/50 flex flex-col justify-start rounded-3xl border p-6 shadow-md dark:border-0">
            <h2 className="text-2xl leading-tight font-bold text-[#1d9bf0]">
              Converse with Your Database
            </h2>
            <p className="text-muted-foreground mt-3 text-base font-medium dark:text-white">
              Interact with your data using a ChatGPT-like interface — no SQL
              required. QueryNex turns natural language into precise database
              commands instantly.
            </p>
          </div>

          {/* Self Hostable */}
          <div className="bg-card border-border/50 flex flex-col justify-start rounded-3xl border p-6 shadow-md dark:border-0">
            <h2 className="text-2xl leading-tight font-bold text-[#1d9bf0]">
              Self-Host with Ease
            </h2>
            <p className="text-muted-foreground mt-3 text-base font-medium dark:text-white">
              Deploy QueryNex on your own infrastructure — just{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                git clone
              </code>{" "}
              and you're ready to go.
            </p>
          </div>

          {/* Device Image 1 */}
          <img
            className="bg-card h-max rounded-[2.5rem] bg-cover bg-center bg-no-repeat shadow-[0_20px_30px_-10px_rgba(16,16,39,0.07)]"
            src="/assets/girlsittingdesk.jpg"
            alt="Girl sitting on chair"
          />
          {/* Secure & Auditable */}
          <div className="bg-card border-border/50 flex flex-col justify-start rounded-3xl border p-6 shadow-md dark:border-0">
            <h3 className="text-xl leading-tight font-semibold text-[#1d9bf0]">
              Secure & Auditable
            </h3>
            <p className="text-muted-foreground mt-3 text-base font-medium dark:text-white">
              QueryNex ensures enterprise-grade encryption, full activity logs,
              and role-based access for complete data control.
            </p>
          </div>

          {/* Device Image 2 */}
          <div
            className="min-h-[200px] rounded-3xl bg-cover bg-center bg-no-repeat shadow-md"
            style={{
              backgroundImage:
                "url('https://emilandersson.com/storage/works/thumbnails/01JPXM5JG84REHYA3GQYGA3SSM.webp')",
            }}
          ></div>

          {/* Fast and Reliable */}
          <div className="bg-card flex flex-col justify-start rounded-3xl p-6 shadow-md">
            <h2 className="text-xl leading-tight font-bold text-[#1d9bf0]">
              Fast and Reliable
            </h2>
            <p className="text-muted-foreground mt-3 text-base font-medium dark:text-white">
              QueryNex ensures enterprise-grade encryption, full activity logs,
              and role-based access for complete data control.
            </p>
          </div>
        </div>

        {/* Tablet Layout (2 columns) */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6 lg:hidden">
          {/* Row 1 */}
          <div className="bg-card border-border/50 flex flex-col justify-start rounded-3xl border p-8 shadow-md md:col-span-2 dark:border-0">
            <h2 className="text-3xl leading-tight font-bold text-[#1d9bf0]">
              Converse with Your Database
            </h2>
            <p className="text-muted-foreground mt-4 text-base font-medium dark:text-white">
              Interact with your data using a ChatGPT-like interface — no SQL
              required. QueryNex turns natural language into precise database
              commands instantly.
            </p>
          </div>

          {/* Row 2 */}
          <div className="bg-card border-border/50 flex flex-col justify-start rounded-3xl border p-8 shadow-md dark:border-0">
            <h2 className="text-2xl leading-tight font-bold text-[#1d9bf0]">
              Self-Host with Ease
            </h2>
            <p className="text-muted-foreground mt-3 text-base font-medium dark:text-white">
              Deploy QueryNex on your own infrastructure — just{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                git clone
              </code>{" "}
              and you're ready to go.
            </p>
          </div>

          <img
            className="bg-card h-max rounded-[2.5rem] bg-cover bg-center bg-no-repeat shadow-[0_20px_30px_-10px_rgba(16,16,39,0.07)]"
            src="/assets/girlsittingdesk.jpg"
            alt="Girl sitting on chair"
          />

          {/* Row 3 */}
          <div className="bg-card border-border/50 flex flex-col justify-start rounded-3xl border p-8 shadow-md dark:border-0">
            <h3 className="text-2xl leading-tight font-semibold text-[#1d9bf0]">
              Secure & Auditable
            </h3>
            <p className="text-muted-foreground mt-3 text-base font-medium dark:text-white">
              QueryNex ensures enterprise-grade encryption, full activity logs,
              and role-based access for complete data control.
            </p>
          </div>

          <div
            className="min-h-[250px] rounded-3xl bg-cover bg-center bg-no-repeat shadow-md"
            style={{
              backgroundImage:
                "url('https://emilandersson.com/storage/works/thumbnails/01JPXM5JG84REHYA3GQYGA3SSM.webp')",
            }}
          ></div>

          {/* Row 4 */}
          <div className="bg-card flex flex-col justify-start rounded-3xl p-8 shadow-md md:col-span-2">
            <h2 className="text-2xl leading-tight font-bold text-[#1d9bf0]">
              Fast and Reliable
            </h2>
            <p className="text-muted-foreground mt-3 text-base font-medium dark:text-white">
              QueryNex ensures enterprise-grade encryption, full activity logs,
              and role-based access for complete data control.
            </p>
          </div>
        </div>

        {/* Desktop Layout (Original 3-column bento) */}
        <div className="hidden scale-75 auto-rows-fr grid-cols-[4fr_3fr_3fr] gap-6 lg:grid">
          {/* Cloud Solutions */}
          <div className="bg-card border-border/50 col-[1/2] row-[1/3] flex flex-col justify-start rounded-[2.5rem] border p-10 shadow-md dark:border-0">
            <h2 className="text-[3rem] leading-[1.1] font-bold text-[#1d9bf0]">
              Converse with Your Database
            </h2>
            <p className="text-muted-foreground mt-4 text-lg font-medium dark:text-white">
              Interact with your data using a ChatGPT-like interface — no SQL
              required. QueryNex turns natural language into precise database
              commands instantly.
            </p>
          </div>

          {/* Self Hostable */}
          <div className="bg-card border-border/50 col-[2/4] row-[1/2] flex flex-col justify-start rounded-[2.5rem] border p-12 shadow-md dark:border-0">
            <h2 className="text-[3rem] leading-[1.1] font-bold text-[#1d9bf0]">
              Self-Host with Ease
            </h2>
            <p className="text-muted-foreground mt-4 text-lg font-medium dark:text-white">
              Deploy QueryNex on your own infrastructure — just{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                git clone
              </code>{" "}
              and you're ready to go.
            </p>
          </div>

          {/* Device 1 */}
          <img
            className="bg-card h-max rounded-[2.5rem] bg-cover bg-center bg-no-repeat shadow-[0_20px_30px_-10px_rgba(16,16,39,0.07)]"
            src="/assets/girlsittingdesk.jpg"
            alt="Girl sitting on chair"
          />

          {/* Secure & Auditable */}
          <div className="bg-card border-border/50 flex flex-col justify-start rounded-[2.5rem] border p-12 shadow-md dark:border-0">
            <h3 className="text-[2.6rem] leading-none font-semibold text-[#1d9bf0]">
              Secure & Auditable
            </h3>
            <p className="text-muted-foreground mt-4 text-lg font-medium dark:text-white">
              QueryNex ensures enterprise-grade encryption, full activity logs,
              and role-based access for complete data control.
            </p>
          </div>

          {/* Device 2 */}
          <div
            className="rounded-[2.5rem] bg-cover bg-center bg-no-repeat shadow-md"
            style={{
              backgroundImage:
                "url('https://emilandersson.com/storage/works/thumbnails/01JPXM5JG84REHYA3GQYGA3SSM.webp')",
            }}
          ></div>

          {/* Fast and Reliable */}
          <div className="bg-card col-[2/4] row-[3/4] flex flex-col justify-start rounded-[2.5rem] p-8 shadow-md">
            <h2 className="text-[2rem] leading-[0.9] font-bold text-[#1d9bf0]">
              Fast and Reliable
            </h2>
            <p className="text-muted-foreground mt-4 text-lg font-medium dark:text-white">
              QueryNex ensures enterprise-grade encryption, full activity logs,
              and role-based access for complete data control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BentoFeatures;
