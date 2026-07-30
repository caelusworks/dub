"use client";

import useProgramEnrollment from "@/lib/swr/use-program-enrollment";
import { ProgramHelpLinks } from "@/ui/partners/program-help-links";
import { memo } from "react";

export const ProgramHelpSupport = memo(() => {
  const { programEnrollment } = useProgramEnrollment();

  if (!programEnrollment?.program) return null;

  const { program } = programEnrollment;

  if (!program.supportEmail && !program.helpUrl && !program.termsUrl)
    return null;

  return (
    <div className="grid gap-2 border-t border-border-default p-3">
      <div className="px-2 text-sm font-semibold text-content-default">
        {program.name.length <= 12 ? `${program.name} ` : ""}
        Program Support
      </div>
      <ProgramHelpLinks />
    </div>
  );
});
