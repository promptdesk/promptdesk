import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { modelStore } from "@/stores/ModelStore";
import Link from "next/link";

export default function EnvironmentVariableWarning() {
  const { areVariablesSet, missingVariables, modelObject } = modelStore();

  if (areVariablesSet) return null;

  return (
    <div className="rounded-md bg-yellow-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-700"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-yellow-700">
            Model <strong>{modelObject?.name}</strong> requires
            environment variables{" "}
            <strong>{missingVariables.join(", ")}</strong> to be set.
          </p>
          <p className="mt-3 text-sm md:ml-6 md:mt-0">
            <Link
              href="/settings"
              className="whitespace-nowrap font-medium text-yellow-700 hover:text-yellow-600"
            >
              Set Variables
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}