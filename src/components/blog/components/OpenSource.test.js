import { render, screen, within } from '@testing-library/react';
import OpenSource from './OpenSource';

const showcased = [
  'zephyr',
  'apple-watch-captions',
  'melon-tap',
  'audiobooks-appletv',
];

const compact = ['dropnotch', 'fh-community-bot'];

describe('OpenSource', () => {
  it('links every repo to its GitHub page in a new tab', () => {
    render(<OpenSource />);

    [...showcased, ...compact].forEach((repo) => {
      const link = screen.getByRole('link', { name: new RegExp(repo, 'i') });
      expect(link).toHaveAttribute('href', `https://github.com/jonyen/${repo}`);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('gives each showcased repo a screenshot with descriptive alt text', () => {
    render(<OpenSource />);

    showcased.forEach((repo) => {
      const link = screen.getByRole('link', { name: new RegExp(repo, 'i') });
      const image = within(link).getByRole('img');
      expect(image).toHaveAccessibleName(/screenshot/i);
    });
  });

  it('renders the compact repos without a screenshot', () => {
    render(<OpenSource />);

    compact.forEach((repo) => {
      const link = screen.getByRole('link', { name: new RegExp(repo, 'i') });
      expect(within(link).queryByRole('img')).not.toBeInTheDocument();
    });
  });

  it('is numbered after the portfolio section', () => {
    render(<OpenSource />);

    expect(screen.getByText(/04 \/ Open Source/i)).toBeInTheDocument();
  });
});
