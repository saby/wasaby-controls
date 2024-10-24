/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { ISelectionViewMode } from 'Controls/interface';
import type { ControllerClass as OperationsController } from 'Controls/operations';

/**
 * Интерфейс состояния для работы с ПМО.
 */
export interface IListOperationsPanelState {
    operationsController?: OperationsController;
    operationsPanelVisible?: boolean;
    selectionViewMode?: ISelectionViewMode;
}
