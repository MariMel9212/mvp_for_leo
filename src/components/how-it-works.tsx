"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
        x: spot.left - bounds.left + spot.width * 0.5 - 6,
        y: spot.top - bounds.top + spot.height * 0.45,
      });
    };

    const placeCaret = () => {
      const stage = stageRef.current;
      const caret = stage?.querySelector("[data-caret]");
      if (!stage || !caret) return;
      const bounds = stage.getBoundingClientRect();
      const spot = caret.getBoundingClientRect();
      setCursor({
        x: spot.left - bounds.left - 1,
        y: spot.top - bounds.top + 1,
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
        await wait(40, timers);
        placeCaret();
        await wait(480, timers);
        for (const letter of NAME) {
          if (cancelled) return;
          setName((value) => value + letter);
          await wait(40, timers);
          placeCaret();
          await wait(70, timers);
        }
        await wait(280, timers);
        if (cancelled) return;

        setPhase("phone");
        await wait(40, timers);
        placeCaret();
        await wait(480, timers);
        for (const letter of PHONE) {
          if (cancelled) return;
          setPhone((value) => value + letter);
          await wait(30, timers);
          placeCaret();
          await wait(50, timers);
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
      className="relative mx-auto w-full max-w-[940px] overflow-x-clip px-4 pt-16 pb-8 min-[768px]:pt-24 min-[1440px]:max-w-[1180px] min-[1440px]:pt-28"
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
        <div className="max-w-[319px]">
          <h3 className="text-[28px] leading-[1.1] font-medium text-black min-[1440px]:text-[34px]">
            Оставьте заявку
          </h3>
          <p className="mt-3 text-[16px] leading-[1.35] font-normal text-black min-[1440px]:text-[18px]">
            Укажите удобный для Вас способ связи и&nbsp;ваш контакт. Заявка на
            сайте анонимна и&nbsp;конфедециальна
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[464px] overflow-hidden rounded-[14px] bg-[#f7f7f7] px-[34px] py-[50px] min-[900px]:mx-0">
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
                    className="mt-1 flex items-center rounded-[10px] border border-[#e2e4e9] bg-white py-2.5 pr-3 pl-[11px] shadow-[0_1px_2px_rgba(228,229,231,0.24)]"
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
                    <span className="flex items-center font-[family-name:var(--font-inter)] text-[13px] leading-[18px] tracking-[-0.08px]">
                      {phone ? (
                        <>
                          <span className="inline-block text-[#0a0d14] blur-[3.5px]">
                            {phone}
                          </span>
                          {phase === "phone" && <Caret />}
                        </>
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
                    "mt-1 flex items-center justify-center rounded-[10px] border-0 px-[7px] py-[9px] transition-transform motion-safe:[animation:form-in_0.55s_ease_both] motion-safe:[animation-delay:320ms]",
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
