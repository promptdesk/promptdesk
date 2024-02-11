export default function Notification() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6"
      style={{ zIndex: 50 }}
    >
      <div className="pointer-events-auto ml-auto max-w-xl rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10">
        <p className="text-sm leading-6 text-gray-900">Sample Notification</p>
        <div className="mt-4 flex items-center gap-x-5">
          <button
            type="button"
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
