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

const MAX_ITEMS_COUNT = 8000;

export abstract class AbstractOutput implements IOutput {
    protected _config: IOutputConfig = {
        style: 'All',
    };

    private __items: IOutputItem[] = [];
    private __new: number[] = [];

    private get _allItems(): IOutputItem[] {
        return this.__items;
    }

    private get _newItems(): IOutputItem[] {
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
        if (this.__items.length > MAX_ITEMS_COUNT) {
            this.clearOld();
        }
        const newItem: IOutputItem =
            typeof typeOrItem === 'object'
                ? {
                      type: typeOrItem.type,
                      args: typeOrItem.args || [],
                      status: typeOrItem.status || 'default',
                      argsResolver: typeOrItem.argsResolver,
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

    getAll(): IOutputItem[] {
        return this._allItems;
    }

    getNew(): IOutputItem[] {
        return this._newItems;
    }

    renderAll(): void {
        this.__renderItems(this._allItems);
    }

    renderNew(): void {
        this.__renderItems(this._newItems);
    }

    clearAll(): void {
        this.__items = [];
        this.__new = [];
    }

    clearNew(): void {
        this.__new = [];
    }

    clearOld(): void {
        const newItems = [...this.getNew()];
        this.clearAll();
        newItems.forEach((newItem) => {
            this.__new.push(this.__items.push(newItem) - 1);
        });
    }

    destroy(): void {
        this.clearAll();
    }

    private __renderItems(items: IOutputItem[]): void {
        this._renderItems(
            items.map((i) => ({
                ...i,
                args: i.argsResolver ? i.argsResolver(i.args) || i.args : i.args,
            }))
        );
    }

    protected abstract _renderItems(items: IOutputItem[]): void;

    abstract renderItemImmediate(item: TMakeRequired<IOutputItem, 'type'>): IOutput;
}
