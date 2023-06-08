/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import type { IVirtualCollectionItem } from 'Controls/baseList';
import type { TItemKey } from 'Controls/display';
import type { IColumn } from 'Controls/grid';

export interface IConfig {
    key: TItemKey;
    index: number;
    column: IColumn;
    isRenderedOutsideRange?: boolean;
}

export class VirtualCollectionItem implements IVirtualCollectionItem {
    readonly key: TItemKey;
    private readonly _column: IColumn;
    private readonly _index: number;
    private _isRenderedOutsideRange: boolean = false;

    constructor(config: IConfig) {
        this.key = config.key;
        this._column = config.column;
        this._index = config.index;
        this._isRenderedOutsideRange = !!config.isRenderedOutsideRange;
    }

    setRenderedOutsideRange(state: boolean): void {
        this._isRenderedOutsideRange = state;
    }

    isRenderedOutsideRange(): boolean {
        return this._isRenderedOutsideRange;
    }

    getGivenItemsSize(itemSizeProperty: string): number | null {
        return this._column[itemSizeProperty];
    }
}
