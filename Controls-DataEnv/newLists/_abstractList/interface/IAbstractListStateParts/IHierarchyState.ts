import type { CrudEntityKey } from 'Types/source';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Модель раскрытых узлов.
 */
export type TExpansionModel = Map<CrudEntityKey, boolean>;

/**
 * Интерфейс состояния для работы с деревом.
 */
export interface IHierarchyState {
    parentProperty?: string;
    nodeProperty?: string;
    declaredChildrenProperty?: string;

    // Иерархия пока объединена, всё в одном, т.к. не надо.
    // TODO: Вынести в IRoot.
    /**
     * Идентификатор корневого узла. Значение опции root добавляется в фильтре в поле {@link Controls/interface:IHierarchy#parentProperty parentProperty}.
     * */
    root: TKey;

    // TODO: Вынести в IExpandCollapse.
    /**
     * Идентификаторы развернутых узлов в {@link Controls/tree:View дереве}.
     * @remark
     * Чтобы развернуть все элементы списка, параметр expandedItems должен быть задан как массив, содержащий один элемент — "null". В этом случае предполагается, что все данные будут загружены сразу.
     * Настройка не работает, если источник данных задан через {@link Types/source:Memory}.
     */
    expandedItems: TKey[];
    collapsedItems: TKey[];
    expansionModel: TExpansionModel;
    /**
     * Режим единого развернутого узла.
     * @remark
     * В дереве можно задать такое поведение, при котором единовременно может быть развернут только один узел в рамках одного уровня иерархии. При развертывании нового узла предыдущий будет автоматически сворачиваться.
     * @default false
     * @variant true
     * @variant false
     */
    singleExpand: boolean;
}
