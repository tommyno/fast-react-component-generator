// Basic validation of component name
export const validateComponentName = (componentName: string | null) => {
  if (!componentName || componentName === "") {
    return "The name can not be empty";
  }
  if (!componentName.match(/^[A-Z]/)) {
    return "The name has to start with a uppercase alphabet";
  }
  if (!componentName.match(/^[0-9a-zA-Z]+$/)) {
    return "The name can't have non-alphanumeric character";
  }
  return null;
};

export const pickOptions = {
  scss: "Use SCSS",
  cssModules: "Use CSS Modules",
  storybook: "Include Storybook",
};

export const pickSettings = {
  canPickMany: true,
  placeHolder: "Select features to be included",
  ignoreFocusOut: true,
};

type IsOptions = {
  isCssModules?: boolean;
  isScss?: boolean;
  componentName?: string;
};

export const generateClassName = ({ isCssModules }: IsOptions) => {
  return isCssModules ? "{styles.wrap}" : '"wrap"';
};

export const generateStyleExtension = ({ isCssModules, isScss }: IsOptions) => {
  if (isCssModules && isScss) {
    return "module.scss";
  }
  if (isCssModules) {
    return "module.css";
  }
  if (isScss) {
    return "scss";
  }
  return "css";
};

export const generateStyleImport = ({
  isCssModules,
  isScss,
  componentName,
}: IsOptions) => {
  const styleExtension = generateStyleExtension({ isCssModules, isScss });
  if (isCssModules) {
    return `import styles from './${componentName}.${styleExtension}'`;
  }
  return `import './${componentName}.${styleExtension}'`;
};
