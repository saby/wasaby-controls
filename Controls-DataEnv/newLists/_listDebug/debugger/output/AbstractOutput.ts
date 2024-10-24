/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TMakeRequired } from '../types/TMakeRequired';
import {
    IOutput,
    IOutputItem,
    TOutputItemType,
    TOutputItemArgs,
    TOutputItemStatus,
    IOutputConfig,
    IMeta,
} from './IOutput';

export abstract class AbstractOutput implements IOutput {
    protected _config: IOutputConfig = {
        style: 'All',
    };

    private __items: IOutputItem[] = [];
    private __new: number[] = [];

    protected get _allItems(): IOutputItem[] {
        return this.__items;
    }

    protected get _newItems(): IOutputItem[] {
        return this.__new.map((i) => this.__items[i]);
    }

    setConfig(config: IOutputConfig) {
        this._config = config;
    }

    getConfig(): IOutputConfig {
        return {
            ...this._config,
        };
    }

    add(
        type: TOutputItemType,
        args?: TOutputItemArgs,
        status?: TOutputItemStatus,
        meta?: IMeta
    ): IOutput;
    add(item: TMakeRequired<IOutputItem, 'type'>): IOutput;
    add(
        typeOrItem: TOutputItemType | TMakeRequired<IOutputItem, 'type'>,
        args?: TOutputItemArgs,
        status?: TOutputItemStatus,
        meta?: IMeta
    ): IOutput {
        const newItem: IOutputItem =
            typeof typeOrItem === 'object'
                ? {
                      type: typeOrItem.type,
                      args: typeOrItem.args || [],
                      status: typeOrItem.status || 'default',
                      meta: typeOrItem.meta,
                  }
                : {
                      type: typeOrItem,
                      args: args || [],
                      status: status || 'default',
                      meta,
                  };

        this.__new.push(this.__items.push(newItem) - 1);

        return this;
    }

    clearAll(): void {
        this.__items = [];
        this.__new = [];
    }

    clearNew(): void {
        this.__new = [];
    }

    destroy(): void {
        this.clearAll();
    }

    abstract renderItemImmediate(item: TMakeRequired<IOutputItem, 'type'>): void;

    abstract renderAll(): void;

    abstract renderNew(): void;
}
