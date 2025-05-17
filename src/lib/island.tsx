import React from 'react';

/**
 * Create an island component for server-side rendering.
 */
export function createIsland<P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
): React.FC<P> {
  const componentName = displayName || Component.displayName || Component.name;

  const IslandComponent: React.FC<P> = (props) => {
    return (
      <div
        data-app-hydrated="false"
        data-app-component={componentName}
        data-app-props={JSON.stringify(props)}
      >
        <Component {...props} />
      </div>
    );
  };

  // Mark `$` to the island component
  IslandComponent.displayName = `$${componentName}`;

  return IslandComponent;
}
