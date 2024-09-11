export default function HeroSection() {
  return (
    <>
      <div className="rounded-xl border border-secondary text-white">
        <div className="relative isolate px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Waifu Smash
              </h1>
              <p className="0 mt-6 text-lg leading-8">
                Waifu Showdown: Who's Smash-worthy, and Who's Not?
              </p>
              <div className="mt-4 flex items-center justify-center gap-x-6">
                <a
                  href="/media"
                  className="rounded-xl bg-accen px-3 py-2 font-bold text-primary"
                >
                  See all →
                </a>
                <a href="/create">Add Template</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
