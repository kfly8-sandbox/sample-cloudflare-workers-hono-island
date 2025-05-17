import React from 'react';

/**
 * アイランドコンポーネントを作成するためのユーティリティ関数
 *
 * @param Component 元となるReactコンポーネント
 * @param displayName アイランドコンポーネント名（省略時はComponent.nameが使用されます）
 * @returns サーバーサイドレンダリング用の$Componentを返します
 */
export function createIsland<P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
): React.FC<P> {
  // コンポーネント名を取得（displayNameが指定されていればそれを使用、なければComponentの名前）
  const componentName = displayName || Component.displayName || Component.name;

  // サーバーサイドレンダリング用の$Componentを作成
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

  // $を付けて、アイランドコンポーネントであることを明示
  IslandComponent.displayName = `$${componentName}`;

  return IslandComponent;
}
