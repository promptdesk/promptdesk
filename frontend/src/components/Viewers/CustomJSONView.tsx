import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import "./CustomJSONView.scss";

export function CustomJSONView({
  theme = "shapeshifter:inverted",
  displayObjectSize = false,
  displayDataTypes = false,
  sortKeys = true,
  ...props
}: any) {
  return (
    <div className={"custom-json-view"}>
      <JsonView
        theme={theme}
        displayObjectSize={displayObjectSize}
        displayDataTypes={displayDataTypes}
        sortKeys={sortKeys}
        {...props}
      />
    </div>
  );
}
