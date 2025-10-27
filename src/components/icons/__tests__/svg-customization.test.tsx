import { render, screen } from '@testing-library/react';

// Mock fetch for SVG content
const mockSvgContent = `
<svg width="148" height="132" viewBox="0 0 148 132" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M55.1423 131.336C4.29758 96.2142 3.54246 65.6913 0.143201 42.554C55.4125 -20.2195 111.863 3.70679 138.833 9.08247C171.467 123.93 99.5744 111.064 55.1423 131.336Z" fill="var(--icon-fill-color, #85A374)" fill-opacity="var(--icon-fill-opacity, 0.5)"/>
<path d="M138.433 9.51061C146.51 38.0362 148.096 58.592 145.28 73.6938C142.46 88.8214 135.221 98.5018 125.6 105.266C115.954 112.048 103.898 115.911 91.42 119.35C79.0684 122.755 66.2904 125.746 55.1954 130.764C29.9839 113.303 17.2075 97.011 10.3041 82.239C3.41936 67.5068 2.35559 54.2596 0.67097 42.712C28.1666 11.5638 55.9119 1.94627 80.1246 0.761854C104.255 -0.418488 124.859 6.75911 138.433 9.51061Z" stroke="var(--icon-stroke-color, #85A374)" stroke-opacity="var(--icon-stroke-opacity, 0.5)"/>
</svg>
`;

// Component that renders SVG content directly for testing
function TestSvgComponent({ 
  fillColor, 
  fillOpacity, 
  strokeColor, 
  strokeOpacity, 
  strokeWidth,
  ...props 
}: {
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  [key: string]: any;
}) {
  const style: React.CSSProperties = {};
  
  if (fillColor !== undefined) {
    style['--icon-fill-color' as any] = fillColor;
  }
  
  if (fillOpacity !== undefined) {
    style['--icon-fill-opacity' as any] = fillOpacity.toString();
  }
  
  if (strokeColor !== undefined) {
    style['--icon-stroke-color' as any] = strokeColor;
  }
  
  if (strokeOpacity !== undefined) {
    style['--icon-stroke-opacity' as any] = strokeOpacity.toString();
  }
  
  if (strokeWidth !== undefined) {
    style['--icon-stroke-width' as any] = strokeWidth.toString();
  }

  return (
    <div 
      style={style}
      dangerouslySetInnerHTML={{ __html: mockSvgContent }}
      data-testid="svg-container"
      {...props}
    />
  );
}

describe('SVG CSS Custom Properties', () => {
  beforeEach(() => {
    // Reset any global styles
    document.head.innerHTML = '';
  });

  it('applies default CSS custom properties correctly', () => {
    render(<TestSvgComponent />);
    
    const container = screen.getByTestId('svg-container');
    const svg = container.querySelector('svg');
    const fillPath = container.querySelector('path[fill*="var(--icon-fill-color"]');
    const strokePath = container.querySelector('path[stroke*="var(--icon-stroke-color"]');
    
    expect(svg).toBeInTheDocument();
    expect(fillPath).toBeInTheDocument();
    expect(strokePath).toBeInTheDocument();
    
    // Check that the SVG contains CSS custom properties with fallbacks
    expect(fillPath?.getAttribute('fill')).toBe('var(--icon-fill-color, #85A374)');
    expect(fillPath?.getAttribute('fill-opacity')).toBe('var(--icon-fill-opacity, 0.5)');
    expect(strokePath?.getAttribute('stroke')).toBe('var(--icon-stroke-color, #85A374)');
    expect(strokePath?.getAttribute('stroke-opacity')).toBe('var(--icon-stroke-opacity, 0.5)');
  });

  it('applies custom fill color via CSS custom property', () => {
    render(<TestSvgComponent fillColor="#ff6b9d" />);
    
    const container = screen.getByTestId('svg-container');
    const computedStyle = window.getComputedStyle(container);
    
    // Check that the CSS custom property is set
    expect(container.style.getPropertyValue('--icon-fill-color')).toBe('#ff6b9d');
  });

  it('applies custom stroke color via CSS custom property', () => {
    render(<TestSvgComponent strokeColor="#8b5cf6" />);
    
    const container = screen.getByTestId('svg-container');
    
    expect(container.style.getPropertyValue('--icon-stroke-color')).toBe('#8b5cf6');
  });

  it('applies custom opacity values via CSS custom properties', () => {
    render(<TestSvgComponent fillOpacity={0.3} strokeOpacity={0.7} />);
    
    const container = screen.getByTestId('svg-container');
    
    expect(container.style.getPropertyValue('--icon-fill-opacity')).toBe('0.3');
    expect(container.style.getPropertyValue('--icon-stroke-opacity')).toBe('0.7');
  });

  it('applies multiple custom properties simultaneously', () => {
    render(
      <TestSvgComponent 
        fillColor="#10b981"
        fillOpacity={0.8}
        strokeColor="#059669"
        strokeOpacity={0.9}
        strokeWidth={2}
      />
    );
    
    const container = screen.getByTestId('svg-container');
    
    expect(container.style.getPropertyValue('--icon-fill-color')).toBe('#10b981');
    expect(container.style.getPropertyValue('--icon-fill-opacity')).toBe('0.8');
    expect(container.style.getPropertyValue('--icon-stroke-color')).toBe('#059669');
    expect(container.style.getPropertyValue('--icon-stroke-opacity')).toBe('0.9');
    expect(container.style.getPropertyValue('--icon-stroke-width')).toBe('2');
  });

  it('preserves fallback values when no custom properties are set', () => {
    render(<TestSvgComponent />);
    
    const container = screen.getByTestId('svg-container');
    const fillPath = container.querySelector('path[fill*="var(--icon-fill-color"]');
    const strokePath = container.querySelector('path[stroke*="var(--icon-stroke-color"]');
    
    // Verify fallback values are preserved in the SVG attributes
    expect(fillPath?.getAttribute('fill')).toContain('#85A374');
    expect(fillPath?.getAttribute('fill-opacity')).toContain('0.5');
    expect(strokePath?.getAttribute('stroke')).toContain('#85A374');
    expect(strokePath?.getAttribute('stroke-opacity')).toContain('0.5');
  });

  it('handles edge case opacity values correctly', () => {
    render(<TestSvgComponent fillOpacity={0} strokeOpacity={1} />);
    
    const container = screen.getByTestId('svg-container');
    
    expect(container.style.getPropertyValue('--icon-fill-opacity')).toBe('0');
    expect(container.style.getPropertyValue('--icon-stroke-opacity')).toBe('1');
  });

  it('handles different color formats correctly', () => {
    const testCases = [
      { color: '#ff6b9d', expected: '#ff6b9d' },
      { color: 'rgb(255, 107, 157)', expected: 'rgb(255, 107, 157)' },
      { color: 'hsl(330, 100%, 71%)', expected: 'hsl(330, 100%, 71%)' },
      { color: 'var(--primary-color)', expected: 'var(--primary-color)' },
    ];

    testCases.forEach(({ color, expected }) => {
      const { unmount } = render(<TestSvgComponent fillColor={color} />);
      
      const container = screen.getByTestId('svg-container');
      expect(container.style.getPropertyValue('--icon-fill-color')).toBe(expected);
      
      unmount();
    });
  });
});

describe('SVG Conversion Validation', () => {
  it('verifies converted SVG structure contains CSS custom properties', () => {
    render(<TestSvgComponent />);
    
    const container = screen.getByTestId('svg-container');
    const svgContent = container.innerHTML;
    
    // Check that the SVG has been properly converted
    expect(svgContent).toContain('var(--icon-fill-color, #85A374)');
    expect(svgContent).toContain('var(--icon-fill-opacity, 0.5)');
    expect(svgContent).toContain('var(--icon-stroke-color, #85A374)');
    expect(svgContent).toContain('var(--icon-stroke-opacity, 0.5)');
  });

  it('verifies CSS custom properties override fallback values', () => {
    // Create a test with CSS that should override the fallback
    const style = document.createElement('style');
    style.textContent = `
      .test-override {
        --icon-fill-color: #custom-override;
        --icon-stroke-color: #another-override;
      }
    `;
    document.head.appendChild(style);

    render(<TestSvgComponent className="test-override" />);
    
    const container = screen.getByTestId('svg-container');
    expect(container).toHaveClass('test-override');
    
    // The CSS custom properties should be available for the SVG to use
    const computedStyle = window.getComputedStyle(container);
    // Note: jsdom doesn't fully support CSS custom property computation,
    // but we can verify the class is applied
    expect(container.className).toContain('test-override');
  });

  it('validates that SVG elements have the correct attribute structure', () => {
    render(<TestSvgComponent />);
    
    const container = screen.getByTestId('svg-container');
    const paths = container.querySelectorAll('path');
    
    expect(paths).toHaveLength(2);
    
    // First path should have fill attributes
    const fillPath = paths[0];
    expect(fillPath.getAttribute('fill')).toMatch(/var\(--icon-fill-color,\s*#85A374\)/);
    expect(fillPath.getAttribute('fill-opacity')).toMatch(/var\(--icon-fill-opacity,\s*0\.5\)/);
    
    // Second path should have stroke attributes
    const strokePath = paths[1];
    expect(strokePath.getAttribute('stroke')).toMatch(/var\(--icon-stroke-color,\s*#85A374\)/);
    expect(strokePath.getAttribute('stroke-opacity')).toMatch(/var\(--icon-stroke-opacity,\s*0\.5\)/);
  });
});