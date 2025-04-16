import { TMakeRequired } from '../types/TMakeRequired';

export type TOutputItemType = 'info' | 'group' | 'groupCollapsed' | 'trace' | 'groupEnd';
export type TOutputItemArgs = unknown[];
export type TOutputItemStatus =
    | 'default'
    | 'warning'
    | 'warning1'
    | 'warning2'
    | 'warning3'
    | 'attention1'
    | 'attention2'
    | 'attention3'
    | 'success'
    | 'errorBig'
    | 'error'
    | 'error1'
    | 'error2'
    | 'error3'
    | 'additionalSuccess'
    | 'subfocusInfo'
    | 'additionalInfo';

export type TOutputStyle = 'long' | 'short';

export interface IMeta {
    senderName?: string;
}

export interface IOutputConfig {
    style: TOutputStyle;
}

/**
 * Интерфейс элемента содержащего вывод дебаггера
 * */
export interface IOutputItem {
    type: TOutputItemType;
    args: TOutputItemArgs;
    status: TOutputItemStatus;
    meta?: IMeta;
}

/**
 * Интерфейс вывода дебаггера
 */
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
