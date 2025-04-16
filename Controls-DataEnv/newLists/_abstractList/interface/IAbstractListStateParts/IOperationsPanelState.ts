import type { ControllerClass as OperationsController } from 'Controls/operations';
import type { ISelection } from 'Controls-DataEnv/interface';

/**
 * Режим отображения выбора в пмо.
 * */
export type TSelectionViewMode = 'all' | 'selected' | 'partial' | 'hidden';

/**
 * Интерфейс состояния для работы с ПМО в списке с любым типом интерактора(web/mobile).
 */
export interface IOperationsPanelState {
    /**
     * Не для прикладного использования.
     * --
     * Контроллер панели массовых операций.
     */
    operationsController?: OperationsController;
    /**
     * Флаг, определяющий открыта ли в данный момент панель массовых операций.
     */
    operationsPanelVisible: boolean;
    /**
     * Значение счетчика выбранных записей в пмо.
     */
    count: number | null;
    /**
     * Выделенные элементы для работы в пмо.
     */
    listCommandsSelection?: ISelection;
    /**
     * Режим отображения выбора в пмо.
     */
    selectionViewMode?: TSelectionViewMode;
    /**
     * Флаг, определяющий выбранны ли все записи в списке
     */
    isAllSelected: boolean;
}
