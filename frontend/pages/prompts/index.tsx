import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function WorkspaceHomeRedirector() {
  const { push } = useRouter();

  useEffect(() => {
    push(`/prompts/all`);
  }, [push]);

  return null;
}
