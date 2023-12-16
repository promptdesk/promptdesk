import React, { useEffect } from "react";
import { useRouter } from 'next/router';

export default function WorkspaceHomeRedirector() {
  const { push, query } = useRouter();

  push(`/prompts/all`);

  return (
    <>
    </>
  );
  
}