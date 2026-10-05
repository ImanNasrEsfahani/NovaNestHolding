import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { StartupsFormDataType } from '@/types/global';
import CollapsibleHeader from '@/components/startups-form/CollapsibleHeader';

type Panel = {
  id: string;
  title: string;
  show: boolean;
  fields?: string[];
  content: React.ReactNode;
};

type Props = {
  panels: Panel[];
  openPanel: string | null;
  togglePanel: (id: string) => void;
  errors: FieldErrors<StartupsFormDataType>;
};

export default function PanelsRenderer({ panels, openPanel, togglePanel, errors }: Props) {
  return (
    <div className="space-y-4">
      {panels.filter((p) => p.show).map((p) => {
        const hasError = p.fields?.some((field) => !!errors[field as keyof StartupsFormDataType]);
        console.log(`panel=${p.id} hasError=${hasError}`);
        console.log(`openPanel=${openPanel}`);

        return (
          <div key={p.id} className={`bg-darkGold rounded-xl overflow-hidden shadow-sm ${hasError ? 'ring-1 ring-red-500' : ''}`}>
            <CollapsibleHeader
              title={p.title}
              isOpen={openPanel === p.id}
              onToggle={() => togglePanel(p.id)}
              hasError={hasError}
            />
            <div
              aria-hidden={openPanel !== p.id}
              className={`transition-all duration-300 ${openPanel === p.id ? 'opacity-100' : 'opacity-0 max-h-0 pointer-events-none'}`}
            >
              {p.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}