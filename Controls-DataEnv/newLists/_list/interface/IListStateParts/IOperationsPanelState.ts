import type { TSelectionViewMode } from 'Controls-DataEnv/listTypes';
import type { IAbstractListStateParts } from 'Controls-DataEnv/abstractList';

/**
 * Интерфейс состояния для работы с ПМО в WEB списке.
 */
export interface IOperationsPanelState extends IAbstractListStateParts.IOperationsPanelState {
    /**
     * Определяет набор дополнительных пунктов в меню отметки ПМО.
     * @remark
     * По умолчанию в меню отметки ПМО отображается 3 пункта:
     * - Отметить всё
     * - Снять
     * - Инвертировать
     * @default hidden
     */
    selectionViewMode?: TSelectionViewMode;

    /**
     * Флаг, определяющий происходит ли в данный момент процесс загрузки счетчика
     */
    countLoading: boolean;

    /**
     *
     */
    isMassSelectMode?: boolean;
}
