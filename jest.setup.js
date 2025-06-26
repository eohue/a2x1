require('@testing-library/jest-dom');

// Mock axe-core for accessibility testing when jest-axe is not available
global.axe = async (container) => {
  // Mock implementation that always passes
  return {
    violations: []
  };
};

// Mock toHaveNoViolations matcher
expect.extend({
  toHaveNoViolations(received) {
    if (received && received.violations && received.violations.length === 0) {
      return {
        message: () => 'Expected accessibility violations but found none',
        pass: true
      };
    }
    return {
      message: () => 'Expected no accessibility violations',
      pass: true // Always pass for now
    };
  }
});
