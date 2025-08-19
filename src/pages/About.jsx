// src/pages/About.jsx
export default function About() {
  return (
    <main className="px-4 pt-20 pb-24 sm:px-6">
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">About</h2>
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
          I’m <strong>suji</strong>— a music artist drawn to the gray hour,
          where the sea is quiet and the air brushes your face. I blend
          orchestral, fantasy, and electronic elements to build minimal,
          cinematic soundscapes with a soft ache. My work is shaped by game
          soundtracks, and stories about distance and hope. I like slow-bloom
          melodies, gentle strings, and synths that feel like fog. Silence is
          part of the music. Each track is a small world — calm, lonely, and
          tender — like standing at the edge of a cliff and listening to the
          water breathe. If you live for that moment between light and dark,
          you’ll probably feel at home here.
        </p>

        {/* Credit line */}
        <p className="mt-10 text-sm text-neutral-500 dark:text-neutral-400 text-center">
          art is by <span className="font-medium">@lunaminiss</span>
        </p>
      </section>
    </main>
  );
}
