import type { ControllerClass as OperationsController } from 'Controls/operations';

export interface IOperationsPanelState {
    operationsPanelVisible: boolean;
    operationsController?: OperationsController;
}

export function copyOperationsPanelState({
    operationsPanelVisible,
    operationsController,
}: IOperationsPanelState): IOperationsPanelState {
    return {
        operationsController,
        operationsPanelVisible,
    };
}
