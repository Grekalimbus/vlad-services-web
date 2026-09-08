import { BookingForm } from "@/components/booking-form";
import { tvCounts } from "@/lib/content";

export function Plan() {
  return (
    <section
      id="plan"
      aria-labelledby="plan-heading"
      className="border-b border-border bg-card"
    >
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-7">
            <p className="eyebrow">The visit</p>
            <h2
              id="plan-heading"
              className="mt-4 max-w-[12ch] text-4xl font-medium tracking-[-0.03em] md:text-5xl md:leading-[1.06]"
            >
              How many televisions?
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-muted-foreground md:col-span-5 md:pb-1">
            We size the appointment around the count — not a discount, not a
            quiz. Choose a number, then leave a phone.
          </p>
        </div>

        <fieldset className="plan-field relative mt-14 min-w-0">
          <legend className="sr-only">Number of televisions to mount</legend>
          <div
            className="plan-track pointer-events-none absolute top-10 right-[12.5%] left-[12.5%] hidden h-px bg-border lg:block"
            aria-hidden="true"
          />
          <div
            className="plan-fill pointer-events-none absolute top-10 left-[12.5%] hidden h-px bg-foreground/70 lg:block"
            aria-hidden="true"
          />

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-0">
            {tvCounts.map((item, index) => (
              <label
                key={item.id}
                className="plan-option relative z-10 flex cursor-pointer flex-col items-center rounded-sm px-3 py-5 text-center transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring lg:rounded-none"
              >
                <input
                  id={`count-${item.id}`}
                  type="radio"
                  name="tv-count"
                  value={item.id}
                  className="sr-only"
                />
                <span className="plan-index relative flex size-10 items-center justify-center">
                  <span className="plan-dot absolute inset-0 rounded-full border border-border bg-card" />
                  <span className="plan-index-text relative text-[0.65rem] font-medium text-muted-foreground">
                    0{index + 1}
                  </span>
                </span>
                <span className="mt-5 text-5xl font-medium leading-none tracking-[-0.04em] md:text-6xl">
                  {item.count}
                </span>
                <TvMarks count={item.screens} />
                <span className="mt-4 block text-sm font-semibold">
                  {item.title}
                </span>
                <span className="plan-note mt-1 block text-xs tracking-wide text-muted-foreground">
                  {item.note}
                </span>
              </label>
            ))}
          </div>

          <p className="plan-empty mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
            Select a count to leave a number. We call back to confirm the wall
            and a time.
          </p>

          {tvCounts.map((item) => (
            <div
              key={item.id}
              className={`plan-panel plan-panel-${item.id} mt-12 gap-10 border-t border-border pt-10 md:grid-cols-12 md:gap-12`}
            >
              <div className="md:col-span-5">
                <p className="eyebrow">Next</p>
                <p className="mt-4 text-3xl font-medium leading-snug tracking-[-0.03em] md:text-4xl">
                  {item.title}
                </p>
                <p className="mt-3 text-[0.75rem] font-medium text-accent">
                  {item.duration}
                </p>
                <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                  {item.follow}
                </p>
              </div>
              <div className="border-t border-border pt-8 md:col-span-7 md:border-t-0 md:border-l md:pt-0 md:pl-12">
                <BookingForm
                  tvCount={item.id}
                  showNote={false}
                  submitLabel="Request this visit"
                />
              </div>
            </div>
          ))}
        </fieldset>
      </div>
    </section>
  );
}

function TvMarks({ count }: { readonly count: number }) {
  const screens = count === 4 ? 3 : count;
  return (
    <span className="mt-4 flex h-4 items-end justify-center gap-1" aria-hidden="true">
      {Array.from({ length: screens }, (_, index) => (
        <span key={index} className="plan-screen block h-3 w-[1.15rem] rounded-[1px] border border-foreground/25" />
      ))}
      {count === 4 ? (
        <span className="plan-plus -mb-px pl-0.5 text-sm leading-none text-muted-foreground">
          +
        </span>
      ) : null}
    </span>
  );
}
