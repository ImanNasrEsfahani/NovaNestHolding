'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { createScopedSubmitStore, SubmitStoreContext } from './dataStore';
import { createScopedFileStore, FileStoreContext } from './fileStore';

/** Fresh state for each route, including CVs and legacy submit flags.
 * Form sections on the same page still share the same scoped instance.
 * State is not stored in a module singleton across server requests.
 */
function RouteFormState({ children }: { children: ReactNode }) {
  const [submit] = useState(createScopedSubmitStore);
  const [files] = useState(createScopedFileStore);
  return (
    <SubmitStoreContext.Provider value={submit}>
      <FileStoreContext.Provider value={files}>{children}</FileStoreContext.Provider>
    </SubmitStoreContext.Provider>
  );
}

export default function FormStateScope({ children }: { children: ReactNode }) {
  const path = usePathname() ?? '/';
  return <RouteFormState key={path}>{children}</RouteFormState>;
}
