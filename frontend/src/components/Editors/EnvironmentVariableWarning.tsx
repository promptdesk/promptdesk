import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { modelStore } from '@/stores/ModelStore';
import Link from 'next/link';

export default function EnvironmentVariableWarning() {
  const { areVariablesSet, missingVariables } = modelStore();

  return (
    <>{areVariablesSet ? null :
    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-700" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm text-yellow-700 font-bold">Missing Environment Variables</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>To run this model, you must set the {missingVariables.join(", ")} environment variable(s) in the Settings tab.</p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <Link href="/variables"
                type="button"
                className="btn btn-sm btn-filled btn-neutral"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>}
    </>
  )
}