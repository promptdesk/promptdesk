import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function Home() {
  const { push, query } = useRouter();


  const newUrl = `/prompts`;
  push(newUrl);

  return (
    <>
    </>
  );
  
}
