import ReactJson from 'react-json-view'
import "./CustomJSONView.scss";

/**
 * This is just a wrapper around react-json-view that sets styles
 * to the we like it, such as formatting strings with whitespace
 * in pre-wrap mode, which looks better on long prompts with lots
 * of data.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function CustomJSONView(props: any) {
    return <div className={"custom-json-view"}>
        <ReactJson
            src={props.src}
            theme={"shapeshifter:inverted"}
            displayObjectSize={false}
            displayDataTypes={false}
            sortKeys={true}
            name={props.name}
        />
    </div>
}
