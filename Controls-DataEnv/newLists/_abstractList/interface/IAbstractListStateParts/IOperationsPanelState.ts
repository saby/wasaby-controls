import type { ControllerClass as OperationsController } from 'Controls/operations';

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
}
