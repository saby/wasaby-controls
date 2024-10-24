/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TMakeRequired } from '../types/TMakeRequired';

export type TOutputItemType = 'info' | 'group' | 'groupCollapsed' | 'trace' | 'groupEnd';
export type TOutputItemArgs = unknown[];
export type TOutputItemStatus =
    | 'default'
    | 'warning'
    | 'success'
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

    renderItemImmediate(item: TMakeRequired<IOutputItem, 'type'>): void;

    renderNew(): void;
    renderAll(): void;

    clearNew(): void;
    clearAll(): void;

    destroy(): void;
}
