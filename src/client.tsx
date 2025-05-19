import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import React from 'react'

import { requestIdleCallback } from './polyfill'

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

  // 優先度の高いアイランド（表示されているもの）と低いアイランド（表示されていないもの）に分ける
  const prioritizeHydration = (islands: Element[]) => {
    // IntersectionObserverを使って表示されているかどうかを判断する
    return new Promise<{visible: Element[], hidden: Element[]}>(resolve => {
      const visible: Element[] = [];
      const hidden: Element[] = [];
      let pendingCount = islands.length;

      // 全て処理した場合またはタイムアウトした場合に結果を返す
      const finishCheck = () => {
        pendingCount--;
        if (pendingCount <= 0) {
          resolve({ visible, hidden });
        }
      };

      // タイムアウト（長くても100ms程度で判定を終える）
      const timeout = setTimeout(() => {
        for (let i = pendingCount; i > 0; i--) {
          finishCheck();
        }
      }, 100);

      // 各アイランドについて表示されているかどうかを判断
      islands.forEach(island => {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              visible.push(island);
            } else {
              hidden.push(island);
            }
            observer.disconnect();
            finishCheck();
          });
        }, { rootMargin: '200px' }); // 画面の上下200pxの範囲も「表示されている」と判断

        observer.observe(island);
      });
    });
  };

  // 表示されているアイランドと非表示のアイランドに分ける
  const { visible, hidden } = await prioritizeHydration(islandsToHydrate);

  console.log(`Visible islands: ${visible.length}, Hidden islands: ${hidden.length}`);

  // バッチ処理用のヘルパー関数
  const processBatchWithIdleCallback = (islands: Element[], priority: 'high' | 'low') => {
    let index = 0;
    const highPriority = priority === 'high';
    const options = highPriority ? { timeout: 500 } : undefined; // 高優先度の場合はタイムアウト設定を短くする

    const processNextBatch = (deadline: IdleDeadline) => {
      // 一度に処理するバッチサイズ（高優先度の場合は多め、低優先度の場合は少なめ）
      const batchSize = highPriority ? 3 : 1;
      let processedInThisBatch = 0;

      // アイドル時間がある限り、指定のバッチサイズまたはアイドル時間が尽きるまで処理する
      while (index < islands.length &&
            (highPriority || deadline.timeRemaining() > 0) &&
            processedInThisBatch < batchSize) {
        const island = islands[index];
        const componentName = island.getAttribute('data-app-component')!;

        // 非同期処理のため、即座に次のアイランドに移る
        hydrateIsland(island, componentName).then(() => {
          island.setAttribute('data-app-hydrated', 'true');
        });

        index++;
        processedInThisBatch++;
      }

      // まだ処理すべきアイランドが残っている場合は、次のアイドル時間に処理を予約
      if (index < islands.length) {
        requestIdleCallback(processNextBatch, options);
      } else {
        console.log(`Completed hydration of all ${islands.length} ${priority} priority islands`);
      }
    };

    // アイドル時間に処理を開始
    requestIdleCallback(processNextBatch, options);
  };

  // 表示されているアイランドを高優先度でバッチ処理
  if (visible.length > 0) {
    processBatchWithIdleCallback(visible, 'high');
  }

  // 表示されていないアイランドを低優先度でバッチ処理
  if (hidden.length > 0) {
    processBatchWithIdleCallback(hidden, 'low');
  }

  console.log(`Immediately hydrated ${visible.length} visible islands, queued ${hidden.length} hidden islands for later hydration`);
}

async function hydrateIsland(element: Element, componentName: string) {
  try {
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
  } catch (error) {
    console.error(`Failed to hydrate ${componentName} island:`, error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  hydrateAllIslands().catch(err => {
    console.error('Failed to hydrate islands:', err)
  })
})
