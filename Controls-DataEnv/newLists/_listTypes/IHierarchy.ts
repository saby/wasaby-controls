/**
 * Тип сохряняемых в историю узлов
 * @variant nodes Только узлы
 * @variant groups Только группы
 * @variant all Узлы и группы
 */
export type TNodeHistoryType = 'node' | 'group' | 'all';

/**
 * Параметры конфигурации иерархии
 * */
export interface IHierarchyOptions {
    nodeProperty?: string;
    parentProperty?: string;
    nodeHistoryId?: string;
    nodeHistoryType?: TNodeHistoryType;
}
