import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-2 text-muted">
        Let me know if you&apos;d like to work together on something or if
        you&apos;d like to chat about writing.
      </p>
      <ContactForm />
    </div>
  );
}
