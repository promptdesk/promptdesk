import React from "react";
import { useRouter } from "next/router";
import PlaygroundButton from "../Form/PlaygroundButton";

interface LogRowProps {
  index: number;
  log: any;
  handleRowClick: (logId: string) => void;
  getPromptName: (id: string) => string;
  getModelName: (id: string) => string;
  expandedRows: Record<string, boolean>;
}

const LogRow: React.FC<LogRowProps> = ({
  index,
  log,
  handleRowClick,
  getPromptName,
  getModelName,
  expandedRows,
}) => {
  const { push } = useRouter();

  function goToLogDetails(id: string) {
    push(`/logs/${id}`);
  }

  const modelName = getModelName(log.model_id);
  const promptName = getPromptName(log.prompt_id);

  return (
    <>
      <tr
        key={log.id}
        onClick={() => handleRowClick(log.id)}
        className="cursor-pointer"
        //add id if index is 0
        id={index === 3 ? "sample-log" : ""}
      >
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
          {promptName}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {modelName}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {log.createdAt.toString()}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {log.duration || 0}
        </td>
        <td
          className={`whitespace-nowrap px-3 py-4 text-sm ${log.status && log.status !== 200 ? "bg-yellow-300" : ""
            } text-gray-500`}
        >
          {log.status}
        </td>
        <td
          onClick={() => {
            goToLogDetails(log.id);
          }}
          className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap"
        >
          View
        </td>
      </tr>
      {expandedRows[log.id] && (
        <tr>
          <td colSpan={6}>
            {promptName !== 'N/a' && <PlaygroundButton text="Go to Prompt" onClick={() => push(`workspace/${log.prompt_id}`)} />}
            {modelName !== 'N/a' && <PlaygroundButton text="Go to Model" onClick={() => push(`models/${log.model_id}`)} />}
            {promptName !== 'N/a' && <PlaygroundButton text="Go to Samples" onClick={() => push(`workspace/${log.prompt_id}/samples`)} />}
            <div className="mt-2 bg-gray-100">
              {!log.error && log.data ? (
                <div className="flex">
                  <div className="w-1/2 p-4" style={{ whiteSpace: "pre-wrap" }}>
                    {log.data.prompt !== undefined ||
                      log.data.context !== undefined ? (
                      <div className="mb-4">
                        <fieldset className="border p-2">
                          <legend className="w-auto">
                            {log.data.context ? "context" : "prompt"}
                          </legend>
                          <p>{log.data.prompt || log.data.context}</p>
                        </fieldset>
                      </div>
                    ) : null}
                    {log.data.messages ? (
                      <div className="mb-4">
                        {log.data.messages.map((message: any, index: any) => (
                          <fieldset className="border p-2" key={index}>
                            <legend className="w-auto">{message.role}</legend>
                            <p>{message.content}</p>
                          </fieldset>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="w-1/2 p-4" style={{ whiteSpace: "pre-wrap" }}>
                    {typeof log.message === "string" ? (
                      <fieldset className="border p-2">
                        <legend className="w-auto">output</legend>
                        <p>{log.message}</p>
                      </fieldset>
                    ) : (
                      <fieldset className="border p-2">
                        <legend className="w-auto">{log?.message?.role}</legend>
                        <p>{log?.message?.content}</p>
                      </fieldset>
                    )}
                  </div>
                </div>
              ) : (
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(log, null, 2)}
                </pre>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default LogRow;
