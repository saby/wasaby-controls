/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { IBaseCollection } from '../interface';
import { IViewIterator } from '../Collection';
import { EnumeratorCallback } from 'Types/collection';
import CollectionItem from '../CollectionItem';

export interface IVirtualScrollEnumerator {
    setPosition(pos: number): void;
    moveNext(): boolean;
    getCurrentIndex(): number;
    getCurrent(): unknown;
}

export interface IVirtualScrollViewIterator extends IViewIterator {
    data: {
        startIndex: number;
        stopIndex: number;

        nextStartIndex?: number;
        nextStopIndex?: number;
    };
}

export interface IVirtualScrollCollection
    extends IBaseCollection<unknown, any> {
    setViewIterator(viewIterator: IVirtualScrollViewIterator): void;
    getViewIterator(): IVirtualScrollViewIterator;
    getCount(): number;
    getEnumerator(): IVirtualScrollEnumerator;
}

export function setup(collection: IVirtualScrollCollection): void {
    collection.setViewIterator({
        each: each.bind(null, collection),
        setIndices: setIndices.bind(null, collection),
        setNextIndices: setNextIndices.bind(null, collection),
        isItemAtIndexHidden: isItemAtIndexHidden.bind(null, collection),
        data: {
            startIndex: 0,
            stopIndex: collection.getCount(),
        },
    });
}
export function isItemAtIndexHidden(
    collection: IVirtualScrollCollection,
    index: number
): boolean {
    const start = getStartIndex(collection);
    const stop = getStopIndex(collection);

    const nextStart = getNextStartIndex(collection);
    const nextStop = getNextStopIndex(collection);

    if (nextStart === undefined || nextStop === undefined) {
        return false;
    }

    return (
        (index < start || index >= stop) &&
        (index >= nextStart || index < nextStop)
    );
}
export function setNextIndices(
    collection: IVirtualScrollCollection,
    nextStartIndex: number,
    nextStopIndex: number
): void {
    const currentViewIterator = collection.getViewIterator();
    if (
        currentViewIterator.data &&
        (currentViewIterator.data.nextStartIndex !== nextStartIndex ||
            currentViewIterator.data.nextStopIndex !== nextStopIndex)
    ) {
        const viewIterator = {
            ...collection.getViewIterator(),
            data: {
                ...currentViewIterator.data,
                nextStartIndex,
                nextStopIndex,
            },
        };
        collection.setViewIterator(viewIterator);
        collection.nextVersion();
    }
}
export function setIndices(
    collection: IVirtualScrollCollection,
    startIndex: number,
    stopIndex: number
): boolean {
    const currentViewIterator = collection.getViewIterator();
    if (
        currentViewIterator.data &&
        (currentViewIterator.data.startIndex !== startIndex ||
            currentViewIterator.data.stopIndex !== stopIndex)
    ) {
        const viewIterator = {
            ...collection.getViewIterator(),
            data: {
                startIndex,
                stopIndex,
            },
        };
        collection.setViewIterator(viewIterator);
        collection.nextVersion();
    }
    return true;
}

export function each(
    collection: IVirtualScrollCollection,
    callback: EnumeratorCallback<unknown>,
    context?: object
): void {
    const startIndex = getStartIndex(collection);
    const stopIndex = getStopIndex(collection);
    const enumerator = collection.getEnumerator();

    enumerator.setPosition(-1);
    while (enumerator.moveNext()) {
        const current = enumerator.getCurrent() as CollectionItem;
        const currentIndex = enumerator.getCurrentIndex();
        const insideRange =
            currentIndex >= startIndex && currentIndex < stopIndex;
        const isRenderBeforeRange =
            currentIndex < startIndex && current?.isRenderedOutsideRange();
        const isRenderAfterRange =
            currentIndex >= stopIndex && current?.isRenderedOutsideRange();

        if (insideRange || isRenderBeforeRange || isRenderAfterRange) {
            callback.call(context, current, currentIndex);
        }
    }
}

export function getStartIndex(collection: IVirtualScrollCollection): number {
    return collection.getViewIterator()?.data?.startIndex ?? 0;
}

export function getStopIndex(collection: IVirtualScrollCollection): number {
    return (
        collection.getViewIterator()?.data?.stopIndex ?? collection.getCount()
    );
}

export function getNextStartIndex(
    collection: IVirtualScrollCollection
): number {
    return collection.getViewIterator()?.data?.nextStartIndex;
}

export function getNextStopIndex(collection: IVirtualScrollCollection): number {
    return collection.getViewIterator()?.data?.nextStopIndex;
}
