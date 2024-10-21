export type TOutputItemType = 'info' | 'group' | 'groupCollapsed' | 'trace' | 'groupEnd';
export type TOutputItemArgs = unknown[];
export type TOutputItemStatus =
    | 'default'
    | 'warning'
    | 'success'
    | 'error'
    | 'additionalSuccess'
    | 'additionalInfo';

export interface IOutputItem {
    type: TOutputItemType;
    args: TOutputItemArgs;
    status: TOutputItemStatus;
}

export interface IOutput {
    add(type: TOutputItemType, args?: TOutputItemArgs, status?: TOutputItemStatus): IOutput;

    showNew(): void;
    showAll(): void;

    clearNew(): void;
    clearAll(): void;
}
