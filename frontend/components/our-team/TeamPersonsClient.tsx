import TeamRolesContainerClient from './TeamRolesContainerClient';

export default async function TeamRolesContainer({
  lang,
  defaultRole,
  roles,
  // onRoleSelect
}: {
  lang: string;
  persons: string[];
  defaultRole: string;
  roles: string[];
  // onRoleSelect: (role: string) => void;
}) {

  return (
    <TeamRolesContainerClient 
      lang={lang}
      roles={roles}
      defaultRole={defaultRole}
      // onRoleSelect={onRoleSelect}
    />
  );
}