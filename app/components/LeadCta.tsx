"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";

type LeadCtaProps = {
  label: string;
  context: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  variant?: "primary" | "secondary";
};

const DEFAULT_WHATSAPP_NUMBER = "9779862568506";

export default function LeadCta({
  label,
  context,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
  whatsappMessage,
  variant = "primary"
}: LeadCtaProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage || `Hi! I'm interested in: ${context}`
  )}`;

  function closePanel() {
    setIsOpen(false);
    setStatus("idle");
    setError("");
  }

  // Lock background scroll and allow Escape to close while the dialog is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closePanel();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const formEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!formEndpoint) {
      setStatus("error");
      setError("Lead system is not configured yet. Please message us on WhatsApp instead.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("_subject", `New interest: ${context}`);
    formData.set("interest", context);

    // Open WhatsApp immediately, while still inside the click/submit gesture — most
    // browsers block window.open() once an `await` has run, so this has to happen
    // before the network request, not after it.
    window.open(whatsappHref, "_blank", "noreferrer");

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      if (!response.ok) {
        throw new Error(
          "Could not send your details. Your WhatsApp chat is still open — you can continue there."
        );
      }

      router.push(`/thank-you?service=${encodeURIComponent(context)}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send your details.");
    }
  }

  if (!isOpen) {
    return (
      <button type="button" className={`button ${variant}`} onClick={() => setIsOpen(true)}>
        <MessageCircle size={18} />
        {label}
      </button>
    );
  }

  return createPortal(
    <div className="lead-cta-backdrop" onClick={closePanel}>
      <div
        className="lead-cta-panel glass-card"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="lead-cta-close" onClick={closePanel} aria-label="Close">
          <X size={16} />
        </button>
        <p className="lead-cta-title">{label}</p>
        <form className="order-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Phone / WhatsApp
            <input name="phone" type="tel" placeholder="+977..." required />
          </label>
          <label>
            Email (optional)
            <input name="email" type="email" placeholder="you@example.com" />
          </label>
          <button className="button primary" type="submit" disabled={status === "sending"}>
            <Send size={18} />
            {status === "sending" ? "Sending..." : "Submit"}
          </button>
          {status === "error" ? (
            <p className="form-status error" role="status">
              {error}
            </p>
          ) : null}
          <a className="lead-cta-skip" href={whatsappHref} target="_blank" rel="noreferrer">
            Skip the form — message us directly on WhatsApp
          </a>
        </form>
      </div>
    </div>,
    document.body
  );
}
