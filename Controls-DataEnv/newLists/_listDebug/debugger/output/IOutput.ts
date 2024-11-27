import { TMakeRequired } from '../types/TMakeRequired';

export type TOutputItemType = 'info' | 'group' | 'groupCollapsed' | 'trace' | 'groupEnd';
export type TOutputItemArgs = unknown[];
export type TOutputItemStatus =
    | 'default'
    | 'warning'
    | 'success'
    | 'errorBig'
    | 'error'
    | 'additionalSuccess'
    | 'additionalInfo';

export type TOutputStyle = 'All' | 'AllShort' | 'Significant' | 'SignificantShort';

export interface IMeta {
    senderName?: string;
}

export interface IOutputConfig {
    style: TOutputStyle;
}

export interface IOutputItem {
    type: TOutputItemType;
    args: TOutputItemArgs;
    argsResolver?: (args: TOutputItemArgs) => TOutputItemArgs;
    status: TOutputItemStatus;
    meta?: IMeta;
}

export interface IOutput {
    setConfig(config: IOutputConfig): void;
    getConfig(): IOutputConfig;

    add(
        type: TOutputItemType,
        args?: TOutputItemArgs,
        status?: TOutputItemStatus,
        meta?: IMeta
    ): IOutput;
    add(item: TMakeRequired<IOutputItem, 'type'>): IOutput;

    renderItemImmediate(item: TMakeRequired<IOutputItem, 'type'>): IOutput;

    renderNew(): void;
    renderAll(): void;

    getNew(): IOutputItem[];
    getAll(): IOutputItem[];

    clearNew(): void;
    clearAll(): void;

    destroy(): void;
}
