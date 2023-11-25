import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

export default function Warning({ display, text }:any) {
  return (
    <>
      {display === true && // Conditionally rendering based on the `display` prop
        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-xl overflow-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {text}
              </p>
            </div>
          </div>
        </div>
      }
    </>
  )
}