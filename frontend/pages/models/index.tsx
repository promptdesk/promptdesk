import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { modelStore } from "@/stores/ModelStore";

export default function ModelsHomeRedirect() {
  const { push } = useRouter();
  const { models } = modelStore();

  useEffect(() => {
    if(models.length > 0) {
      const model = models[0];
      const newUrl = `/models/${model.id}`;
      push(newUrl);
    }
  }, [models, push]);

  return null;
}