import React, { useState } from 'react';
import PlaygroundButton from './PlaygroundButton';
import test from 'node:test';

interface CodeAreaProps {
    label: string;
    code: object;
    test: () => void;
}

const CodeArea: React.FC<CodeAreaProps> = ({ label, code, test }) => {

    const [isValidJSON, setIsValidJSON] = useState(true);

    return (
        <>
            <div className="flex justify-between">
                <span>{label}</span>
                <div className="mb-4">
                    {/*<PlaygroundButton
                        text="Test"
                        onClick={() => test()}
                    />*/}
                </div>
            </div>
            <pre
                style={{ whiteSpace: "pre-wrap" }}
                contentEditable={true}
                suppressContentEditableWarning={true}
                className={`p-4 hljs syntax-highlighter dark code-sample-pre ${isValidJSON ? "bg-white" : "bg-red-100"}`}
                onInput={(e) => {
                }}
            >
                {JSON.stringify(code, null, 2)}
            </pre>
        </>
    );

};

export default CodeArea;