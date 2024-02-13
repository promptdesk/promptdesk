import { useEffect, useRef } from "react";

export function extractVariablesFromAST(
  ast: any,
  parentContext = null,
  variableTypes = {} as any,
) {
  switch (ast.type) {
    case "Program":
      ast.body.forEach((node: any) => {
        extractVariablesFromAST(node, parentContext, variableTypes);
      });
      break;
    case "MustacheStatement":
      if (ast.path.type === "PathExpression") {
        let varName = ast.path.original;
        if (varName.includes(".")) {
          let parts = varName.split(".");
          let parentVar = parts.slice(0, -1).join(".");
          variableTypes[parentVar] = { type: "object", value: {} };
        } else {
          varName = parentContext ? `${parentContext}.${varName}` : varName;
          variableTypes[varName] = { type: "text", value: "" }; // Default to text
        }
      }
      break;
    case "BlockStatement":
      const blockVarName = ast.params[0].original;
      const fullBlockVarName = parentContext
        ? `${parentContext}.${blockVarName}`
        : blockVarName;

      if (ast.path.original === "with" || ast.path.original === "each") {
        // Treat the variable as an object for 'with' and 'each' blocks
        variableTypes[fullBlockVarName] = { type: "object", value: {} };
        // Change context for inner variables
        const newContext =
          ast.path.original === "with" ? fullBlockVarName : blockVarName;
        extractVariablesFromAST(ast.program, newContext, variableTypes);
      } else {
        // For other block statements, keep as text
        variableTypes[fullBlockVarName] = { type: "text", value: "" };
        extractVariablesFromAST(ast.program, parentContext, variableTypes);
      }
      break;
  }

  //remove all dict items that contain a period
  Object.keys(variableTypes).forEach((key) => {
    if (key.includes(".")) {
      delete variableTypes[key];
    }
  });

  return variableTypes;
}

export function isValidName(name: string) {
  //alert if name is no A-Z, a-z, 0-9, _ or -
  const regex = /^[a-zA-Z0-9_-]*$/;
  return regex.test(name);
}

export function useKey(key: any, cb: any) {
  const callback = useRef(cb);

  useEffect(() => {
    callback.current = cb;
  });

  useEffect(() => {
    function handle(event: any) {
      if (event.code === key) {
        callback.current(event);
      } else if (
        key === "ctrls" &&
        event.key === "s" &&
        (event.ctrlKey || event.metaKey)
      ) {
        // This will now work for both Ctrl+S and Command+S
        event.preventDefault();
        callback.current(event);
      }
    }

    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [key]);
}

export function exportPrompt(promptObject: any, modelObject: any) {
  //downloadf promptObject as json with name promptObject.name
  const element = document.createElement("a");
  let obj = JSON.parse(JSON.stringify(promptObject, null, 4));
  //remove organization_id, createdAt, updatedAt,  __v, project, id, model
  delete obj.organization_id;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.__v;
  delete obj.project;
  delete obj.id;
  delete obj.model;
  delete obj.model_parameters;
  obj.model_type = modelObject.type;
  const file = new Blob([JSON.stringify(obj, null, 4)], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = `${promptObject.name}.json`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  //remove element
  document.body.removeChild(element);
}
