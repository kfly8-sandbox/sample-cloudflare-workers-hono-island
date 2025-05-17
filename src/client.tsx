import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import React from 'react'

type ReactComponent = React.ComponentType<any>

interface ComponentModule {
  [key: string]: ReactComponent | undefined;
  default?: ReactComponent;
  Counter?: ReactComponent;
}

type GlobModules = {
  [path: string]: () => Promise<ComponentModule>;
}

const ISLAND_DIRECTORY = './islands'
const COMPONENT_MODULES = import.meta.glob<ComponentModule>('./islands/*.tsx', { eager: false }) as GlobModules

async function hydrateAllIslands() {
  const islands = document.querySelectorAll('[data-app-hydrated]')
  console.log('Found islands:', islands.length)
  console.log('Available component modules:', Object.keys(COMPONENT_MODULES))

  const islandsToHydrate = Array.from(islands).filter(island =>
    island.getAttribute('data-app-hydrated') === 'false' &&
    island.getAttribute('data-app-component')
  );

  await Promise.all(
    islandsToHydrate.map(async (island) => {
      const componentName = island.getAttribute('data-app-component')!;
      await hydrateIsland(island, componentName);
      island.setAttribute('data-app-hydrated', 'true');
    })
  );

  console.log(`Hydrated ${islandsToHydrate.length} islands`);
}

async function hydrateIsland(element: Element, componentName: string) {
  try {
    console.log(`Attempting to hydrate ${componentName} island`)

    const modulePath = `${ISLAND_DIRECTORY}/${componentName}.tsx`
    const importedModule = await COMPONENT_MODULES[modulePath]() as ComponentModule

    const Component = importedModule[componentName] ?? importedModule.default

    if (!Component) {
      console.error(`No suitable component export found for ${componentName}`)
      return
    }

    let props = {}
    if (element.hasAttribute('data-app-props')) {
      try {
        props = JSON.parse(element.getAttribute('data-app-props') || '{}')
      } catch (e) {
        console.error('Failed to parse props:', e)
      }
    }

    hydrateRoot(element, createElement(Component, props))
    console.log(`Successfully hydrated ${componentName} island with component:`, Component.name || 'anonymous')
  } catch (error) {
    console.error(`Failed to hydrate ${componentName} island:`, error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  hydrateAllIslands().catch(err => {
    console.error('Failed to hydrate islands:', err)
  })
})
