import { TViewMode } from 'Controls-DataEnv/interface';

type TSearchViewMode = 'search' | 'searchTile';

/**
 * Функция вычисляет необходимый к установке режим поиска в зависимости от текущего режима отображения.
 * @param adaptiveSearchMode Режим адаптивного поиска, позволяет отображать результаты поиска в виде "searchTile"
 * при переходе в поиск из режимов "tile" или "composite".
 * @param viewMode Режим отображения, из которого осуществляется переход в поиск.
 */
export function resolveSearchViewMode(
    adaptiveSearchMode: boolean,
    viewMode: TViewMode
): TSearchViewMode {
    const needSearchTileMode =
        viewMode === 'composite' ||
        viewMode === 'tile' ||
        viewMode === 'searchTile';
    return adaptiveSearchMode && needSearchTileMode ? 'searchTile' : 'search';
}
