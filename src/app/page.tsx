"use client";

import Image from "next/image";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  MaskReveal,
  MotionProvider,
  SoftReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion";
import { RsvpForm } from "@/components/rsvp-form";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import {
  defaultLanguage,
  invitationContent,
  type Language,
} from "@/lib/event-data";

function DetailRow({
  label,
  value,
  tone = "light",
}: {
  label: string;
  value: string;
  tone?: "light" | "dark";
}) {
  const muted = tone === "dark" ? "text-ivory-soft/64" : "text-ink/58";
  const strong = tone === "dark" ? "text-ivory-soft" : "text-ink";

  return (
    <div className="flex flex-col gap-1.5 border-b border-current/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <span className={`body-sm italic ${muted}`}>{label}</span>
      <span className={`body-md ${strong} sm:max-w-[72%] sm:text-right`}>
        {value}
      </span>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const content = invitationContent[language];

  const scheduleRows = [
    { label: content.schedule.dateLabel, value: content.schedule.dateValue },
    { label: content.schedule.timeLabel, value: content.schedule.timeValue },
    {
      label: content.schedule.welcomeLabel,
      value: content.schedule.welcomeValue,
    },
  ];

  return (
    <MotionProvider>
      <main className="invitation-page min-h-screen overflow-x-clip pt-6 sm:pt-8">
        <section className="story-section ambient-light-surface ambient-light-hero pt-8 sm:pt-10 lg:pt-12">
          <div className="page-shell relative z-10">
            <SoftReveal delay={0.04} className="flex justify-end">
              <LanguageSwitcher
                language={language}
                onChange={setLanguage}
                ariaLabel={content.hero.languageLabel}
              />
            </SoftReveal>

            <header className="mx-auto mt-8 max-w-[30rem] text-center sm:mt-10">
              <SoftReveal>
                <h1 className="calligraphy hero-script hero-script-refined whitespace-nowrap overflow-visible text-charcoal">
                  {content.hero.handwrittenTitle}
                </h1>
              </SoftReveal>
              <SoftReveal
                delay={0.12}
                className="mx-auto mt-3 max-w-[12rem] sm:max-w-[14rem]"
              >
                <p className="hero-subtitle hero-subtitle-refined editorial-body text-ink/64">
                  {content.hero.subtitle}
                </p>
              </SoftReveal>
            </header>

            <div className="mx-auto mt-12 max-w-[56rem] lg:mt-[3.8rem]">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-center lg:gap-12">
                <div className="mx-auto w-full max-w-[13.5rem] sm:max-w-[15rem] lg:mx-0 lg:max-w-[18rem]">
                  <SoftReveal
                    delay={0.16}
                    className="hero-character-shell aspect-[4/5]"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src="/invite/batyrkhan-left-original.png"
                        alt={content.hero.leftImageAlt}
                        fill
                        priority
                        quality={100}
                        sizes="(min-width: 1024px) 18rem, (min-width: 640px) 15rem, 46vw"
                        className="hero-character-image"
                      />
                    </div>
                  </SoftReveal>
                </div>

                <div className="mx-auto flex max-w-[23rem] flex-col items-center text-center lg:mx-0 lg:max-w-[27rem] lg:items-start lg:text-left">
                  <SoftReveal delay={0.08}>
                    <h2 className="hero-name editorial-display text-charcoal/92">
                      {content.boyName}
                    </h2>
                  </SoftReveal>

                  <SoftReveal delay={0.16} className="mt-6 w-20 sm:w-24 lg:w-28">
                    <div className="divider-line" />
                  </SoftReveal>

                  <SoftReveal
                    delay={0.2}
                    className="mt-6 max-w-[18rem] sm:max-w-[20rem] lg:max-w-[22rem]"
                  >
                    <p className="hero-support body-md text-charcoal/72">
                      {content.hero.support}
                    </p>
                  </SoftReveal>

                  <SoftReveal delay={0.24} className="mt-8 w-full sm:w-auto">
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                      <a
                        href="#rsvp"
                        className="invitation-button invitation-button-dark"
                      >
                        {content.hero.responseButton}
                      </a>
                      <a
                        href="#venue"
                        className="invitation-button invitation-button-light"
                      >
                        {content.hero.venueButton}
                      </a>
                    </div>
                  </SoftReveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden -mt-px">
          <div className="story-band-dark text-ivory-soft">
            <div className="page-shell relative z-10 py-24 sm:py-28 lg:py-32">
              <div className="relative mx-auto max-w-[44rem] text-center">
                <SoftReveal>
                  <span className="small-kicker editorial-body text-ivory-soft/42">
                    {content.schedule.line}
                  </span>
                </SoftReveal>

                <MaskReveal delay={0.1} className="mt-6" direction="left">
                  <div className="mx-auto max-w-[39rem]">
                    <SoftReveal>
                      <h2 className="headline-md editorial-display text-ivory-soft">
                        {content.invitation.title}
                      </h2>
                    </SoftReveal>
                    <div className="divider-line mx-auto mt-6 max-w-44" />
                    <p className="body-lg mt-6 text-ivory-soft/88">
                      {content.invitation.body}
                    </p>
                  </div>
                </MaskReveal>

                <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-3">
                  {scheduleRows.map((item) => (
                    <StaggerItem key={item.label}>
                      <div className="border-t border-white/12 pt-4 text-center">
                        <p className="body-sm italic text-ivory-soft/62">
                          {item.label}
                        </p>
                        <p className="body-md mt-2 text-ivory-soft">
                          {item.value}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>

              <div className="mx-auto mt-14 max-w-[64rem] border-t border-white/10 pt-10 sm:mt-16 sm:pt-12 lg:pt-14">
                <div className="grid grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] items-end gap-3 sm:gap-4 lg:grid-cols-[minmax(0,0.66fr)_minmax(0,0.34fr)] lg:gap-5">
                  <div className="min-w-0 max-w-[36rem] pr-1 sm:pr-2 lg:pr-0">
                    <SoftReveal className="mt-0.5">
                      <h3 className="editorial-display text-[1.48rem] leading-[1.04] text-ivory-soft sm:text-[1.75rem] lg:text-[2.25rem]">
                        {content.countdown.title}
                      </h3>
                    </SoftReveal>
                    <SoftReveal
                      delay={0.14}
                      className="mt-3.5 max-w-[18rem] sm:mt-4 sm:max-w-[23rem] lg:mt-5 lg:max-w-[31rem]"
                    >
                      <p className="text-[0.94rem] leading-[1.52] text-ivory-soft/72 sm:text-[1rem] sm:leading-[1.58] lg:text-[1.12rem] lg:leading-[1.68]">
                        {content.countdown.caption}
                      </p>
                    </SoftReveal>

                    <MaskReveal delay={0.2} className="mt-5 sm:mt-6 lg:mt-10">
                      <CountdownTimer
                        targetDate="2026-07-11T15:00:00+05:00"
                        completedText={content.countdown.completedText}
                        labels={content.countdown.labels}
                        tone="dark"
                        compact
                      />
                    </MaskReveal>
                  </div>

                  <div className="w-full max-w-[17.5rem] justify-self-start self-end -ml-[92px] sm:max-w-[16.5rem] sm:-ml-3 lg:max-w-[23rem] lg:justify-self-start lg:-ml-14">
                    <SoftReveal delay={0.22} className="aspect-[4/5]">
                      <div className="relative h-full w-full origin-bottom-left scale-[2.2] translate-y-[43px] sm:scale-100 sm:translate-y-[47px] lg:translate-y-[55px]">
                        <Image
                          src="/invite/batyrkhan-right-original.png"
                          alt={content.countdown.rightImageAlt}
                          fill
                          quality={100}
                          sizes="(min-width: 1024px) 23rem, (min-width: 640px) 16.5rem, 56vw"
                          className="object-contain object-right-bottom"
                        />
                      </div>
                    </SoftReveal>
                  </div>
                </div>
              </div>

              <div
                id="venue"
                className="mx-auto mt-12 max-w-[64rem] border-t border-white/10 pt-10 sm:mt-14 sm:pt-12"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)] lg:items-start">
                  <div className="mx-auto max-w-[24rem] text-center lg:mx-0 lg:text-left">
                    <SoftReveal>
                      <span className="small-kicker editorial-body text-ivory-soft/42">
                        {content.schedule.line}
                      </span>
                    </SoftReveal>
                    <SoftReveal delay={0.08} className="mt-4">
                      <h2 className="headline-md editorial-display text-ivory-soft">
                        {content.venue.title}
                      </h2>
                    </SoftReveal>
                  </div>

                  <StaggerGroup className="space-y-6">
                    <StaggerItem>
                      <DetailRow
                        label={content.venue.labels.place}
                        value={content.venue.name}
                        tone="dark"
                      />
                    </StaggerItem>
                    <StaggerItem>
                      <DetailRow
                        label={content.venue.labels.city}
                        value={content.venue.address}
                        tone="dark"
                      />
                    </StaggerItem>
                    <StaggerItem>
                      <DetailRow
                        label={content.venue.labels.hosts}
                        value={content.hosts}
                        tone="dark"
                      />
                    </StaggerItem>
                    <StaggerItem className="pt-3">
                      <a
                        href={content.venue.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="invitation-button venue-map-button"
                      >
                        {content.venue.mapButton}
                      </a>
                    </StaggerItem>
                  </StaggerGroup>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="photo" className="-mt-px story-section ambient-light-surface ambient-light-gallery">
          <div className="page-shell relative z-10">
            <div className="mx-auto max-w-[42rem] text-center">
              <SoftReveal>
                <h2 className="headline-lg editorial-display text-ink">
                  {content.photo.title}
                </h2>
              </SoftReveal>

              <SoftReveal delay={0.08} className="mx-auto mt-5 max-w-[34rem]">
                <p className="body-md text-ink/74">{content.photo.description}</p>
              </SoftReveal>

              <SoftReveal delay={0.14} className="mx-auto mt-7 w-28">
                <div className="divider-line" />
              </SoftReveal>

              <SoftReveal delay={0.18} className="mx-auto mt-7 max-w-[34rem]">
                <p className="body-md text-ink/72">{content.venue.note}</p>
              </SoftReveal>
            </div>
          </div>
        </section>

        <section
          id="rsvp"
          className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden -mt-px"
        >
          <div className="story-band-soft ambient-soft-surface">
            <div className="page-shell relative z-10 py-24 sm:py-28 lg:py-32">
              <div className="grid gap-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
                <div className="rsvp-intro mx-auto max-w-[28rem] text-center lg:mx-0 lg:text-left">
                  <SoftReveal>
                    <span className="small-kicker editorial-body text-ink/54">
                      {content.rsvp.eyebrow}
                    </span>
                  </SoftReveal>
                  <SoftReveal delay={0.08} className="mt-4">
                    <h2 className="headline-lg editorial-display text-ink/96">
                      {content.rsvp.title}
                    </h2>
                  </SoftReveal>
                  <SoftReveal delay={0.1} className="mt-5">
                    <p className="body-md text-ink/78">
                      {content.rsvp.description}
                    </p>
                  </SoftReveal>
                  <SoftReveal delay={0.16} className="mx-auto mt-8 w-24 lg:mx-0">
                    <div className="divider-line" />
                  </SoftReveal>
                  <SoftReveal delay={0.22} className="mt-8">
                    <p className="editorial-display text-[2rem] leading-[1.02] text-ink/92 sm:text-[2.25rem]">
                      {content.schedule.dateValue}
                    </p>
                  </SoftReveal>
                </div>

                <MaskReveal className="rsvp-shell-wrap lg:pl-10">
                  <div className="rsvp-shell">
                    <RsvpForm copy={content.rsvp} />
                  </div>
                </MaskReveal>
              </div>
            </div>
          </div>
        </section>

        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden -mt-px bg-charcoal-deep text-ivory-soft ending-surface">
          <div className="page-shell relative z-10 pt-20 pb-10 text-center sm:pt-24 sm:pb-12 lg:pt-24 lg:pb-14">
            <SoftReveal>
              <span className="small-kicker editorial-body text-ivory-soft/42">
                {content.closing.eyebrow}
              </span>
            </SoftReveal>
            <SoftReveal delay={0.1} className="mt-4">
              <h2 className="headline-sm editorial-display text-ivory-soft">
                {content.closing.title}
              </h2>
            </SoftReveal>
            <SoftReveal delay={0.16} className="mx-auto mt-6 max-w-2xl">
              <p className="body-lg text-ivory-soft/76">
                {content.closing.text}
              </p>
            </SoftReveal>

            <SoftReveal delay={0.24} className="mx-auto mt-16 max-w-[56rem] sm:mt-20">
              <footer className="ending-footer mx-auto max-w-[46rem]">
                <p className="body-sm text-ivory-soft/64">{content.footer.rights}</p>
                <div className="ending-footer-grid">
                  <p className="body-sm text-ivory-soft/72">
                    {content.footer.author}
                  </p>
                  <p className="body-sm text-ivory-soft/72">
                    {content.footer.support}
                  </p>
                  <p className="body-sm text-ivory-soft/72">
                    {content.footer.email}
                  </p>
                </div>
              </footer>
            </SoftReveal>
          </div>
        </section>
      </main>
    </MotionProvider>
  );
}
