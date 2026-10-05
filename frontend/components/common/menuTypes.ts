export type MenuEntry = {
  label: string;
  href: string;
  type?: 'dropdown' | 'link';
  submenuItems?: MenuEntry[];
};