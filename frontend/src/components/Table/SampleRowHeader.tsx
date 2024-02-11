import React from "react";
import DropDown from "@/components/Form/DropDown";
import PlaygroundButton from "@/components/Form/PlaygroundButton";

const SampleRowHeader: React.FC<any> = ({
  localStatus,
  handleStatusChange,
  handleRegenerateClicked,
  handleDeleteClicked,
  setView,
  isRegenerating,
}) => {
  return (
    <div className="flex justify-between bg-gray-200 p-2">
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
        <PlaygroundButton
          onClick={handleDeleteClicked as any}
          text={"Delete"}
          color="primary"
        />
      </div>
      <div>
        <span className="isolate inline-flex rounded-md shadow-sm">
          <button
            onClick={() => {
              setView("prompt");
            }}
            type="button"
            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            Prompt
          </button>
          <button
            onClick={() => {
              setView("ground_truth");
            }}
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            Generated
          </button>
        </span>
      </div>
    </div>
  );
};

export default SampleRowHeader;
