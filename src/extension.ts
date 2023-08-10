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
import {
  generateClassName,
  generateStyleExtension,
  generateStyleImport,
  pickOptions,
  pickSettings,
  validateComponentName,
} from "./utils/helpers";

// Run on activation (when vscode loads)
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("fast-react-component-generator", execute)
  );
}

// Run every time the command is executed
const execute = ({ fsPath }: { fsPath: string }) => {
  const componentNameOptions: vscode.InputBoxOptions = {
    prompt: `Component will be created at ${fsPath}`,
    placeHolder: "Enter component name",
    validateInput: validateComponentName,
    ignoreFocusOut: true,
  };

  // Ask for options
  vscode.window
    .showQuickPick(Object.values(pickOptions), pickSettings)
    .then((selectedItems) => {
      // Ask for component name
      vscode.window.showInputBox(componentNameOptions).then((componentName) => {
        if (typeof componentName === "string") {
          const componentFolder = path.join(fsPath, componentName);
          const isScss = !!selectedItems?.includes(pickOptions.scss);
          const isCssModules = !!selectedItems?.includes(
            pickOptions.cssModules
          );
          const isStorybook = !!selectedItems?.includes(pickOptions.storybook);

          try {
            // Create a new folder
            fs.mkdirSync(componentFolder);

            // Add main file
            fs.writeFileSync(
              path.join(componentFolder, `${componentName}.tsx`),
              mustache.render(templateComponent, {
                componentName,
                styleImport: generateStyleImport({
                  isCssModules,
                  isScss,
                  componentName,
                }),
                className: generateClassName({ isCssModules }),
              })
            );

            // Add index file
            fs.writeFileSync(
              path.join(componentFolder, "index.ts"),
              mustache.render(templateIndex, { componentName })
            );

            // Add stylesheet
            fs.writeFileSync(
              path.join(
                componentFolder,
                `${componentName}.${generateStyleExtension({
                  isCssModules,
                  isScss,
                })}`
              ),
              mustache.render(templateStylesheet, {})
            );

            // Add storybook
            if (isStorybook) {
              fs.writeFileSync(
                path.join(componentFolder, `${componentName}.stories.tsx`),
                mustache.render(templateStory, { componentName })
              );
            }

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
    });
};

// Clean up when deactivated
export function deactivate() {}
