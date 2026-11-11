"use client";

import { useEffect, useState } from "react";
import { AmenityIcon } from "@/components/amenity-icons";
import { CallRequestButton } from "@/components/call-request-modal";
import type { CenterPageData, CenterPhoto } from "@/content/centers/types";
import { asset } from "@/lib/base-path";
import { tie } from "@/lib/tie";

const textAction =
  "ml-auto inline-flex w-fit cursor-pointer items-center text-16 font-medium whitespace-nowrap text-[#525357] transition-colors duration-150 hover:text-[#27292d]";

const previewAmenityCount = 6;

export function CenterPage({ center }: { center: CenterPageData }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [openHint, setOpenHint] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const previewAmenities = center.amenities.slice(0, previewAmenityCount);
  const hasMoreAmenities = center.amenities.length > previewAmenityCount;

  useEffect(() => {
    if (!galleryOpen && !amenitiesOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setGalleryOpen(false);
      setAmenitiesOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [galleryOpen, amenitiesOpen]);

  return (
    <div className="mx-auto mt-6 w-full max-w-[1200px] px-0 pb-16 max-[1439px]:px-4 min-[1440px]:pb-[80px]">
      <GalleryCollage center={center} onOpen={() => setGalleryOpen(true)} />

      <div className="mt-8 flex flex-col gap-6 min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:justify-between min-[1100px]:gap-8">
        <div className="contents min-[1100px]:flex min-[1100px]:w-[612px] min-[1100px]:shrink-0 min-[1100px]:flex-col min-[1100px]:gap-[30px]">
          <header className="order-1 flex flex-col gap-[16px] min-[1100px]:border-b min-[1100px]:border-[rgba(0,0,0,0.04)] min-[1100px]:pb-[32px] min-[1100px]:order-none">
            <div className="flex flex-col gap-[6px]">
              <h1 className="text-28 font-medium">{tie(center.title)}</h1>
              <p className="text-18">{center.region}</p>
            </div>
            <CallRequestButton
              label="Выбрать центр"
              topic={center.title}
              className="lime-control flex h-[38px] w-fit items-center justify-center rounded-[8px] px-[20px] text-16 drop-shadow-[0_4px_2px_rgba(173,173,173,0.1)]"
            />
          </header>

          <section className="order-3 flex flex-col gap-[24px] border-b border-[rgba(0,0,0,0.04)] pb-[32px] min-[1100px]:order-none">
            <div className="flex flex-col gap-[10px]">
              <h2 className="text-24 font-medium">Про центр</h2>
              {aboutOpen ? (
                <div className="flex flex-col gap-[8px]">
                  <p className="text-16">
                    {tie(center.about.lead)}
                    {tie(center.about.rest)}
                  </p>
                  <button type="button" onClick={() => setAboutOpen(false)} className={textAction}>
                    Свернуть
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-[8px]">
                  <div>
                    <p className="h-[72px] overflow-hidden text-16 text-ellipsis">{tie(center.about.lead)}</p>
                    <p className="truncate text-16 whitespace-pre">{tie(center.about.rest)}</p>
                  </div>
                  <button type="button" onClick={() => setAboutOpen(true)} className={textAction}>
                    Читать
                  </button>
                </div>
              )}
            </div>

            {center.amenities.length ? (
              <div className="flex flex-col gap-[8px]">
                <div className="grid grid-cols-3 gap-x-6 gap-y-4 max-[1099px]:grid-cols-2">
                  {previewAmenities.map((item) => (
                    <div key={item.label} className="flex min-w-0 items-center gap-[6px]">
                      <AmenityIcon name={item.icon} />
                      <span className="text-16 font-medium">{tie(item.label)}</span>
                    </div>
                  ))}
                </div>
                {hasMoreAmenities ? (
                  <button type="button" onClick={() => setAmenitiesOpen(true)} className={textAction}>
                    Смотреть все
                  </button>
                ) : null}
              </div>
            ) : null}

            {center.schedule.length ? (
              <div className="flex flex-col gap-[10px]">
                <h3 className="text-[22px] leading-[28px] font-medium">Расписание дня</h3>
                <div className={`relative ${scheduleOpen ? "" : "h-[132px] overflow-hidden"}`}>
                  <div className="flex flex-col gap-[10px]">
                    <ul className="grid grid-cols-1 gap-x-[28px] gap-y-[8px] sm:grid-cols-2">
                      {center.schedule.map((item) => (
                        <li key={item.time} className="flex min-w-0 flex-col">
                          <p className="text-16 leading-[20px]">{tie(item.event)}</p>
                          <p className="text-13 leading-[16px] opacity-60 tabular-nums">{item.time}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {scheduleOpen ? null : (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40px] bg-[linear-gradient(to_bottom,rgba(253,253,253,0),#fdfdfd)]" />
                  )}
                </div>
                <button type="button" onClick={() => setScheduleOpen((open) => !open)} className={textAction}>
                  {scheduleOpen ? "Свернуть" : "Подробнее"}
                </button>
              </div>
            ) : null}
          </section>

          {center.staff ? (
            <section className="order-4 flex flex-col gap-[12px] border-b border-[rgba(0,0,0,0.04)] pb-[32px] min-[1100px]:order-none">
              <h2 className="text-24 font-medium">Персонал</h2>
              <StaffBlock staff={center.staff} open={staffOpen} onToggle={() => setStaffOpen((open) => !open)} />
            </section>
          ) : null}

          {center.features.length ? (
            <section className="order-5 flex flex-col gap-[10px] min-[1100px]:order-none">
              <h2 className="text-24 font-medium">Особенности</h2>
              <ul className="flex flex-wrap content-center gap-[8px]">
                {center.features.map((feature) => (
                  <li key={feature} className="rounded-[8px] bg-[#ebeff8] p-[10px] text-16">
                    {tie(feature)}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="order-2 flex w-full shrink-0 flex-col gap-[12px] self-start rounded-[19px] border border-[rgba(0,0,0,0.04)] bg-white p-[20px] text-18 min-[1100px]:sticky min-[1100px]:top-[24px] min-[1100px]:order-none min-[1100px]:w-auto min-[1100px]:whitespace-nowrap">
          {center.facts.map((fact) => (
            <p key={fact.label} className="flex flex-wrap items-center gap-x-[6px] gap-y-[2px]">
              <span className="font-medium">{fact.label}</span>
              <span className="flex items-center gap-[4px]">
                {tie(fact.value)}
                {fact.extra ? (
                  <button
                    type="button"
                    aria-expanded={openHint === fact.label}
                    onClick={() => setOpenHint((current) => (current === fact.label ? null : fact.label))}
                    className="font-medium whitespace-nowrap underline decoration-[rgba(39,41,45,0.45)] underline-offset-[3px]"
                  >
                    {fact.extra}
                  </button>
                ) : null}
              </span>
              {fact.extraHint && openHint === fact.label ? (
                <span className="block w-full max-w-[280px] text-16 leading-[22px] font-normal whitespace-normal">{fact.extraHint}</span>
              ) : null}
            </p>
          ))}
        </aside>
      </div>

      {galleryOpen ? <PhotoGallery photos={center.gallery.photos} onClose={() => setGalleryOpen(false)} /> : null}
      {amenitiesOpen ? <AmenitiesModal amenities={center.amenities} onClose={() => setAmenitiesOpen(false)} /> : null}
    </div>
  );
}

function GalleryCollage({ center, onOpen }: { center: CenterPageData; onOpen: () => void }) {
  const { gallery } = center;
  const more = (layout: "fill" | "frame") => (
    <>
      <CroppedPhoto photo={gallery.more} hover layout={layout} />
      {gallery.moreLabel ? (
        <>
          <div className="absolute inset-0 bg-[rgba(74,74,74,0.37)] transition-colors duration-200 group-hover:bg-[rgba(39,41,45,0.52)]" />
          <p className="absolute inset-0 flex items-center justify-center text-18 font-medium whitespace-nowrap text-white">
            {gallery.moreLabel}
          </p>
        </>
      ) : null}
    </>
  );
  return (
    <>
      <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-[22px] min-[1100px]:hidden">
        <div className="relative col-span-2 aspect-[16/10] overflow-hidden bg-[#ebebeb]">
          <CroppedPhoto photo={gallery.main} layout="fill" priority />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#ebebeb]">
          <CroppedPhoto photo={gallery.topMiddle} layout="fill" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#ebebeb]">
          <CroppedPhoto photo={gallery.topRight} layout="fill" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#ebebeb]">
          <CroppedPhoto photo={gallery.bottomMiddle} layout="fill" />
        </div>
        <button
          type="button"
          aria-label="Открыть все фотографии"
          onClick={onOpen}
          className="group relative aspect-[4/3] cursor-pointer overflow-hidden bg-[#cfcece] p-0"
        >
          {more("fill")}
        </button>
      </div>
      <div className="hidden h-[480px] grid-cols-[598fr_297fr_297fr] grid-rows-2 gap-1 overflow-hidden rounded-[22px] min-[1100px]:grid">
        <div className="relative row-span-2 overflow-hidden bg-[#ebebeb]">
          <CroppedPhoto photo={gallery.main} layout="frame" priority />
        </div>
        <div className="relative overflow-hidden bg-[#ebebeb]">
          <CroppedPhoto photo={gallery.topMiddle} layout="frame" />
        </div>
        <div className="relative overflow-hidden bg-[#ebebeb]">
          <CroppedPhoto photo={gallery.topRight} layout="frame" />
        </div>
        <div className="relative overflow-hidden bg-[#ebebeb]">
          <CroppedPhoto photo={gallery.bottomMiddle} layout="frame" />
        </div>
        <button
          type="button"
          aria-label="Открыть все фотографии"
          onClick={onOpen}
          className="group relative cursor-pointer overflow-hidden bg-[#cfcece] p-0"
        >
          {more("frame")}
        </button>
      </div>
    </>
  );
}

function mobilePhoto(src: string) {
  return src.replace(/\.(webp|jpe?g|png)$/i, "-m.webp");
}

function CroppedPhoto({
  photo,
  hover = false,
  layout,
  priority = false,
}: {
  photo: CenterPhoto;
  hover?: boolean;
  layout: "fill" | "frame";
  priority?: boolean;
}) {
  const motion = hover ? " transition-transform duration-300 group-hover:scale-[1.04]" : "";
  if (layout === "fill") {
    return (
      <img
        alt={photo.alt}
        src={asset(mobilePhoto(photo.src))}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute inset-0 size-full object-cover object-center${motion}`}
      />
    );
  }
  return (
    <div className={photo.frameClassName}>
      <picture>
        <source media="(min-width: 1100px)" srcSet={asset(photo.src)} />
        <img
          alt={photo.alt}
          src={asset(mobilePhoto(photo.src))}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className={`${photo.imageClassName ?? "absolute inset-0 size-full max-w-none object-cover"}${motion}`}
        />
      </picture>
    </div>
  );
}

function StaffBlock({
  staff,
  open,
  onToggle,
}: {
  staff: CenterPageData["staff"];
  open: boolean;
  onToggle: () => void;
}) {
  if (staff.kind === "counts") {
    return (
      <div className="flex flex-col gap-[12px]">
        <ul className="flex flex-col gap-[8px] text-16">
          {staff.counts.map((row) => (
            <li key={row.role} className="flex gap-[6px]">
              <span className="font-medium tabular-nums">{row.count}</span>
              <span>{tie(row.role)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const clips = staff.people.length > 3;

  return (
    <div className="flex flex-col gap-[12px]">
      <div className={`relative ${open || !clips ? "" : "h-[460px] overflow-hidden"}`}>
        <ul className="grid grid-cols-3 gap-x-[24px] gap-y-[24px] max-[1099px]:grid-cols-2 max-[1099px]:gap-x-[16px]">
          {staff.people.map((person) => (
            <li key={person.name} className="flex min-w-0 flex-col gap-[10px]">
              <div className="relative h-[180px] overflow-hidden rounded-[12px] bg-[#c4c4c4]">
                <picture>
                  <source media="(min-width: 1100px)" srcSet={asset(person.photo)} />
                  <img
                    alt=""
                    src={asset(mobilePhoto(person.photo))}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
                  />
                </picture>
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="text-16 leading-[24px] font-medium text-black">{person.name}</p>
                <p className="text-13 leading-[20px] text-[#27292d]">{tie(person.role)}</p>
              </div>
            </li>
          ))}
        </ul>
        {open || !clips ? null : (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[96px] bg-[linear-gradient(to_bottom,rgba(253,253,253,0)_0%,#fdfdfd_100%)]" />
        )}
      </div>
      {clips ? (
        <button type="button" onClick={onToggle} className={textAction}>
          {open ? "Свернуть" : "Смотреть"}
        </button>
      ) : null}
      <p className="text-16">{tie(staff.summary)}</p>
    </div>
  );
}

function AmenitiesModal({
  amenities,
  onClose,
}: {
  amenities: CenterPageData["amenities"];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(39,41,45,0.45)] max-md:top-[calc(env(safe-area-inset-top)*-1)] md:items-center md:p-[24px]">
      <button type="button" aria-label="Закрыть" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="center-amenities-title" className="mobile-sheet relative max-h-[calc(100dvh-12px)] w-full max-w-[720px] overflow-y-auto rounded-t-[21px] bg-white pb-[max(16px,env(safe-area-inset-bottom))] max-md:h-[calc(100dvh-12px)] md:rounded-[21px] md:pb-0">
        <div className="flex items-center justify-between px-[26px] pt-[20px] pb-[20px]">
          <h2 id="center-amenities-title" className="text-24 font-medium">
            Условия
          </h2>
          <CloseButton onClick={onClose} />
        </div>
        <ul className="grid grid-cols-3 gap-x-[24px] gap-y-[16px] px-[26px] pb-[28px] max-[1099px]:grid-cols-2 max-[639px]:grid-cols-1">
          {amenities.map((item) => (
            <li key={item.label} className="flex items-center gap-[6px]">
              <AmenityIcon name={item.icon} />
              <span className="text-16 font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PhotoGallery({ photos, onClose }: { photos: { src: string; alt: string }[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(39,41,45,0.45)] max-md:top-[calc(env(safe-area-inset-top)*-1)] md:items-center md:p-[24px]">
      <button type="button" aria-label="Закрыть" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="center-photos-title"
        className="mobile-sheet relative flex max-h-[calc(100dvh-12px)] w-full max-w-[1100px] flex-col overflow-hidden rounded-t-[21px] bg-white pb-[max(16px,env(safe-area-inset-bottom))] max-md:h-[calc(100dvh-12px)] md:max-h-[calc(100dvh-32px)] md:rounded-[21px] md:pb-0"
      >
        <div className="flex items-center justify-between px-[26px] pt-[20px] pb-[16px]">
          <h2 id="center-photos-title" className="text-24 font-medium">
            Фотографии
          </h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className="grid grid-cols-3 gap-[8px] overflow-y-auto px-[26px] pb-[26px] max-md:min-h-0 max-md:flex-1 max-[1099px]:grid-cols-2 max-[639px]:grid-cols-1 max-[639px]:px-4">
          {photos.map((photo) => (
            <picture key={photo.src}>
              <source media="(min-width: 1100px)" srcSet={asset(photo.src)} />
              <img
                alt={photo.alt}
                src={asset(mobilePhoto(photo.src))}
                loading="lazy"
                decoding="async"
                className="h-[220px] w-full rounded-[12px] object-cover"
              />
            </picture>
          ))}
        </div>
      </div>
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" aria-label="Закрыть" onClick={onClick} className="opacity-70">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M7 7L17 17M17 7L7 17" stroke="#27292D" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </button>
  );
}

