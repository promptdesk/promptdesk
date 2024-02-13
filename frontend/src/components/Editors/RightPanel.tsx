import React from "react";
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import DropDown from "@/components/Form/DropDown";
import SliderComponent from "@/components/Form/SliderComponent";
import InputField from "../Form/InputField";

interface RightPanelProps {
  toggle_modal: () => void;
  modelListSelector: any[];
  selectedModel: string;
  setModelById: (id: string) => void;
  modelObject: any;
  promptObject: any;
  updateLocalPromptValues: (key: string, value: any) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  toggle_modal,
  modelListSelector,
  selectedModel,
  setModelById,
  modelObject,
  promptObject,
  updateLocalPromptValues,
}) => {
  return (
    <div className="pg-right">
      <div className="pg-right-panel-mask" />
      <div className="pg-right-content">
        <div className="parameter-panel">
          <div>
            <InputField
              label={"Prompt Name"}
              value={promptObject.name}
              disabled={true}
            />
            <br />
            <DropDown
              label={"Model"}
              options={modelListSelector}
              selected={selectedModel}
              onChange={(id: any) => {
                setModelById(id);
              }}
            />
            <br />
            {modelObject.model_parameters &&
              Object.keys(modelObject.model_parameters).map((key, index) =>
                modelObject.model_parameters[key]["type"] === "slider" ? (
                  <SliderComponent
                    key={index}
                    sliderInfo={modelObject.model_parameters[key]}
                    value={
                      promptObject.model_parameters &&
                      promptObject.model_parameters[key] !== undefined
                        ? promptObject.model_parameters[key]
                        : modelObject.model_parameters[key]
                          ? modelObject.model_parameters[key]["default"]
                          : undefined
                    }
                    onChange={(value: any): void => {
                      updateLocalPromptValues("model_parameters." + key, value);
                    }}
                  />
                ) : null,
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
