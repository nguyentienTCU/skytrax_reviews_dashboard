import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import ThemeRegistry from '@/components/ThemeRegistry';
import { ThemeColorProvider } from '@/app/context/ThemeContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeRegistry>
      <ThemeColorProvider>
        {children}
      </ThemeColorProvider>
    </ThemeRegistry>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
