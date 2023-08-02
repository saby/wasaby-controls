/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import * as VirtualScroll from './VirtualScroll';
import { EnumeratorCallback } from 'Types/collection';

export interface IVirtualScrollHideItem {
    setRendered(rendered: boolean): void;
    isRendered(): boolean;
    isSticked(): boolean;
    setRenderedOutsideRange(state: boolean): void;
    isRenderedOutsideRange(): boolean;
}

export interface IVirtualScrollHideEnumerator extends VirtualScroll.IVirtualScrollEnumerator {
    getCurrent(): IVirtualScrollHideItem;
}

export interface IVirtualScrollHideCollection extends VirtualScroll.IVirtualScrollCollection {
    at(pos: number): IVirtualScrollHideItem;
    getEnumerator(): IVirtualScrollHideEnumerator;
}

export function setup(collection: IVirtualScrollHideCollection): void {
    VirtualScroll.setup(collection);
    collection.setViewIterator({
        ...collection.getViewIterator(),
        each: each.bind(null, collection),
        setIndices: setIndices.bind(null, collection),
        setNextIndices: setNextIndices.bind(null, collection),
        isItemAtIndexHidden: isItemAtIndexHidden.bind(null, collection),
    });
    collection.nextVersion();
}

export function applyRenderedItems(collection: IVirtualScrollHideCollection): void {
    const renderedStart = VirtualScroll.getStartIndex(collection);
    const renderedStop = VirtualScroll.getStopIndex(collection);
    const renderedNextStart = VirtualScroll.getNextStartIndex(collection);
    const renderedNextStop = VirtualScroll.getNextStopIndex(collection);
    for (let i = renderedStart; i < renderedStop; i++) {
        collection.at(i)?.setRendered(true);
    }
    if (renderedNextStart !== undefined || renderedNextStop !== undefined) {
        for (let i = renderedNextStart; i < renderedNextStop; i++) {
            collection.at(i)?.setRendered(true);
        }
    }
}

export function setNextIndices(
    collection: IVirtualScrollHideCollection,
    nextStartIndex: number,
    nextStopIndex: number
): void {
    VirtualScroll.setNextIndices(collection, nextStartIndex, nextStopIndex);
    applyRenderedItems(collection);
    collection.nextVersion();
}

export function setIndices(
    collection: IVirtualScrollHideCollection,
    startIndex: number,
    stopIndex: number
): boolean {
    const indicesChanged = VirtualScroll.setIndices(collection, startIndex, stopIndex);
    applyRenderedItems(collection);
    collection.nextVersion();
    return indicesChanged;
}

export function each(
    collection: IVirtualScrollHideCollection,
    callback: EnumeratorCallback<unknown>,
    context?: object
): void {
    const enumerator = collection.getEnumerator();

    enumerator.setPosition(-1);

    while (enumerator.moveNext()) {
        const item = enumerator.getCurrent();
        const index = enumerator.getCurrentIndex();
        if (item.isRendered()) {
            callback.call(context, item, index);
        }
    }
}

export function isItemAtIndexHidden(
    collection: IVirtualScrollHideCollection,
    index: number
): boolean {
    const start = VirtualScroll.getStartIndex(collection);
    const stop = VirtualScroll.getStopIndex(collection);
    const outsideRange = index < start || index >= stop;
    const current = collection.at(index);

    return (
        (outsideRange && !current.isRenderedOutsideRange()) ||
        VirtualScroll.isItemAtIndexHidden(collection, index)
    );
}
