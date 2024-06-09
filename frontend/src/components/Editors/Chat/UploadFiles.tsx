import React, { useEffect, useState } from "react";
import {
  deleteFileAtIndex,
  updateFileAtIndex,
  createFileAtIndex,
} from "@/services/PromptEditor";
import InputField from "@/components/Form/InputField";
import { modelStore } from "@/stores/ModelStore";
import { promptStore, processVariables } from "@/stores/prompts";
import Delete from "@/components/Icons/Delete";

//updateFileAtIndex //messageIndex: number, fileIndex:number, name: string, url: string

const UploadFiles = ({ index }: { index: number }) => {
  const { modelObject } = modelStore();
  const { promptObject } = promptStore();
  const [files, setFiles] = useState([] as any[]);

  useEffect(() => {
    if (promptObject.prompt_data.messages[index].files) {
      setFiles(promptObject.prompt_data.messages[index].files);
    }
  }, [promptObject]);

  const handleMessageChange = () => {
    const context = promptObject?.prompt_data.context || "";
    const messages = JSON.stringify(promptObject?.prompt_data.messages || []);
    processVariables(`${context} ${messages}`);
  };

  const [multiModal, setMultiModal] = useState(
    (modelObject["model_parameters"]["multimodal"] &&
      modelObject["model_parameters"]["multimodal"][0]) ||
      false,
  );

  return (
    multiModal && (
      <div>
        <div>
          {files.map((file, i) => (
            <div className="flex items-center">
              <div className="grow">
                <InputField
                  key={i}
                  placeholder={multiModal.instructions}
                  value={file[multiModal.name]}
                  onInputChange={(e) => {
                    updateFileAtIndex(index, 0, multiModal.name, e);
                    handleMessageChange();
                  }}
                />
              </div>{" "}
              <div className="p-2 cursor-pointer"
                onClick={() => {
                  deleteFileAtIndex(index, i);
                  setFiles(files.filter((f, index) => index !== i));
                  handleMessageChange();
                }}
              >
                <Delete />
              </div>
            </div>
          ))}
        </div>
        {files.length === 0 && <div className="text-right">
          <p
            className="text-xs cursor-pointer"
            onClick={() => {
              let obj: { [key: string]: any } = {};
              obj[multiModal["name"]] = "";
              setFiles([...files, obj]);
              createFileAtIndex(index, 0, obj);
            }}
          >
            + Upload
          </p>
        </div>}
      </div>
    )
  );
};

export default UploadFiles;
