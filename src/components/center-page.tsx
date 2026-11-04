"use client";

import { useEffect, useState } from "react";
import { AmenityIcon } from "@/components/amenity-icons";
import { CallRequestButton } from "@/components/call-request-modal";
import type { CenterPageData, CenterPhoto } from "@/content/centers/types";
import { tie } from "@/lib/tie";

const textAction =
  "w-fit cursor-pointer text-16 font-medium opacity-80 transition-opacity duration-150 hover:opacity-100";

const previewAmenityCount = 6;

export function CenterPage({ center }: { center: CenterPageData }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const previewAmenities = center.amenities.slice(0, previewAmenityCount);
  const amenityRows = chunk(previewAmenities, 3);
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
    <div className="mx-auto mt-[58px] w-[1200px] pb-[160px]">
      <GalleryCollage center={center} onOpen={() => setGalleryOpen(true)} />

      <div className="mt-[32px] flex items-start justify-between">
        <div className="flex w-[612px] flex-col gap-[30px]">
          <header className="flex flex-col gap-[16px] border-b border-[rgba(0,0,0,0.04)] pb-[32px]">
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

          <section className="flex flex-col gap-[24px] border-b border-[rgba(0,0,0,0.04)] pb-[32px]">
            <div className="flex flex-col gap-[10px]">
              <h2 className="text-24 font-medium">Про центр</h2>
              {aboutOpen ? (
                <div className="text-16">
                  {tie(center.about.lead)}
                  {tie(center.about.rest)}{" "}
                  <button type="button" onClick={() => setAboutOpen(false)} className={`${textAction} inline px-[2px]`}>
                    Свернуть
                  </button>
                </div>
              ) : (
                <div>
                  <p className="h-[72px] overflow-hidden text-16 text-ellipsis">{tie(center.about.lead)}</p>
                  <div className="flex items-center gap-[2px]">
                    <p className="min-w-0 flex-1 truncate text-16 whitespace-pre">{tie(center.about.rest)}</p>
                    <button type="button" onClick={() => setAboutOpen(true)} className={`${textAction} px-[2px]`}>
                      Читать
                    </button>
                  </div>
                </div>
              )}
            </div>

            {center.amenities.length ? (
              <div className="flex flex-col gap-[18px]">
                <div className="flex flex-col gap-[16px]">
                  {amenityRows.map((row) => (
                    <div key={row[0].label} className="flex items-center gap-[24px]">
                      {row.map((item, index) => (
                        <div key={item.label} className={`flex items-center gap-[6px] ${index < 2 ? "w-[180px]" : ""}`}>
                          <AmenityIcon name={item.icon} />
                          <span className="text-16 font-medium whitespace-nowrap">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {hasMoreAmenities ? (
                  <button type="button" onClick={() => setAmenitiesOpen(true)} className={`${textAction} self-end px-[2px]`}>
                    Смотреть все
                  </button>
                ) : null}
              </div>
            ) : null}

            {center.schedule.length ? (
              <div className="flex flex-col gap-[8px]">
                <div className={`relative ${scheduleOpen ? "" : "h-[152px] overflow-hidden"}`}>
                  <div className="flex flex-col gap-[10px]">
                    <h3 className="text-18 font-medium">Расписание дня</h3>
                    <ul className="grid grid-cols-2 gap-x-[28px] gap-y-[8px]">
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
                <button type="button" onClick={() => setScheduleOpen((open) => !open)} className={`${textAction} self-end px-[2px]`}>
                  {scheduleOpen ? "Свернуть" : "Подробнее"}
                </button>
              </div>
            ) : null}
          </section>

          {center.staff ? (
            <section className="flex flex-col gap-[12px] border-b border-[rgba(0,0,0,0.04)] pb-[32px]">
              <h2 className="text-24 font-medium">Персонал</h2>
              <StaffBlock staff={center.staff} open={staffOpen} onToggle={() => setStaffOpen((open) => !open)} />
            </section>
          ) : null}

          {center.features.length ? (
            <section className="flex flex-col gap-[10px]">
              <h2 className="text-24 font-medium">Особенности</h2>
              <ul className="flex flex-wrap content-center gap-[8px]">
                {center.features.map((feature) => (
                  <li key={feature} className="rounded-[8px] bg-[#ebeff8] p-[10px] text-16">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="sticky top-[24px] flex shrink-0 flex-col gap-[12px] self-start rounded-[19px] border border-[rgba(0,0,0,0.04)] bg-white p-[20px] text-18 whitespace-nowrap">
          {center.facts.map((fact) => (
            <p key={fact.label} className="flex items-center gap-[6px]">
              <span className="font-medium">{fact.label}</span>
              <span className="flex items-center gap-[4px]">
                {tie(fact.value)}
                {fact.extra ? (
                  <span className="group/extra relative">
                    <button type="button" className="font-medium opacity-70 outline-none hover:opacity-100">
                      {fact.extra}
                    </button>
                    {fact.extraHint ? (
                      <span className="absolute top-full right-0 z-20 hidden pt-[4px] group-hover/extra:block group-focus-within/extra:block">
                        <span
                          role="tooltip"
                          className="block rounded-[10px] bg-white px-[12px] py-[8px] text-16 font-normal text-[#27292d] shadow-[0_8px_24px_rgba(36,74,127,0.12)]"
                        >
                          {fact.extraHint}
                        </span>
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </span>
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
  return (
    <div className="relative h-[480px] overflow-hidden rounded-[22px] bg-white">
      <div className="absolute top-0 left-0 h-[480px] w-[598px] overflow-hidden">
        <CroppedPhoto photo={gallery.main} />
      </div>
      <div className="absolute top-0 right-[301px] h-[238px] w-[297px] overflow-hidden bg-[#ebebeb]">
        <CroppedPhoto photo={gallery.topMiddle} />
      </div>
      <div className="absolute top-0 right-0 h-[238px] w-[297px] overflow-hidden bg-[#ebebeb]">
        <CroppedPhoto photo={gallery.topRight} />
      </div>
      <div className="absolute right-[301px] bottom-0 h-[238px] w-[297px] overflow-hidden bg-[#ebebeb]">
        <CroppedPhoto photo={gallery.bottomMiddle} />
      </div>
      <button
        type="button"
        aria-label="Открыть все фотографии"
        onClick={onOpen}
        className="group absolute right-0 bottom-0 h-[238px] w-[297px] cursor-pointer overflow-hidden bg-[#cfcece] p-0"
      >
        <CroppedPhoto photo={gallery.more} hover />
        {gallery.moreLabel ? (
          <>
            <div className="absolute inset-0 bg-[rgba(74,74,74,0.37)] transition-colors duration-200 group-hover:bg-[rgba(39,41,45,0.52)]" />
            <p className="absolute inset-0 flex items-center justify-center text-18 font-medium whitespace-nowrap text-white">
              {gallery.moreLabel}
            </p>
          </>
        ) : null}
      </button>
    </div>
  );
}

function CroppedPhoto({ photo, hover = false }: { photo: CenterPhoto; hover?: boolean }) {
  return (
    <div className={photo.frameClassName}>
      <img
        alt={photo.alt}
        src={photo.src}
        className={`${photo.imageClassName ?? "absolute inset-0 size-full max-w-none object-cover"}${hover ? " transition-transform duration-300 group-hover:scale-[1.04]" : ""}`}
      />
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

  return (
    <div className="flex flex-col gap-[12px]">
      <div className={`relative ${open ? "" : "h-[460px] overflow-hidden"}`}>
        <ul className="grid grid-cols-3 gap-x-[24px] gap-y-[24px]">
          {staff.people.map((person) => (
            <li key={person.name} className="flex min-w-0 flex-col gap-[10px]">
              <div className="relative h-[180px] overflow-hidden rounded-[12px] bg-[#c4c4c4]">
                <img
                  alt=""
                  src={person.photo}
                  className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="text-16 leading-[24px] font-medium text-black">{person.name}</p>
                <p className="text-13 leading-[20px] text-[#27292d]">{tie(person.role)}</p>
              </div>
            </li>
          ))}
        </ul>
        {open ? null : (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[96px] bg-[linear-gradient(to_bottom,rgba(253,253,253,0)_0%,#fdfdfd_100%)]" />
        )}
      </div>
      <button type="button" onClick={onToggle} className={textAction}>
        {open ? "Свернуть" : "Смотреть"}
      </button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(39,41,45,0.45)] p-[24px]">
      <button type="button" aria-label="Закрыть" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="center-amenities-title" className="relative w-[720px] rounded-[21px] bg-white">
        <div className="flex items-center justify-between px-[26px] pt-[20px] pb-[20px]">
          <h2 id="center-amenities-title" className="text-24 font-medium">
            Условия
          </h2>
          <CloseButton onClick={onClose} />
        </div>
        <ul className="grid grid-cols-3 gap-x-[24px] gap-y-[16px] px-[26px] pb-[28px]">
          {amenities.map((item) => (
            <li key={item.label} className="flex items-center gap-[6px]">
              <AmenityIcon name={item.icon} />
              <span className="text-16 font-medium whitespace-nowrap">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PhotoGallery({ photos, onClose }: { photos: { src: string; alt: string }[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(39,41,45,0.45)] p-[24px]">
      <button type="button" aria-label="Закрыть" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="center-photos-title"
        className="relative flex max-h-[calc(100vh-48px)] w-[1100px] flex-col overflow-hidden rounded-[21px] bg-white"
      >
        <div className="flex items-center justify-between px-[26px] pt-[20px] pb-[16px]">
          <h2 id="center-photos-title" className="text-24 font-medium">
            Фотографии
          </h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className="grid grid-cols-3 gap-[8px] overflow-y-auto px-[26px] pb-[26px]">
          {photos.map((photo) => (
            <img
              key={photo.src}
              alt={photo.alt}
              src={photo.src}
              loading="lazy"
              decoding="async"
              className="h-[220px] w-full rounded-[12px] object-cover"
            />
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

function chunk<T>(items: T[], size: number) {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) rows.push(items.slice(index, index + size));
  return rows;
}
