import React from "react";
import "../styles/main.scss";
import { Provider } from "react-redux";
import { DataProvider } from "../src/context/DataContext";
import { fn } from "@storybook/test";
import { mockStore } from "../mocks/mockStore";
import { initialize, mswDecorator, mswLoader } from "msw-storybook-addon";
import { handlers } from "../mocks/handlers";

import type { Preview, StoryContext } from "@storybook/react";

initialize();

const withProviders = (Story, context: StoryContext) => {
  const initialState = context.parameters.initialState || {};
  const store = mockStore(initialState);
  return (
    <DataProvider>
      <Provider store={store}>
        <Story />
      </Provider>
    </DataProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { onClick: fn() },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers: [...handlers],
    },
  },
  loaders: [mswLoader],
  decorators: [withProviders],
  tags: ["autodocs"],
};

export default preview;
