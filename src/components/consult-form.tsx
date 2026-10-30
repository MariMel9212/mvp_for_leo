"use client";

import { useState, type FormEvent } from "react";

type Channel = "call" | "messenger";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  if (digits.length === 0) return "";
  let result = `(${parts[0]}`;
  if (digits.length < 3) return result;
  result += ")";
  if (parts[1]) result += ` ${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;
  return result;
}

export function ConsultForm() {
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<Channel>("call");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || digits.length < 10) {
      setError("Укажите имя и телефон");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <section className="relative mt-[120px] h-[636px] w-[1440px] overflow-hidden rounded-[29px] bg-gradient-to-b from-[rgba(229,246,255,0.45)] to-[rgba(209,239,255,0.45)]">
      <div className="absolute top-[52px] left-[120px] flex w-[604px] flex-col gap-[24px] text-black">
        <h2 className="text-40 font-medium">
          Расскажите о своей проблеме, и мы подберем профильное учереждение
        </h2>
        <p className="text-16">Консультация бесплатна и анонимна</p>
      </div>

      <div className="pointer-events-none absolute top-[-23px] left-[1236px] flex h-[243.212px] w-[271.782px] items-center justify-center">
        <div className="-scale-y-100 rotate-[-21.54deg]">
          <img alt="" src="/consult/leaf-top.svg" width={223.858} height={173.671} />
        </div>
      </div>
      <div className="pointer-events-none absolute top-[356px] left-[-81px] flex h-[367.399px] w-[516.307px] items-center justify-center">
        <div className="rotate-[2.26deg]">
          <img alt="" src="/consult/sheets.svg" width={503} height={347.863} />
        </div>
      </div>
      <div className="pointer-events-none absolute top-[515px] left-[807px] flex h-[158.12px] w-[167.658px] items-center justify-center">
        <div className="rotate-[177.41deg]">
          <img alt="" src="/consult/leaf-bottom.svg" width={161} height={151} />
        </div>
      </div>

      <form
        onSubmit={submit}
        className="absolute top-[50px] left-[919px] flex w-[415px] flex-col items-center gap-[36px] rounded-[23px] bg-white px-[20px] py-[24px]"
        noValidate
      >
        <h3 className="w-[367px] text-center text-24 font-medium">
          Бесплатная консультация по&nbsp;подбору учереждения
        </h3>

        <label className="flex w-full flex-col gap-[10px]">
          <span className="text-18">Имя</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Укажите как к вам можно обращаться"
            autoComplete="name"
            aria-invalid={error !== "" && !name.trim()}
            className="h-[60px] rounded-[16px] border border-solid border-[#dedede] bg-white pr-[14px] pl-[24px] text-18 text-black outline-none placeholder:text-black placeholder:opacity-40"
          />
        </label>

        <div className="flex w-full flex-col gap-[16px]">
          <div className="flex w-full flex-col gap-[10px]">
            <span className="text-18" id="contact-channel">
              Способ связи
            </span>
            <div role="tablist" aria-labelledby="contact-channel" className="flex h-[40px] gap-[4px] rounded-[10px] bg-[#f6f8fa] p-[4px]">
              {(
                [
                  ["call", "Звонок"],
                  ["messenger", "Мессенджер"],
                ] as const
              ).map(([value, label]) => {
                const active = channel === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setChannel(value)}
                    className={`flex h-[32px] flex-1 items-center justify-center rounded-[8px] px-[14px] text-16 text-black ${active ? "bg-white" : "opacity-50"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex h-[60px] items-center gap-[16px] rounded-[16px] border border-solid border-[#dedede] bg-white pr-[14px] pl-[24px]">
            <span className="flex items-center gap-[8px]">
              <span className="flex h-[18px] w-[24px] flex-col overflow-hidden rounded-[2px] border-[0.5px] border-solid border-[#dedede]">
                <span className="h-[6px] bg-white" />
                <span className="h-[6px] bg-[#0039a6]" />
                <span className="h-[6px] bg-[#d52b1e]" />
              </span>
              <span className="text-18">+7</span>
              <img alt="" src="/consult/chevron-down.svg" width={24} height={24} />
            </span>
            <span className="h-[24px] w-px bg-[#dedede]" />
            <input
              value={phone}
              onChange={(event) => setPhone(formatPhone(event.target.value))}
              inputMode="tel"
              autoComplete="tel"
              placeholder="(999) 123-45-67"
              aria-label="Телефон"
              aria-invalid={error !== "" && phone.replace(/\D/g, "").length < 10}
              className="min-w-0 flex-1 bg-transparent text-18 text-black outline-none placeholder:text-black placeholder:opacity-40"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={sent}
          className="flex h-[56px] w-full items-center justify-center rounded-[12px] bg-[#e1f300] px-[20px] text-18 leading-[24px] font-medium text-black disabled:opacity-80"
        >
          {sent ? "Заявка отправлена" : "Отправить заявку"}
        </button>
        {error ? <p className="-mt-[20px] text-16 text-black opacity-60">{error}</p> : null}
      </form>
    </section>
  );
}
