import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import { modelStore } from "@/stores/ModelStore";

export default function ModelsHomeRedirect() {
  const { push, query } = useRouter();

  var { models } = modelStore();

  useEffect(() => {
    //get first model
    let model = models[0];
    const newUrl = `/models/${model.id}`;
    push(newUrl);
  }, [])

  return (
    <>
    </>
  );
  
}
