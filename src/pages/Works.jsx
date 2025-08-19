// src/pages/Works.jsx
export default function Works() {
  return (
    <main className="px-4 pt-20 pb-24 sm:px-6">
      <section className="mx-auto max-w-5xl text-center">
        <h1 className="text-2xl font-semibold">Works</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Explore my music on SoundCloud.
        </p>

        <div className="mt-10 w-full overflow-hidden rounded-2xl shadow-lg">
          <iframe
            width="100%"
            height="600" // increased height
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/suji_lament&color=%23000000&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true"
          ></iframe>
        </div>
      </section>
    </main>
  );
}
