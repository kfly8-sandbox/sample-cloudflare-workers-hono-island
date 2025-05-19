import type { ComponentType, FC } from 'react';

/**
 * Create an island component for server-side rendering.
 */
export function $island<P extends object>(
  Component: ComponentType<P>,
): FC<P> {
  const componentName = Component.displayName || Component.name;

  const IslandComponent: FC<P> = (props) => {
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
