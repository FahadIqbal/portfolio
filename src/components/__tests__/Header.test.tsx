import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import Header from '../Header';

const mockProps = {
  activeTrack: 'pm',
  setActiveTrack: vi.fn(),
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the portfolio title', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header {...mockProps} />);
    
    const navItems = ['About', 'Experience', 'Projects', 'Skills', 'Contact'];
    navItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('shows active track correctly', () => {
    render(<Header {...mockProps} />);
    
    const pmButton = screen.getByText('Project Manager');
    const devButton = screen.getByText('Developer');
    
    expect(pmButton).toHaveClass('bg-white');
    expect(devButton).not.toHaveClass('bg-white');
  });

  it('calls setActiveTrack when track button is clicked', () => {
    render(<Header {...mockProps} />);
    
    const devButton = screen.getByText('Developer');
    fireEvent.click(devButton);
    
    expect(mockProps.setActiveTrack).toHaveBeenCalledWith('dev');
  });

  it('toggles mobile menu when menu button is clicked', () => {
    render(<Header {...mockProps} />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Check if mobile menu items are visible
    expect(screen.getByText('PM')).toBeInTheDocument();
    expect(screen.getByText('Dev')).toBeInTheDocument();
  });

  it('renders with developer track active', () => {
    const devProps = { ...mockProps, activeTrack: 'dev' as const };
    render(<Header {...devProps} />);
    
    const pmButton = screen.getByText('Project Manager');
    const devButton = screen.getByText('Developer');
    
    expect(devButton).toHaveClass('bg-white');
    expect(pmButton).not.toHaveClass('bg-white');
  });

  it('has proper accessibility attributes', () => {
    render(<Header {...mockProps} />);
    
    // Check for proper button roles
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check for proper navigation structure
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('has correct href attributes for navigation links', () => {
    render(<Header {...mockProps} />);
    
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).toHaveAttribute('href', '#about');
    
    const experienceLink = screen.getByRole('link', { name: 'Experience' });
    expect(experienceLink).toHaveAttribute('href', '#experience');
  });

  it('maintains state when switching between tracks', () => {
    const { rerender } = render(<Header {...mockProps} />);
    
    // Initially PM is active
    expect(screen.getByText('Project Manager')).toHaveClass('bg-white');
    
    // Switch to dev track
    const updatedProps = { ...mockProps, activeTrack: 'dev' as const };
    rerender(<Header {...updatedProps} />);
    
    expect(screen.getByText('Developer')).toHaveClass('bg-white');
    expect(screen.getByText('Project Manager')).not.toHaveClass('bg-white');
  });
});