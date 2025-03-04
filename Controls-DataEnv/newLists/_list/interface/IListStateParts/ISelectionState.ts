import type { IAbstractListStateParts } from 'Controls-DataEnv/abstractList';
import { TSelectionType } from 'Controls-DataEnv/listTypes';

/**
 * Интерфейс состояния для работы с выбором в WEB списке.
 */
export interface ISelectionState extends IAbstractListStateParts.ISelectionState {
    recursiveSelection?: boolean;
    /**
     * Тип записей, которые можно выбрать.
     * @default all
     * @variant node Только узлы доступны для выбора.
     * @variant leaf Только листья доступны для выбора.
     * @variant all Все типы записей доступны для выбора.
     */
    selectionType?: TSelectionType;
    selectAncestors?: boolean;
    selectDescendants?: boolean;
}
