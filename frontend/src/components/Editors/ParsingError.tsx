import "./ParsingError.scss";

/**
 * This widget is used to display template parsing errors when parsing a prompt template.
 * @param props
 * @constructor
 */
export function ParsingError({ error }: { error: any | null }) {
  if (!error) {
    return <></>;
  } else {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative parsing-error-alert-box mt-2"
        role="alert"
      >
        <strong className="font-bold">
          Error while parsing the template with Handlebars:
        </strong>
        <br />
        <span className="block sm:inline">{error.message}</span>
        <br />
        <span className="block sm:inline">{error.stack}</span>
      </div>
    );
  }
}
