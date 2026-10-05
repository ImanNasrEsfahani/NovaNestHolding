'use client';

import React, { useEffect, useState } from 'react';
// import { useSubmit } from 'stores/submitStore';

interface Props {
  lang: string;
  roles: string[];
  defaultRole: string;
  // onRoleSelect: (role: string) => void;
}

export default function TeamRolesContainerClient({
  roles,
  defaultRole
  // onRoleSelect,
}: Props) {
  // const {selectedRole, updateRole} = useSubmit();

  const [selectedRole, setSelectedRole] = useState("")

  useEffect(() => {
    setSelectedRole(defaultRole);
  }, [defaultRole]);

  function handleRoleClick(role: string) {
    // onRoleSelect(role);
    setSelectedRole(role);
  }
  return (
    <div className="flex flex-wrap justify-center gap-1 pb-5 pt-10 font-barlow  md:gap-7">
      {roles.map((role, index) => (
        <button
          onClick={() => handleRoleClick(role)}
          key={index}
          className={`btn btn-outline rounded-lg border-[#222] capitalize md:w-[100px] ${selectedRole === role ? 'bg-[#222] text-white' : 'text-[#222]'}`}>
          {role}
        </button>
      ))}
    </div>
  );
}
