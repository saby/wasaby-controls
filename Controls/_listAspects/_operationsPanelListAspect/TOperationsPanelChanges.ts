import { TVisibility } from './common/types';

export const OperationsPanelVisibilityChangeName = 'OPERATIONS_PANEL_VISIBILITY_CHANGE';
export type TOperationsPanelVisibilityChangeName = typeof OperationsPanelVisibilityChangeName;

/* Изменить видимость ПМО */
export interface IOperationsPanelVisibilityChange {
    name: TOperationsPanelVisibilityChangeName;
    args: {
        visibility: TVisibility;
    };
}

export type TOperationsPanelChanges = IOperationsPanelVisibilityChange;
