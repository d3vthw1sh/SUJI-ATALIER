// src/pages/Contact.jsx
export default function Contact() {
  return (
    <main className="px-4 pt-20 pb-24 sm:px-6">
      <section className="mx-auto max-w-md text-center">
        <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
        <p className="text-neutral-600 dark:text-neutral-300">
          You can reach me through Discord:{" "}
          <span className="font-medium">@suji_lament</span>
          <br />
          or email:{" "}
          <a
            href="mailto:sujilament@gmail.com"
            className="underline hover:text-neutral-900 dark:hover:text-white"
          >
            sujilament@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
