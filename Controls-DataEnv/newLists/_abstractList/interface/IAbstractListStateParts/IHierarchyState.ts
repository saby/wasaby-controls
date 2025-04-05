import type { CrudEntityKey } from 'Types/source';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Тип модели раскрытых узлов.
 */
export type TExpansionModel = Map<CrudEntityKey, boolean>;

/**
 * Интерфейс состояния для работы с деревом.
 */
export interface IHierarchyState {
    /**
     * Имя поля записи, в котором хранится идентификатор родительского узла элемента
     */
    parentProperty?: string;

    /**
     * Имя поля записи, в котором хранится информация о типе элемента (лист, узел, скрытый узел)
     */
    nodeProperty?: string;

    /**
     *
     */
    declaredChildrenProperty?: string;

    /**
     * Имя поля записи, в котором хранится информация о наличии дочерних злементов у узла
     */
    hasChildrenProperty?: string;

    /**
     * Идентификатор {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/navigation/root/ корня иерархии}.
     * Значение опции root добавляется в фильтре в поле {@link Controls/interface:IHierarchy#parentProperty parentProperty}.
     */
    root: TKey;

    /**
     * Идентификаторы развернутых узлов в дереве
     * @remark
     * Чтобы развернуть все элементы списка, параметр expandedItems должен быть задан как массив, содержащий один элемент — "null". В этом случае предполагается, что все данные будут загружены сразу.
     * Настройка не работает, если источник данных задан через {@link Types/source:Memory}.
     */
    expandedItems: TKey[];

    /**
     * Идентификаторы свернутых узлов в дереве
     * @remark
     * Этот параметр используется, когда {@link expandedItems} установлена в значение [null].
     * @see expandedItems
     */
    collapsedItems: TKey[];

    /**
     * Модель раскрытых узлов
     */
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

    /**
     * Имя свойства узла дерева, которое определяет, что при поиске этот узел должен быть показан отдельной хлебной крошкой.
     */
    dedicatedItemProperty?: string;
}
