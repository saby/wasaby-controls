import type { IAbstractListStateParts } from 'Controls-DataEnv/abstractList';
import { TSelectionType } from 'Controls-DataEnv/listTypes';

/**
 * Интерфейс состояния для работы с выбором в WEB списке.
 */
export interface ISelectionState extends IAbstractListStateParts.ISelectionState {
    /**
     * Определяет, будут ли выбираться дочерние элементы при выборе папки.
     */
    recursiveSelection?: boolean;

    /**
     * Тип записей, которые можно выбрать.
     * @default all
     * @variant node Только узлы доступны для выбора.
     * @variant leaf Только листья доступны для выбора.
     * @variant all Все типы записей доступны для выбора.
     */
    selectionType?: TSelectionType;

    /**
     * Определяет, будут ли отмечаться родительские узлы при {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ отметке дочернего узла чекбоксом}.
     * @default true
     * @remark
     * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
     * @see selectDescendants
     */
    selectAncestors: boolean;

    /**
     * Определяет, будут ли отмечаться дочерние элементы при {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ отметке узла чекбоксом}.
     * @default true
     * @remark
     * Что такое "узел" читайте в {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy руководстве разработчика}.
     * @see selectAncestors
     */
    selectDescendants: boolean;
}
