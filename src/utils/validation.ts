// Basic validation of component name

type Props = string | null;
export const validateName = (componentName: Props) => {
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
