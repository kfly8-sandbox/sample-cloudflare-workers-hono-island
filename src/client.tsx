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

const componentModules = import.meta.glob<ComponentModule>('./islands/*.tsx', { eager: false }) as GlobModules

document.addEventListener('DOMContentLoaded', async () => {
  const islands = document.querySelectorAll('[data-app-hydrated]')
  console.log('Found islands:', islands.length)
  console.log('Available component modules:', Object.keys(componentModules))

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
})

// 特定のアイランドをハイドレーションする関数
async function hydrateIsland(element: Element, componentName: string) {
  try {
    console.log(`Attempting to hydrate ${componentName} island`)

    // コンポーネント名からパスを推測（大文字で始まる可能性があるため）
    const possiblePaths = [
      `./islands/${componentName}.tsx`,
      `./islands/${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.tsx`
    ]

    // いずれかのパスが存在するか確認
    const modulePath = possiblePaths.find(path => path in componentModules)

    if (!modulePath) {
      console.warn(`No component file found for: ${componentName}`)
      console.log('Available modules:', Object.keys(componentModules))
      return
    }

    const importedModule = await componentModules[modulePath]() as ComponentModule

    // 使用できるすべてのエクスポートを確認
    console.log(`Available exports for ${componentName}:`, Object.keys(importedModule))

    // コンポーネントを探す（優先順位: componentName, default）
    let Component = importedModule[componentName]

    if (!Component) {
      console.warn(`No named export ${componentName} found, falling back to default export`)
      Component = importedModule.default
    }

    if (!Component) {
      console.error(`No suitable component export found for ${componentName}`)
      return
    }

    // data-app-props属性からpropsを取得（必要な場合）
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
