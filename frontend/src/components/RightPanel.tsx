import React from 'react';
import PlaygroundButton from "@/components/Form/PlaygroundButton";
import DropDown from "@/components/Form/DropDown";
import SliderComponent from "@/components/Form/SliderComponent";

interface RightPanelProps {
  toggle_modal: () => void;
  modelListSelector: any[];
  selectedModeId: string;
  setModelById: (id: string) => void;
  modelObject: any;
  promptObject: any;
  setPromptInformation: (key: string, value: any) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  toggle_modal,
  modelListSelector,
  selectedModeId,
  setModelById,
  modelObject,
  promptObject,
  setPromptInformation,
}) => {
  return (
    <div className="pg-right">
      <div className="pg-right-panel-mask" />
      <div className="pg-right-content">
        <button className="pg-right-panel-mobile-close">×</button>
        <div className="parameter-panel">
          <div>
            <PlaygroundButton
              text="Save"
              onClick={toggle_modal}
            />
            <DropDown
              label={"Model"}
              options={modelListSelector}
              selected={selectedModeId}
              onChange={(id: any) => {
                setModelById(id);
                ////console.log("MODEL USED", id)
              }}
            />
            <br />
            {modelObject.model_parameters &&
              Object.keys(modelObject.model_parameters).map(
                (key, index) =>
                  modelObject.model_parameters[key]["type"] === "slider" ? (
                    <SliderComponent
                      key={index}
                      sliderInfo={modelObject.model_parameters[key]}
                      value={
                        promptObject.prompt_parameters &&
                        promptObject.prompt_parameters[key] !== undefined
                          ? promptObject.prompt_parameters[key]
                          : modelObject.model_parameters[key]
                          ? modelObject.model_parameters[key]['default']
                          : undefined
                      }
                      onChange={(value: any): void => {
                        setPromptInformation(
                          'prompt_parameters.' + key,
                          value
                        );
                      }}
                    />
                  ) : null
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;