'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import type { AffiliateCertificate } from './AffiliateTypes';
import { safeCertificate } from './AffiliateTypes';

type Props = {
  certificates: AffiliateCertificate[];
  title: string;
  emptyLabel: string;
  viewLabel: string;
};

type AvailableCertificate = AffiliateCertificate & { file: string };

export default function AffiliateCertificates({ certificates, title, emptyLabel, viewLabel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<AvailableCertificate | null>(null);
  // Only same-site, public certificate paths from the existing JSON schema are allowed.
  const available = certificates.flatMap((certificate) => {
    const file = safeCertificate(certificate?.file);
    return certificate?.title && file ? [{ ...certificate, file }] : [];
  });

  const openPreview = (certificate: AvailableCertificate) => {
    setSelected(certificate);
    // showModal gives the full-screen viewer native Escape and focus management.
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };

  const closePreview = () => dialogRef.current?.close();
  const isPdf = (file: string) => file.toLowerCase().endsWith('.pdf');

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
                {isPdf(certificate.file) ? (
                  <span aria-hidden="true" className="rounded-lg border border-primary/20 bg-[#F8F5F0] px-4 py-3 text-2xl font-bold text-primary">
                    PDF
                  </span>
                ) : (
                  <Image
                    src={certificate.file}
                    alt={certificate.title}
                    fill
                    sizes="(max-width: 1024px) 45vw, 180px"
                    className="object-contain p-2 transition-transform duration-200 group-hover:scale-[1.03]"
                  />
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

      {/* Native modal: full viewport, keyboard Escape, and a visible close button. */}
      <dialog
        ref={dialogRef}
        onClose={() => setSelected(null)}
        onClick={(event) => { if (event.target === event.currentTarget) closePreview(); }}
        aria-label={selected ? `${title}: ${selected.title}` : title}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-[#111827] p-0 text-white backdrop:bg-black/90"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/20 bg-[#111827] px-4 py-3 sm:px-6">
            <h3 className="min-w-0 truncate text-base font-semibold sm:text-lg" title={selected?.title}>
              {selected?.title || title}
            </h3>
            <button
              type="button"
              autoFocus
              onClick={closePreview}
              className="shrink-0 rounded-lg border border-white/30 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Close certificate preview"
            >
              Close <span aria-hidden="true">✕</span>
            </button>
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {selected && (isPdf(selected.file) ? (
              <iframe src={selected.file} title={selected.title} className="h-full w-full border-0 bg-white" />
            ) : (
              <Image
                src={selected.file}
                alt={selected.title}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain p-2 sm:p-5"
              />
            ))}
          </div>
        </div>
      </dialog>
    </section>
  );
}
