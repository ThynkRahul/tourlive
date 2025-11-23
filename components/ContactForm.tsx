"use client";

import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function ContactForm({ locale }: { locale: string }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    if (!executeRecaptcha) {
      setStatus("reCAPTCHA not ready. Try again.");
      setLoading(false);
      return;
    }

    // Generate Invisible reCAPTCHA v3 Token
    const token = await executeRecaptcha("contact_form");

    const formEl = e.currentTarget;
    const formData = {
      name: (formEl.elements.namedItem("name") as HTMLInputElement).value,
      email: (formEl.elements.namedItem("email") as HTMLInputElement).value,
      phone: (formEl.elements.namedItem("phone") as HTMLInputElement).value,
      message: (formEl.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
      recaptchaToken: token,
    };

    const res = await fetch(`/${locale}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      setStatus("Message sent successfully!");
      formEl.reset();
    } else {
      setStatus(result?.error || "Failed to send message");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Your Name" required className="input" />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        required
        className="input"
      />
      <input name="phone" placeholder="Phone Number" className="input" />

      <textarea
        name="message"
        placeholder="Your Message"
        required
        className="textarea"
      />

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {status && <p className="text-sm text-center mt-2">{status}</p>}
    </form>
  );
}
