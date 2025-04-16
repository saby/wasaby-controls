import type { ControllerClass as OperationsController } from 'Controls/operations';
import type { ISelection } from 'Controls-DataEnv/interface';

/**
 * Режим отображения выбора в панели массовых операций(ПМО).
 * */
export type TSelectionViewMode = 'all' | 'selected' | 'partial' | 'hidden';

/**
 * Интерфейс состояния для работы с панелью массовых операций(ПМО) в списке с любым типом интерактора(web/mobile).
 */
export interface IOperationsPanelState {
    /**
     * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
     * -
     * Состояние исключительно для внутреннего использования и может быть удалено/изменено в любое время.
     * Никакой поддержки и обратной совместимости не запланировано.
     * @private
     */
    operationsController?: OperationsController;

    /**
     * Флаг, определяющий открыта ли в данный момент панель массовых операций
     */
    operationsPanelVisible: boolean;

    /**
     * Значение счетчика выбранных записей в ПМО
     */
    count: number | null;

    /**
     * Выделенные элементы для работы в ПМО
     */
    listCommandsSelection?: ISelection;

    /**
     * Режим отображения выбора в ПМО
     */
    selectionViewMode?: TSelectionViewMode;

    /**
     * Флаг, определяющий выбранны ли все записи в списке
     */
    isAllSelected: boolean;
}
