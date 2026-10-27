"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  "Заполните заявку, указав удобный метод связи",
  "Расскажите о\u00a0ситуации",
  "Мы подберем несколько вариантов под\u00a0ваши критерии",
  "Свяжем вас с\u00a0центром и\u00a0сопроводим на\u00a0моменте подписания договора",
];

const NAME = "Мария";
const PHONE = "916 000-00-00";

type Phase = "assemble" | "name" | "phone" | "send" | "leave";

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
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<Phase>("assemble");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pressed, setPressed] = useState(false);
  const [cursor, setCursor] = useState({ x: 300, y: 420 });

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

    const place = (target: HTMLElement | null) => {
      const stage = stageRef.current;
      if (!stage || !target) return;
      const bounds = stage.getBoundingClientRect();
      const spot = target.getBoundingClientRect();
      setCursor({
        x: spot.left - bounds.left + Math.min(spot.width * 0.62, spot.width - 16),
        y: spot.top - bounds.top + spot.height * 0.7,
      });
    };

    const run = async () => {
      await wait(50, timers);
      while (!cancelled) {
        setCycle((value) => value + 1);
        setPhase("assemble");
        setName("");
        setPhone("");
        setPressed(false);
        setCursor({ x: 320, y: 430 });
        await wait(1500, timers);
        if (cancelled) return;

        setPhase("name");
        place(nameRef.current);
        await wait(520, timers);
        for (const letter of NAME) {
          if (cancelled) return;
          setName((value) => value + letter);
          await wait(110, timers);
        }
        await wait(320, timers);
        if (cancelled) return;

        setPhase("phone");
        place(phoneRef.current);
        await wait(520, timers);
        for (const letter of PHONE) {
          if (cancelled) return;
          setPhone((value) => value + letter);
          await wait(70, timers);
        }
        await wait(360, timers);
        if (cancelled) return;

        setPhase("send");
        place(sendRef.current);
        await wait(560, timers);
        setPressed(true);
        await wait(140, timers);
        setPressed(false);
        await wait(180, timers);
        if (cancelled) return;

        setPhase("leave");
        await wait(860, timers);
        await wait(280, timers);
      }
    };

    void run();
    return () => {
      cancelled = true;
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [reduced, shown]);

  const cursorOn = phase === "name" || phase === "phone" || phase === "send";

  return (
    <section
      id="kak-rabotaet"
      ref={sectionRef}
      className="mx-auto w-full max-w-[940px] px-4 pt-16 pb-8 min-[768px]:pt-24 min-[1440px]:max-w-[1180px] min-[1440px]:pt-28"
    >
      <h2 className="text-center text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[56px]">
        Как работает подбор
      </h2>

      <div className="mt-12 flex flex-col items-start gap-10 min-[900px]:mt-16 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
        <div className="max-w-[319px]">
          <h3 className="text-[28px] leading-[1.1] font-medium text-black min-[1440px]:text-[34px]">
            Оставьте заявку
          </h3>
          <p className="mt-3 text-[16px] leading-[1.35] font-normal text-black min-[1440px]:text-[18px]">
            Укажите удобный для Вас способ связи и&nbsp;ваш контакт. Заявка на
            сайте анонимна и&nbsp;конфедециальна
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[395px] overflow-hidden px-1 py-3 min-[900px]:mx-0">
          <div
            ref={stageRef}
            className={cn(
              "relative transition-[transform,opacity] duration-700 ease-in",
              phase === "leave" && "-translate-y-[120%] scale-[0.97] opacity-0",
            )}
          >
            <article
              key={cycle}
              aria-hidden
              className="rounded-[18px] border border-black/8 bg-white px-7 pt-7 pb-6 shadow-[0_2px_4px_rgba(27,28,29,0.04)]"
            >
              <div className="flex flex-col items-center gap-[7px] motion-safe:[animation:form-in_0.55s_ease_both]">
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
                className="mt-5 block h-px w-full motion-safe:[animation:form-in_0.55s_ease_both] motion-safe:[animation-delay:80ms]"
              />

              <div className="mt-4 flex flex-col gap-[11px]">
                <label className="motion-safe:[animation:form-in_0.55s_ease_both] motion-safe:[animation-delay:140ms]">
                  <span className="font-[family-name:var(--font-inter)] text-[13px] leading-[18px] font-medium tracking-[-0.08px] text-[#0a0d14]">
                    Имя
                  </span>
                  <div
                    ref={nameRef}
                    className="mt-1 flex items-center gap-2 rounded-[10px] border border-[#e2e4e9] bg-white py-2.5 pr-3 pl-[11px] shadow-[0_1px_2px_rgba(228,229,231,0.24)]"
                  >
                    <img src="/form/user-line.svg" alt="" className="size-[18px] shrink-0" />
                    <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-[13px] leading-[18px] tracking-[-0.08px]">
                      {name ? (
                        <span className="text-[#0a0d14]">
                          {name}
                          {phase === "name" && <Caret />}
                        </span>
                      ) : (
                        <span className="text-[#868c98]">
                          Как к вам можно обращаться
                          {phase === "name" && <Caret />}
                        </span>
                      )}
                    </span>
                  </div>
                </label>

                <div className="motion-safe:[animation:form-in_0.55s_ease_both] motion-safe:[animation-delay:200ms]">
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

                <label className="motion-safe:[animation:form-in_0.55s_ease_both] motion-safe:[animation-delay:260ms]">
                  <span className="font-[family-name:var(--font-inter)] text-[13px] leading-[18px] font-medium tracking-[-0.08px] text-[#0a0d14]">
                    Номер телефона
                    <span className="text-[#11ab09]">*</span>
                  </span>
                  <div
                    ref={phoneRef}
                    className="mt-1 rounded-[10px] border border-[#e2e4e9] bg-white px-[11px] py-2.5 shadow-[0_1px_2px_rgba(228,229,231,0.24)]"
                  >
                    <span className="block truncate font-[family-name:var(--font-inter)] text-[13px] leading-[18px] tracking-[-0.08px]">
                      {phone ? (
                        <span className="text-[#0a0d14]">
                          {phone}
                          {phase === "phone" && <Caret />}
                        </span>
                      ) : (
                        <span className="text-[#868c98]">
                          Контактный номер для связи
                          {phase === "phone" && <Caret />}
                        </span>
                      )}
                    </span>
                  </div>
                </label>

                <div
                  ref={sendRef}
                  className={cn(
                    "mt-1 flex items-center justify-center rounded-[10px] border border-white bg-[#11ab09] px-2 py-2.5 shadow-[0_1px_2px_rgba(17,171,9,0.48),0_0_0_1px_#11ab09] motion-safe:[animation:form-in_0.55s_ease_both] motion-safe:[animation-delay:320ms]",
                    pressed && "scale-[0.98]",
                  )}
                >
                  <span className="font-[family-name:var(--font-inter)] text-[13px] leading-[18px] font-medium tracking-[-0.08px] text-white">
                    Отправить
                  </span>
                </div>
              </div>
            </article>

            {!reduced && (
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-[left,top,opacity] duration-500 ease-out",
                  cursorOn ? "opacity-100" : "opacity-0",
                )}
                style={{ left: cursor.x, top: cursor.y }}
              >
                <Cursor />
              </span>
            )}
          </div>
        </div>
      </div>

      <ol className="mt-16 flex max-w-[640px] flex-col gap-8 min-[768px]:mt-20">
        {steps.map((text) => (
          <li
            key={text}
            className="text-[17px] leading-5 font-medium tracking-[-0.102px] text-[#0a0d14]"
          >
            {text}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Caret() {
  return (
    <span className="ml-px inline-block h-[1em] w-px translate-y-[2px] bg-current motion-safe:animate-pulse" />
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
