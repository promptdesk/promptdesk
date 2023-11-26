//import ReactJson from 'react-json-view'
//import dynamic from 'next/dynamic';
import dynamic from 'next/dynamic'
const ReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false } // <-- not including this component on server-side
)
import "./CustomJSONView.scss";

export function CustomJSONView(props: any) {
    return <div className={"custom-json-view"}>
        <ReactJson
            theme={"shapeshifter:inverted"}
            displayObjectSize={false}
            displayDataTypes={false}
            sortKeys={true}
            {...props}
        />
    </div>
}
