import React from "react";
import DropDown from "@/components/Form/DropDown";
import PlaygroundButton from "@/components/Form/PlaygroundButton";

const SampleRowHeader: React.FC<any> = ({
  localStatus,
  handleStatusChange,
  handleRegenerateClicked,
  handleDeleteClicked,
  setView,
  view,
  isRegenerating,
}) => {
  return (
    <div className="flex justify-between bg-gray-50 p-3 rounded-t-xl border-b border-gray-200">
      <div className="flex">
        <DropDown
          options={[
            { value: "new", name: "New" },
            { value: "in_review", name: "In Review" },
            { value: "approved", name: "Approved" },
            { value: "rejected", name: "Rejected" },
          ]}
          selected={localStatus}
          onChange={handleStatusChange}
        />
        &nbsp;&nbsp;
        <PlaygroundButton
          onClick={handleRegenerateClicked as any}
          text={isRegenerating ? "Processing..." : "Regenerate"}
          color="primary"
        />
        <button onClick={handleDeleteClicked} className="btn btn-sm btn-neutral normal-case bg-red-100 text-red-600 hover:bg-red-200">
          <span className="font-semibold">
            Delete
          </span>
        </button>
      </div>
      <div>
        <span className="isolate inline-flex rounded-md shadow-sm">
          <button
            onClick={() => {
              setView("prompt");
            }}
            type="button"
            className={`${view === "prompt" ? "text-gray-400 bg-gray-100" : "text-gray-900 bg-white"} relative inline-flex items-center rounded-l-md  px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10`}
          >
            Prompt
          </button>
          <button
            onClick={() => {
              setView("ground_truth");
            }}
            type="button"
            className={`
            ${view === "ground_truth" ? "text-gray-400 bg-gray-100" : "text-gray-900 bg-white"} relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10`}
          >
            Generated
          </button>
        </span>
      </div>
    </div>
  );
};

export default SampleRowHeader;
