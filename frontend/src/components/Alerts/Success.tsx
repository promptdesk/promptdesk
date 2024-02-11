import { CheckCircleIcon } from "@heroicons/react/20/solid";

export default function Warning({ display, text }: any) {
  return (
    <>
      {display === true && ( // Conditionally rendering based on the `display` prop
        <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-xl overflow-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{text}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
