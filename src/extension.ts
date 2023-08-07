import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as mustache from "mustache";
import {
  templateComponent,
  templateIndex,
  templateStory,
  templateStylesheet,
} from "./templates/react";
import { validateName } from "./utils/validation";

// Run on activation (when vscode loads)
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("fast-react-component-generator", execute)
  );
}

// Run every time the command is executed
const execute = ({ fsPath }: { fsPath: string }) => {
  // const options = ["css", "js"];
  // const settings = {
  //   canPickMany: true,
  //   placeHolder: "Select features to be included",
  //   ignoreFocusOut: true,
  // };
  // vscode.window.showQuickPick(options, settings);

  const componentNameOptions: vscode.InputBoxOptions = {
    prompt: `Component will be created at ${fsPath}`,
    placeHolder: "Enter component name",
    validateInput: validateName,
    ignoreFocusOut: true,
  };

  // Ask for component name
  vscode.window.showInputBox(componentNameOptions).then((componentName) => {
    if (typeof componentName === "string") {
      const componentFolder = path.join(fsPath, componentName);
      try {
        // Create a new folder
        fs.mkdirSync(componentFolder);

        // Add main file
        fs.writeFileSync(
          path.join(componentFolder, `${componentName}.tsx`),
          mustache.render(templateComponent, { componentName })
        );

        // Add index file
        fs.writeFileSync(
          path.join(componentFolder, "index.ts"),
          mustache.render(templateIndex, { componentName })
        );

        // Add stylesheet
        fs.writeFileSync(
          path.join(componentFolder, `${componentName}.module.scss`),
          mustache.render(templateStylesheet, {})
        );

        // Add storybook
        fs.writeFileSync(
          path.join(componentFolder, `${componentName}.stories.tsx`),
          mustache.render(templateStory, { componentName })
        );

        // Open main file in editor
        // Add a 0.5-second delay to make sure files are created
        setTimeout(() => {
          vscode.workspace
            .openTextDocument(
              path.join(componentFolder, `${componentName}.tsx`)
            )
            .then((document) => {
              vscode.window.showTextDocument(document);
            });
        }, 500);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Could not create the component. ${error}`
        );
      }
    }
  });
};

// Clean up when deactivated
export function deactivate() {}
