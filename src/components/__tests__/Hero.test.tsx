import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import Hero from '../Hero';

const mockProps = {
  activeTrack: 'pm',
};

describe('Hero Component', () => {
  it('renders PM content when activeTrack is pm', () => {
    render(<Hero {...mockProps} />);
    
    expect(screen.getByText('Certified Project Manager & Scrum Master')).toBeInTheDocument();
    expect(screen.getByText('14+ Years Leading Agile Teams & Digital Transformation')).toBeInTheDocument();
    expect(screen.getByText(/PMP, CSM, PSM certified professional/)).toBeInTheDocument();
  });

  it('renders Developer content when activeTrack is dev', () => {
    const devProps = { activeTrack: 'dev' };
    render(<Hero {...devProps} />);
    
    expect(screen.getByText('Senior Full Stack Mobile Developer')).toBeInTheDocument();
    expect(screen.getByText('14+ Years Building Scalable Mobile & Web Solutions')).toBeInTheDocument();
    expect(screen.getByText(/Expert in iOS, Android, and full-stack development/)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<Hero {...mockProps} />);
    
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Hero {...mockProps} />);
    
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks).toHaveLength(3); // LinkedIn, GitHub, Mail
  });

  it('shows PM certifications when activeTrack is pm', () => {
    render(<Hero {...mockProps} />);
    
    expect(screen.getByText('PMP Certified')).toBeInTheDocument();
    expect(screen.getByText('CSM')).toBeInTheDocument();
    expect(screen.getByText('PSM')).toBeInTheDocument();
    expect(screen.getByText('ITIL-4')).toBeInTheDocument();
  });

  it('shows Developer skills when activeTrack is dev', () => {
    const devProps = { activeTrack: 'dev' as const };
    render(<Hero {...devProps} />);
    
    expect(screen.getByText('iOS Expert')).toBeInTheDocument();
    expect(screen.getByText('Android')).toBeInTheDocument();
    expect(screen.getByText('Flutter')).toBeInTheDocument();
    expect(screen.getByText('AI/ML')).toBeInTheDocument();
  });

  it('has proper button accessibility', () => {
    render(<Hero {...mockProps} />);
    
    const downloadButton = screen.getByRole('button', { name: /download resume/i });
    const contactButton = screen.getByRole('button', { name: /get in touch/i });
    
    expect(downloadButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
  });

  it('applies animation classes after mount', async () => {
    render(<Hero {...mockProps} />);
    
    // Wait for the useEffect to trigger
    await waitFor(() => {
      const heroContent = screen.getByText('Certified Project Manager & Scrum Master').closest('div');
      expect(heroContent).toHaveClass('translate-y-0', 'opacity-100');
    });
  });

  it('renders profile placeholder', () => {
    render(<Hero {...mockProps} />);
    
    expect(screen.getByText('Photo')).toBeInTheDocument();
  });

  it('switches content when activeTrack changes', () => {
    const { rerender } = render(<Hero {...mockProps} />);
    
    // Initially shows PM content
    expect(screen.getByText('Certified Project Manager & Scrum Master')).toBeInTheDocument();
    
    // Switch to dev track
    rerender(<Hero activeTrack="dev" />);
    
    expect(screen.getByText('Senior Full Stack Mobile Developer')).toBeInTheDocument();
    expect(screen.queryByText('Certified Project Manager & Scrum Master')).not.toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Hero {...mockProps} />);
    
    // Check for section element
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    
    // Check for heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
  });
});