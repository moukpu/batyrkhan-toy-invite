"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { SoftReveal } from "@/components/motion";
import { type AttendanceOption } from "@/lib/event-data";
import { submitRsvp } from "@/lib/rsvp";

type FormState = {
  guestName: string;
  attendance: AttendanceOption;
};

type RsvpCopy = {
  nameLabel: string;
  namePlaceholder: string;
  attendanceLabel: string;
  attendanceOptions: {
    yes: string;
    no: string;
  };
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  errorNameMessage: string;
  errorSubmitMessage: string;
};

const initialState: FormState = {
  guestName: "",
  attendance: "yes",
};

export function RsvpForm({ copy }: { copy: RsvpCopy }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [feedback, setFeedback] = useState<"success" | "nameError" | "submitError" | null>(
    null
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.guestName.trim()) {
      setStatus("error");
      setFeedback("nameError");
      return;
    }

    setStatus("loading");
    setFeedback(null);

    try {
      await submitRsvp({
        guestName: form.guestName.trim(),
        attendance: form.attendance,
      });

      setStatus("success");
      setFeedback("success");
      setForm(initialState);
    } catch {
      setStatus("error");
      setFeedback("submitError");
    }
  }

  const message = useMemo(() => {
    if (feedback === "success") {
      return copy.successMessage;
    }

    if (feedback === "nameError") {
      return copy.errorNameMessage;
    }

    if (feedback === "submitError") {
      return copy.errorSubmitMessage;
    }

    return "";
  }, [copy, feedback]);

  const buttonLabel =
    status === "loading" ? copy.submittingLabel : copy.submitLabel;

  return (
    <form onSubmit={handleSubmit} noValidate className="rsvp-form">
      <div className="rsvp-group">
        <label htmlFor="guestName" className="body-sm italic text-ink/82">
          {copy.nameLabel}
        </label>
        <input
          id="guestName"
          name="guestName"
          type="text"
          value={form.guestName}
          onChange={handleChange}
          placeholder={copy.namePlaceholder}
          className="field-line"
          autoComplete="name"
          disabled={status === "loading"}
        />
      </div>

      <div className="rsvp-group rsvp-group-choice">
        <span className="body-sm italic text-ink/82">{copy.attendanceLabel}</span>
        <div className="rsvp-choice-shell grid grid-cols-2 gap-2.5 sm:gap-3">
          {(
            [
              { value: "yes", label: copy.attendanceOptions.yes },
              { value: "no", label: copy.attendanceOptions.no },
            ] as const
          ).map((option) => {
            const selected = form.attendance === option.value;

            return (
              <label
                key={option.value}
                data-selected={selected}
                className="choice-pill cursor-pointer"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="attendance"
                  value={option.value}
                  checked={selected}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
                <span className="w-full text-center text-[0.9rem] leading-[1.2] sm:text-[0.98rem]">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {message ? (
        <SoftReveal>
          <div
            aria-live="polite"
            className={`form-message ${
              status === "success" ? "form-message-success" : "form-message-error"
            }`}
          >
            <p className="body-sm">{message}</p>
          </div>
        </SoftReveal>
      ) : null}

      <div className="rsvp-actions">
        <button
          type="submit"
          className="invitation-button invitation-button-dark w-full disabled:cursor-not-allowed disabled:opacity-65 sm:min-w-[13rem] sm:w-auto"
          disabled={status === "loading"}
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
