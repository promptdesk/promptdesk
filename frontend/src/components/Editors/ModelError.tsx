import { XCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function ModelError({
  errorMessage,
  logId,
}: {
  errorMessage: string | undefined;
  logId?: string | undefined;
}) {
  return (
    <>
      {!errorMessage ? null : (
        <div className="rounded-md bg-red-50 p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-red-700">{errorMessage}</p>
              {logId === undefined ? null : (
                <p className="mt-3 text-sm md:ml-6 md:mt-0">
                  <Link
                    href="/logs/[id]"
                    as={`/logs/${logId}`}
                    className="whitespace-nowrap font-medium text-red-700 hover:text-red-600"
                  >
                    Logs
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
