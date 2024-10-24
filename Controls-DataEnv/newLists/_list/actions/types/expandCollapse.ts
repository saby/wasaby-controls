/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

// Экспорты для публичных типов.
/**
 * Тип действия, для разворота узла.
 */
export type TExpandAction = TAbstractListActions.expandCollapse.TExpandAction;
/**
 * Тип действия, для сворачивания узла.
 */
export type TCollapseAction = TAbstractListActions.expandCollapse.TCollapseAction;
// Экспорты для публичных типов.

/**
 * Тип действий функционала "Разворот и сворачивание узлов", доступные в WEB списке.
 * @see https://online.sbis.ru/area/4dc07e22-16bc-4793-9b70-c6819cf515fb Зона Kaizen
 */
export type TAnyExpandCollapseAction = TAbstractListActions.expandCollapse.TAnyExpandCollapseAction;
