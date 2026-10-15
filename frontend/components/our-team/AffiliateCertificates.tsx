'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react';
import type { AffiliateCertificate } from './AffiliateTypes';
import { safeCertificate } from './AffiliateTypes';

type Props = {
  certificates: AffiliateCertificate[];
  title: string;
  emptyLabel: string;
  viewLabel: string;
};

type AvailableCertificate = AffiliateCertificate & { file: string };

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

export default function AffiliateCertificates({ certificates, title, emptyLabel, viewLabel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null);
  const [selected, setSelected] = useState<AvailableCertificate | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);

  // Restrict all files (including thumbnails) to the site's existing safe public paths.
  const available = certificates.flatMap((certificate) => {
    const file = safeCertificate(certificate?.file);
    if (!certificate?.title || !file) return [];
    const thumbnail = certificate.thumbnail ? safeCertificate(certificate.thumbnail) : null;
    return [{ ...certificate, file, thumbnail: thumbnail || undefined }];
  });

  const openPreview = (certificate: AvailableCertificate) => {
    setZoom(MIN_ZOOM);
    setSelected(certificate);
    // Native dialog provides keyboard Escape, focus trapping and return-focus behavior.
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };

  const closePreview = () => dialogRef.current?.close();
  const isPdf = (file: string) => file.toLowerCase().endsWith('.pdf');

  const changeZoom = (next: number) => {
    const value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    setZoom(value);
    if (value === MIN_ZOOM && scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
      scrollRef.current.scrollTop = 0;
    }
  };

  // Drag-to-pan is enabled for mouse input only. Touch users retain native scrolling.
  const onPanStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom <= MIN_ZOOM || event.pointerType !== 'mouse' || event.button !== 0) return;
    const container = event.currentTarget;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: container.scrollLeft,
      top: container.scrollTop
    };
    container.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const onPanMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const container = event.currentTarget;
    container.scrollLeft = drag.left - (event.clientX - drag.x);
    container.scrollTop = drag.top - (event.clientY - drag.y);
  };

  const onPanEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.id !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="w-full border-t border-[#E9DED1] pt-5" aria-labelledby="affiliate-certificates">
      <h2 id="affiliate-certificates" className="mb-3 text-sm font-semibold uppercase text-gray-600">
        {title}
      </h2>

      {available.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {available.map((certificate, index) => (
            <button
              type="button"
              key={`${certificate.file}-${index}`}
              onClick={() => openPreview(certificate)}
              aria-label={`${viewLabel}: ${certificate.title}`}
              aria-haspopup="dialog"
              className="group min-w-0 overflow-hidden rounded-xl border border-[#E9DED1] bg-[#FAF8F5] text-left shadow-sm transition hover:border-primary hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-white">
                {certificate.thumbnail || !isPdf(certificate.file) ? (
                  <Image
                    src={certificate.thumbnail || certificate.file}
                    alt={certificate.title}
                    fill
                    unoptimized
                    loading="lazy"
                    sizes="(max-width: 1024px) 45vw, 180px"
                    className="object-contain p-2 transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span aria-hidden="true" className="rounded-lg border border-primary/20 bg-[#F8F5F0] px-4 py-3 text-2xl font-bold text-primary">PDF</span>
                )}
              </span>
              <span className="block p-2.5">
                <span className="block break-words text-xs font-semibold text-gray-800">{certificate.title}</span>
                {certificate.issuer && <span className="mt-1 block text-xs text-gray-600">{certificate.issuer}</span>}
                {certificate.issuedAt && <span className="mt-1 block text-xs text-gray-500">{certificate.issuedAt}</span>}
                <span className="mt-2 block text-xs font-semibold text-primary group-hover:underline">{viewLabel} ↗</span>
              </span>
            </button>
          ))}
        </div>
      ) : <p className="text-sm text-gray-500">{emptyLabel}</p>}

      <dialog
        ref={dialogRef}
        onClose={() => { setSelected(null); setZoom(MIN_ZOOM); dragRef.current = null; }}
        onClick={(event: ReactMouseEvent<HTMLDialogElement>) => { if (event.target === event.currentTarget) closePreview(); }}
        aria-label={selected ? `${title}: ${selected.title}` : title}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-[#111827] p-0 text-white backdrop:bg-black/90"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/20 bg-[#111827] px-3 py-2 sm:px-6 sm:py-3">
            <h3 className="min-w-0 flex-1 truncate text-sm font-semibold sm:text-lg" title={selected?.title}>
              {selected?.title || title}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2" role="group" aria-label="Certificate image zoom">
              {selected && !isPdf(selected.file) && (
                <>
                  <button type="button" onClick={() => changeZoom(zoom - ZOOM_STEP)} disabled={zoom <= MIN_ZOOM}
                    aria-label="Zoom out" title="Zoom out"
                    className="rounded-lg border border-white/30 px-2.5 py-1.5 text-lg font-bold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">−</button>
                  <button type="button" onClick={() => changeZoom(MIN_ZOOM)} title="Reset zoom to 100%"
                    aria-label="Reset zoom to 100%"
                    className="min-w-14 rounded-lg border border-white/30 px-2 py-2 text-xs font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                    {Math.round(zoom * 100)}%
                  </button>
                  <button type="button" onClick={() => changeZoom(zoom + ZOOM_STEP)} disabled={zoom >= MAX_ZOOM}
                    aria-label="Zoom in" title="Zoom in"
                    className="rounded-lg border border-white/30 px-2.5 py-1.5 text-lg font-bold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">+</button>
                </>
              )}
              <button type="button" autoFocus onClick={closePreview} aria-label="Close certificate preview"
                className="rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:text-sm">
                Close <span aria-hidden="true">✕</span>
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            tabIndex={0}
            role="region"
            aria-label="Certificate preview. Use the zoom controls to enlarge and scroll to pan."
            onPointerDown={onPanStart}
            onPointerMove={onPanMove}
            onPointerUp={onPanEnd}
            onPointerCancel={onPanEnd}
            className="relative min-h-0 flex-1 overflow-auto overscroll-contain bg-[#111827]"
            style={{ cursor: zoom > MIN_ZOOM ? 'grab' : 'auto' }}
          >
            {selected && (isPdf(selected.file) ? (
              <iframe src={selected.file} title={selected.title} className="h-full w-full border-0 bg-white" />
            ) : (
              <div className="relative" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%`, minWidth: '100%', minHeight: '100%' }}>
                <Image
                  src={selected.file}
                  alt={selected.title}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-contain p-2 sm:p-5"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </section>
  );
}
