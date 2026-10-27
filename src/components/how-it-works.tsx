"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const NAME = "Мария";
const PHONE = "+7 916 000-00-00";
const ANSWER = "Нужна помощь для близкого";
const CENTER_NAMES = [
  "Реабилитационный центр в Химках",
  "Медикаментозная терапия",
];

const STEPS = [
  {
    id: "request",
    title: "Оставьте заявку",
    body: (
      <>
        Укажите удобный для Вас способ связи и&nbsp;ваш контакт. Заявка на
        сайте анонимна и&nbsp;конфедециальна
      </>
    ),
  },
  {
    id: "situation",
    title: "Расскажите о\u00a0ситуации",
    body: (
      <>
        Коротко опишите, что происходит. Этого достаточно, чтобы подобрать
        центр.
      </>
    ),
  },
  {
    id: "centers",
    title: "Подберём варианты",
    body: <>Два центра, которые подходят под&nbsp;ваш запрос.</>,
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];
type Phase = "assemble" | "type-name" | "type-phone" | "type-answer";
type Field = "name" | "phone" | "answer";
type Travel = "below" | "in" | "above";

function wait(ms: number, timers: number[]) {
  return new Promise<void>((resolve) => {
    timers.push(window.setTimeout(resolve, ms));
  });
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [step, setStep] = useState<StepId>("request");
  const [phase, setPhase] = useState<Phase>("assemble");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [answer, setAnswer] = useState("");
  const [pressed, setPressed] = useState(false);
  const [hot, setHot] = useState<Field | null>(null);
  const [cursorOn, setCursorOn] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [cursor, setCursor] = useState({ x: 300, y: 420 });
  const [travel, setTravel] = useState<Travel>("below");
  const [travelOn, setTravelOn] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !shown) return;
    let cancelled = false;
    const timers: number[] = [];

    const place = (target: HTMLElement | null, shiftX = 0, shiftY = 0) => {
      const stage = stageRef.current;
      if (!stage || !target) return;
      const bounds = stage.getBoundingClientRect();
      const spot = target.getBoundingClientRect();
      const anchorX =
        target === sendRef.current ? spot.width * 0.42 : Math.min(34, spot.width * 0.18);
      setCursor({
        x: spot.left - bounds.left + anchorX + shiftX,
        y: spot.top - bounds.top + spot.height * 0.42 + shiftY,
      });
    };

    const click = async (target: HTMLElement | null, field: Field | null) => {
      setCursorOn(false);
      place(target, 34, 26);
      await wait(40, timers);
      if (cancelled) return;
      setCursorOn(true);
      await wait(70, timers);
      place(target);
      await wait(480, timers);
      if (cancelled) return;
      setClicking(true);
      if (field) setHot(field);
      if (field === null) setPressed(true);
      await wait(130, timers);
      setClicking(false);
      setHot(null);
      if (field === null) setPressed(false);
      await wait(90, timers);
      setCursorOn(false);
      await wait(200, timers);
    };

    const show = async (next: StepId) => {
      setTravelOn(false);
      setTravel("below");
      setStep(next);
      setCycle((value) => value + 1);
      setPhase("assemble");
      setName("");
      setPhone("");
      setAnswer("");
      setPressed(false);
      setHot(null);
      setCursorOn(false);
      setClicking(false);
      await wait(220, timers);
      if (cancelled) return;
      setTravelOn(true);
      await wait(40, timers);
      setTravel("in");
      await wait(next === "request" ? 1280 : 860, timers);
    };

    const hide = async () => {
      setCursorOn(false);
      setTravel("above");
      await wait(820, timers);
    };

    const run = async () => {
      await wait(50, timers);
      while (!cancelled) {
        await show("request");
        if (cancelled) return;

        await click(nameRef.current, "name");
        if (cancelled) return;
        setPhase("type-name");
        for (const letter of NAME) {
          if (cancelled) return;
          setName((value) => value + letter);
          await wait(110, timers);
        }
        await wait(380, timers);
        if (cancelled) return;

        await click(phoneRef.current, "phone");
        if (cancelled) return;
        setPhase("type-phone");
        for (const letter of PHONE) {
          if (cancelled) return;
          setPhone((value) => value + letter);
          await wait(75, timers);
        }
        await wait(380, timers);
        if (cancelled) return;

        await click(sendRef.current, null);
        if (cancelled) return;
        await hide();
        if (cancelled) return;

        await show("situation");
        if (cancelled) return;
        await click(answerRef.current, "answer");
        if (cancelled) return;
        setPhase("type-answer");
        for (const letter of ANSWER) {
          if (cancelled) return;
          setAnswer((value) => value + letter);
          await wait(78, timers);
        }
        await wait(640, timers);
        if (cancelled) return;
        await hide();
        if (cancelled) return;

        await show("centers");
        if (cancelled) return;
        await wait(1700, timers);
        if (cancelled) return;
        await hide();
      }
    };

    void run();
    return () => {
      cancelled = true;
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [reduced, shown]);

  const copy = STEPS.find((item) => item.id === step) ?? STEPS[0];
  const motionClass =
    reduced || travel === "in"
      ? "translate-y-0"
      : travel === "above"
        ? "-translate-y-[920px]"
        : "translate-y-[920px]";
  const motionStyle = {
    transition:
      travelOn && !reduced ? "translate 0.75s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
  };

  return (
    <section
      id="kak-rabotaet"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[940px] overflow-x-clip px-4 pt-20 pb-16 min-[768px]:pt-28 min-[768px]:pb-24 min-[1440px]:max-w-[1180px] min-[1440px]:pt-36 min-[1440px]:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-8 size-[445px] rounded-full blur-[48px]"
        style={{
          right: "calc(100% + 90px)",
          background:
            "radial-gradient(circle, #fff 0%, rgba(65,255,55,0.19) 68%, transparent 78%)",
        }}
      />
      <h2 className="text-center text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[56px]">
        Как работает подбор
      </h2>

      <div className="mt-12 flex flex-col items-start gap-10 min-[900px]:mt-16 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
        <div className="h-[132px] max-w-[319px] overflow-hidden min-[1440px]:h-[156px]">
          <div className={motionClass} style={motionStyle}>
            <h3 className="text-[28px] leading-[1.1] font-medium text-black min-[1440px]:text-[34px]">
              {copy.title}
            </h3>
            <p className="mt-3 text-[16px] leading-[1.35] font-normal text-black min-[1440px]:text-[18px]">
              {copy.body}
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[620px] w-full max-w-[464px] flex-col justify-center overflow-hidden rounded-[14px] bg-[#f7f7f7] px-[34px] py-16 min-[900px]:mx-0 min-[900px]:min-h-[700px] min-[1440px]:min-h-[760px]">
          <div
            ref={stageRef}
            className={cn("relative w-full", motionClass)}
            style={motionStyle}
          >
            {step === "request" && (
            <article
              key={cycle}
              aria-hidden
              className="rounded-[18px] border border-black/8 bg-white px-7 pt-7 pb-6 shadow-[0_2px_4px_rgba(27,28,29,0.04)]"
            >
              <div className="flex flex-col items-center gap-[7px] motion-safe:[animation:form-in_0.6s_ease_both]">
                <div className="rounded-full border border-[#e4e5e7] bg-gradient-to-b from-[#e4e5e7]/50 to-transparent p-3.5">
                  <div className="grid size-12 place-items-center rounded-full border border-[#e2e4e9] bg-white shadow-[0_2px_4px_rgba(27,28,29,0.04)]">
                    <img src="/form/user.svg" alt="" className="size-[23px]" />
                  </div>
                </div>
                <p className="text-center text-[22px] leading-[1.3] font-medium text-[#0a0d14]">
                  Заявка на подбор центра
                </p>
              </div>

              <img
                src="/form/divider.svg"
                alt=""
                className="mt-5 block h-px w-full motion-safe:[animation:form-in_0.6s_ease_both] motion-safe:[animation-delay:120ms]"
              />

              <div className="mt-4 flex flex-col gap-[11px]">
                <label className="motion-safe:[animation:form-in_0.6s_ease_both] motion-safe:[animation-delay:220ms]">
                  <span className="font-[family-name:var(--font-inter)] text-[13px] leading-[18px] font-medium tracking-[-0.08px] text-[#0a0d14]">
                    Имя
                  </span>
                  <div
                    ref={nameRef}
                    className={cn(
                      "mt-1 flex items-center rounded-[10px] border border-[#e2e4e9] bg-white py-2.5 pr-3 pl-[11px] shadow-[0_1px_2px_rgba(228,229,231,0.24)] transition-[box-shadow,transform] duration-150",
                      hot === "name" &&
                        "scale-[0.985] shadow-[0_1px_2px_rgba(228,229,231,0.24),0_0_0_3px_rgba(17,171,9,0.14)]",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex shrink-0 overflow-hidden transition-[width,margin,opacity] duration-300 ease-out",
                        name ? "mr-0 w-0 opacity-0" : "mr-2 w-[18px] opacity-100",
                      )}
                    >
                      <img src="/form/user-line.svg" alt="" className="size-[18px] max-w-none" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-[13px] leading-[18px] tracking-[-0.08px]">
                      {name ? (
                        <span className="text-[#0a0d14]">
                          {name}
                          {phase === "type-name" && <Caret />}
                        </span>
                      ) : (
                        <span className="text-[#868c98]">
                          Как к вам можно обращаться
                        </span>
                      )}
                    </span>
                  </div>
                </label>

                <div className="motion-safe:[animation:form-in_0.6s_ease_both] motion-safe:[animation-delay:340ms]">
                  <p className="font-[family-name:var(--font-inter)] text-[13px] leading-[18px] font-medium tracking-[-0.08px] text-[#0a0d14]">
                    Способ связи
                    <span className="text-[#11ab09]">*</span>
                  </p>
                  <div className="mt-1 flex gap-1 rounded-[9px] bg-[#f6f8fa] p-[2px]">
                    <span className="flex flex-1 items-center justify-center rounded-[7px] bg-white px-2 py-[5px] text-[13px] leading-[18px] font-medium text-[#0a0d14]">
                      Звонок
                    </span>
                    <span className="flex flex-1 items-center justify-center rounded-[5px] px-2 py-[5px] text-[13px] leading-[18px] font-medium text-[#868c98]">
                      Мессенджер
                    </span>
                  </div>
                </div>

                <label className="motion-safe:[animation:form-in_0.6s_ease_both] motion-safe:[animation-delay:460ms]">
                  <span className="font-[family-name:var(--font-inter)] text-[13px] leading-[18px] font-medium tracking-[-0.08px] text-[#0a0d14]">
                    Номер телефона
                    <span className="text-[#11ab09]">*</span>
                  </span>
                  <div
                    ref={phoneRef}
                    className={cn(
                      "mt-1 rounded-[10px] border border-[#e2e4e9] bg-white px-[11px] py-2.5 shadow-[0_1px_2px_rgba(228,229,231,0.24)] transition-[box-shadow,transform] duration-150",
                      hot === "phone" &&
                        "scale-[0.985] shadow-[0_1px_2px_rgba(228,229,231,0.24),0_0_0_3px_rgba(17,171,9,0.14)]",
                    )}
                  >
                    <span className="flex items-center font-[family-name:var(--font-inter)] text-[13px] leading-[18px] tracking-[-0.08px]">
                      {phone ? (
                        <>
                          <span className="inline-block text-[#0a0d14] blur-[1.5px]">
                            {phone}
                          </span>
                          {phase === "type-phone" && <Caret />}
                        </>
                      ) : (
                        <span className="text-[#868c98]">
                          Контактный номер для связи
                        </span>
                      )}
                    </span>
                  </div>
                </label>

                <div
                  ref={sendRef}
                  className={cn(
                    "mt-1 flex items-center justify-center rounded-[10px] border-0 px-[7px] py-[9px] transition-transform motion-safe:[animation:form-in_0.6s_ease_both] motion-safe:[animation-delay:580ms]",
                    pressed && "scale-[0.98]",
                  )}
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, #11ab09 0%, #11ab09 100%)",
                    boxShadow:
                      "0 0.9px 1.8px 0 rgba(17,171,9,0.48), 0 0 0 0.9px #11ab09",
                  }}
                >
                  <span className="px-1 font-[family-name:var(--font-inter)] text-[12.6px] leading-[18px] font-medium tracking-[-0.075px] text-white">
                    Отправить
                  </span>
                </div>
              </div>
            </article>
            )}

            {step === "situation" && (
              <article
                key={cycle}
                aria-hidden
                className="rounded-[18px] border border-black/8 bg-white px-7 py-8 shadow-[0_2px_4px_rgba(27,28,29,0.04)]"
              >
                <p className="text-[22px] leading-[1.3] font-medium text-[#0a0d14]">
                  Что сейчас происходит?
                </p>
                <p className="mt-2 text-[14px] leading-[1.4] text-[#0a0d14]/45">
                  Пара слов, без подробностей
                </p>
                <div
                  ref={answerRef}
                  className={cn(
                    "mt-6 min-h-[96px] rounded-[10px] border border-[#e2e4e9] bg-white px-3 py-3 shadow-[0_1px_2px_rgba(228,229,231,0.24)] transition-[box-shadow,transform] duration-150",
                    hot === "answer" &&
                      "scale-[0.985] shadow-[0_1px_2px_rgba(228,229,231,0.24),0_0_0_3px_rgba(17,171,9,0.14)]",
                  )}
                >
                  <span className="font-[family-name:var(--font-inter)] text-[15px] leading-[1.45] tracking-[-0.08px]">
                    {answer ? (
                      <span className="text-[#0a0d14]">
                        {answer}
                        {phase === "type-answer" && <Caret />}
                      </span>
                    ) : (
                      <span className="text-[#868c98]">Напишите пару слов</span>
                    )}
                  </span>
                </div>
              </article>
            )}

            {step === "centers" && (
              <article
                key={cycle}
                aria-hidden
                className="rounded-[18px] border border-black/8 bg-white px-7 py-8 shadow-[0_2px_4px_rgba(27,28,29,0.04)]"
              >
                <p className="font-[family-name:var(--font-inter)] text-[13px] leading-[18px] font-medium tracking-[-0.08px] text-[#868c98]">
                  Подходящие центры
                </p>
                <div className="mt-5 flex flex-col">
                  {CENTER_NAMES.map((center, index) => (
                    <p
                      key={center}
                      className={cn(
                        "py-4 text-[21px] leading-[1.25] font-medium text-black motion-safe:[animation:form-in_0.6s_ease_both]",
                        index > 0 && "border-t border-[#e2e4e9]",
                      )}
                      style={{ animationDelay: `${120 + index * 180}ms` }}
                    >
                      {center}
                    </p>
                  ))}
                </div>
              </article>
            )}

            {!reduced && step !== "centers" && (
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute z-10 origin-top-left drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]",
                  cursorOn ? "opacity-100" : "opacity-0",
                  clicking && "scale-[0.82]",
                )}
                style={{
                  left: cursor.x,
                  top: cursor.y,
                  transition: cursorOn
                    ? "left 0.48s ease-out, top 0.48s ease-out, opacity 0.2s linear, transform 0.12s ease-out"
                    : "opacity 0.18s linear",
                }}
              >
                <Cursor />
              </span>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}

function Caret() {
  return (
    <span
      data-caret
      className="ml-px inline-block h-[1em] w-px shrink-0 translate-y-[2px] bg-current motion-safe:animate-pulse"
    />
  );
}

function Cursor() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M4 2.2 L4.4 17.2 L8.6 13.2 L12.3 20 L15.1 18.7 L11.3 12.1 L16.8 11.6 Z"
        fill="#111"
        stroke="white"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
