import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';

export const render = (ui: JSX.Element, options: RenderOptions = {}, route = '/'): RenderResult => {
  window.history.pushState({}, '', route);
  return rtlRender(ui, options);
};
