import { expect, it } from 'vitest';
import { render } from '../utils/rtlWrapper';
import Home from './Home';

it('renders <Home /> page', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Welcome!')).toBeTruthy();
});
