export const templateComponent = `import React from 'react';

{{{styleImport}}}

type Props = {
  example?: string
};

export const {{componentName}}: React.FC<Props> = () => {
  return (
    <div className={{{className}}}>
      {{componentName}}
    </div>
  );
};
`;

export const templateIndex = `export { {{componentName}} } from './{{componentName}}';`;

export const templateStylesheet = `.wrap {
  display: block;
}`;

export const templateStory = `
import type { Meta, StoryObj } from "@storybook/react";
import { {{componentName}} } from ".";

const meta: Meta<typeof {{componentName}}> = {
  title: "Components/{{componentName}}",
  component: {{componentName}},
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof {{componentName}}>;

export const Default: Story = {
  args: {
    // Props
  },
};

`;
