'use client';
import { useState } from "react";

interface AccordionItem {
  header: string;
  content: string[];
}

interface Props {
  data: AccordionItem[];
}

export default function Accordions({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  return (
    <div className="w-full">
      {data.map((item, idx) => (
        <div key={idx} className="mb-4 border rounded-lg overflow-hidden">
          <button
            className="w-full text-left px-4 py-4 bg-gray-200 font-semibold text-base focus:outline-none flex justify-between items-center"
            onClick={() => {
              if (openIndex === idx) return;
              setOpenIndex(idx);
            }}
          >
            {item.header}
            <span className="ml-2">{openIndex === idx ? "−" : "+"}</span>
          </button>
          {openIndex === idx && (
            <ul className="px-6 py-4 space-y-2 text-gray-800 text-base leading-relaxed">
              {item.content.map((c, i) => (
                <li key={i} className="list-disc text-left ml-4">{c}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
