import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';


// ── Helper to filter non-DOM props from framer-motion ──
function filterDomProps(props) {
  const {
    initial, animate, exit, transition, variants, layoutId,
    whileHover, whileTap, whileInView, onAnimationComplete,
    spotlightColor,
    ...domProps
  } = props;
  return domProps;
}

// ── Mock framer-motion ──
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...filterDomProps(props)}>{children}</div>),
    h2: React.forwardRef(({ children, ...props }, ref) => <h2 ref={ref} {...filterDomProps(props)}>{children}</h2>),
    h3: React.forwardRef(({ children, ...props }, ref) => <h3 ref={ref} {...filterDomProps(props)}>{children}</h3>),
    p: React.forwardRef(({ children, ...props }, ref) => <p ref={ref} {...filterDomProps(props)}>{children}</p>),
    img: React.forwardRef((props, ref) => <img ref={ref} {...filterDomProps(props)} />),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  LayoutGroup: ({ children }) => <>{children}</>,
}));

// ── Mock SpotlightCard (used by ProjectCard) ──
vi.mock('../components/ui/SpotlightCard', () => ({
  default: ({ children }) => <div data-testid="spotlight-card">{children}</div>,
}));

// ── Mock useDocumentTitle ──
vi.mock('../hooks/useDocumentTitle', () => ({
  default: () => {},
}));

// ── Mock DynamicIcon ──
vi.mock('../admin/components/DynamicIcon', () => ({
  default: ({ iconIdentifier }) => <span data-testid={`icon-${iconIdentifier}`}>icon</span>,
}));

// ── Dummy project data with BOTH en and _id fields ──
const MOCK_PROJECTS_FULL = [
  {
    id: '1',
    image_url: '/test-image.png',
    title: 'My Portfolio',
    short_description: 'A personal website',
    overview: 'This is a full project overview.',
    role: 'Frontend Developer',
    key_features: ['Feature A', 'Feature B'],
    responsibilities: ['Build UI', 'Write tests'],
    live_demo_url: 'https://demo.com',
    github_url: 'https://github.com/test',
    tech_stacks: [
      { name: 'React', icon_identifier: 'FaReact' },
    ],
  },
];

// Project with MISSING _id fields (for fallback testing)
const MOCK_PROJECTS_NO_ID = [
  {
    id: '2',
    image_url: '/test-image-2.png',
    title: 'English Only Project',
    title_id: null,
    short_description: 'English only tagline',
    short_description_id: '',
    overview: 'English overview only',
    overview_id: null,
    role: 'Backend Dev',
    role_id: null,
    key_features: ['Only EN Feature'],
    key_features_id: null,
    responsibilities: ['Only EN responsibility'],
    responsibilities_id: null,
    live_demo_url: null,
    github_url: null,
    tech_stacks: [],
  },
];

// ── Mock getPublicProjects ──
let mockProjectsData = MOCK_PROJECTS_FULL;
vi.mock('../admin/services/projectService', () => ({
  getPublicProjects: () => Promise.resolve(mockProjectsData),
}));

// ── Import component AFTER mocks ──
import Projects from '../pages/Projects';

describe('Projects — Bilingual Rendering', () => {
  beforeEach(() => {
    mockProjectsData = MOCK_PROJECTS_FULL;
  });

  it('renders project content', async () => {
    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText('My Portfolio')).toBeInTheDocument();
    });

    expect(screen.getByText('A personal website')).toBeInTheDocument();
  });

  // ═══════════════════════════════════════════
  // Additional: Loading and error states
  // ═══════════════════════════════════════════
  it('shows loading spinner initially', () => {
    render(<Projects />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders project card with tech stack badge', async () => {
    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });
});
