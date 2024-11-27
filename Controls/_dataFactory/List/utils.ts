/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TViewMode } from 'Controls-DataEnv/interface';
import type { IListState } from '../interface/IListState';

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
        viewMode === 'composite' || viewMode === 'tile' || viewMode === 'searchTile';
    return adaptiveSearchMode && needSearchTileMode ? 'searchTile' : 'search';
}

/**
 * Функция определяет, поддерживает ли текущий стейт иерархию.
 * @param state Стейт слайса
 * @return boolean
 * @remark Будет удалена вместе с Slice.isExpanded и Slice.isExpandAll
 */
export function isStateHierarchy(state: IListState): boolean {
    return (
        typeof state.keyProperty === 'string' &&
        typeof state.parentProperty === 'string' &&
        typeof state.nodeProperty === 'string'
    );
}
