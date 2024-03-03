/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import type { IViewIterator, TItemKey } from 'Controls/display';
import type { IDirection } from '../ScrollController';

export interface IVirtualCollection<T extends IVirtualCollectionItem = IVirtualCollectionItem> {
    setViewIterator(iterator: IViewIterator): void;
    resetViewIterator(): void;

    nextVersion(): void;

    setIndexes(startIndex: number, endIndex: number, shiftDirection: IDirection): void;
    setNextIndexes(startIndex: number, endIndex: number, shiftDirection: IDirection): void;
    getStartIndex(): number;
    getStopIndex(): number;
    getCount(): number;
    getIndexByKey(key: TItemKey): number;
    at(index: number): IVirtualCollectionItem;

    getItems(): IVirtualCollectionItem[];
    each(callback: (item: IVirtualCollectionItem, index: number) => void): void;

    isDestroyed(): boolean;
}

export interface IVirtualCollectionItem {
    key: TItemKey;
    getGivenItemsSize(property: string): number;
    isRenderedOutsideRange(): boolean;
}
