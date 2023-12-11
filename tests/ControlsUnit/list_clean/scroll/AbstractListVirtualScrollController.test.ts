import jsdom = require('jsdom');

const { JSDOM } = jsdom;

import {
    getCollection,
    getListControl,
    getScrollContainerWithList,
    ItemClass,
    ItemsContainerUniqueClass,
    ListContainerUniqueClass,
    renderCollectionChanges,
    TriggerClass,
} from './DomUtils';
import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { TestVirtualScrollController } from 'ControlsUnit/list_clean/scroll/TestUtils';
import { Logger } from 'UI/Utils';
import { IListVirtualScrollControllerOptions } from 'Controls/_baseList/Controllers/ScrollController/ListVirtualScrollController';
import { detection } from 'Env/Env';
import { SCROLL_POSITION } from 'Controls/_scroll/Utils/Scroll';

describe('Controls/_baseList/Controllers/AbstractListVirtualScrollController', () => {
    let collection: Collection;
    let controller: TestVirtualScrollController;
    let controllerParams: IListVirtualScrollControllerOptions;
    let listContainer: HTMLElement;
    let itemsContainer: HTMLElement;

    let setIteratorSpy;
    let scrollToElementUtilSpy;
    let doScrollUtilSpy;
    let updatePlaceholdersUtilSpy;
    let updateShadowsUtilSpy;
    let updateVirtualNavigationUtilSpy;
    let activeElementChangedCallbackSpy;
    let hasItemsOutRangeChangedCallbackSpy;
    let itemsEndedCallbackSpy;

    let oldWindow;
    let stubLoggerError;

    const resetHistoryCallbacks: Function = () => {
        setIteratorSpy?.mockClear();
        scrollToElementUtilSpy?.mockClear();
        doScrollUtilSpy?.mockClear();
        updatePlaceholdersUtilSpy?.mockClear();
        updateShadowsUtilSpy?.mockClear();
        updateVirtualNavigationUtilSpy?.mockClear();
        activeElementChangedCallbackSpy?.mockClear();
        hasItemsOutRangeChangedCallbackSpy?.mockClear();
        itemsEndedCallbackSpy?.mockClear();
    };

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        detection.isMobileIOS = false;
    });

    before(() => {
        oldWindow = window;
        window = new JSDOM('').window;
        window.requestAnimationFrame = (callback: Function) => {
            return callback();
        };
        global.getComputedStyle = window.getComputedStyle;
        Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
            get() {
                return this.parentNode;
            },
            set() {
                /* NEED */
            },
        });
    });

    after(() => {
        window = oldWindow;
    });

    function checkCallOrder(expectedCallOrder: unknown[]) {
        for (let i = 0; i < expectedCallOrder.length - 1; i++) {
            expect(expectedCallOrder[i].mock.invocationCallOrder[0]).toBeLessThan(
                expectedCallOrder[i + 1].mock.invocationCallOrder[0]
            );
        }
    }

    beforeEach(() => {
        stubLoggerError = jest.spyOn(Logger, 'error').mockClear().mockImplementation();

        collection = getCollection([
            { key: 1, height: 50 },
            { key: 2, height: 50 },
            { key: 3, height: 50 },
            { key: 4, height: 50 },
            { key: 5, height: 50 },
            { key: 6, height: 50 },
            { key: 7, height: 50 },
            { key: 8, height: 50 },
            { key: 9, height: 50 },
            { key: 10, height: 50 },
        ]);
        setIteratorSpy = jest.spyOn(collection, 'setViewIterator').mockClear();

        scrollToElementUtilSpy = jest.fn(() => {
            return null;
        });
        doScrollUtilSpy = jest.fn(() => {
            return null;
        });
        updatePlaceholdersUtilSpy = jest.fn(() => {
            return null;
        });
        updateShadowsUtilSpy = jest.fn(() => {
            return null;
        });
        updateVirtualNavigationUtilSpy = jest.fn(() => {
            return null;
        });
        activeElementChangedCallbackSpy = jest.fn(() => {
            return null;
        });
        hasItemsOutRangeChangedCallbackSpy = jest.fn(() => {
            return null;
        });
        itemsEndedCallbackSpy = jest.fn(() => {
            return null;
        });

        controllerParams = {
            itemsContainer: null,
            listContainer: null,
            listControl: getListControl(),
            collection,
            itemsContainerUniqueSelector: `.${ItemsContainerUniqueClass}`,
            itemsQuerySelector: `.${ItemClass}`,
            triggersQuerySelector: `.${TriggerClass}`,
            triggersPositions: { backward: 'offset', forward: 'offset' },
            triggersVisibility: { backward: true, forward: true },
            triggersOffsetCoefficients: { backward: 0, forward: 0 },
            additionalTriggersOffsets: { backward: 0, forward: 0 },
            virtualScrollConfig: {
                pageSize: 5,
            },
            activeElementKey: null,
            scrollToElementUtil: scrollToElementUtilSpy,
            doScrollUtil: doScrollUtilSpy,
            updatePlaceholdersUtil: updatePlaceholdersUtilSpy,
            updateShadowsUtil: updateShadowsUtilSpy,
            updateVirtualNavigationUtil: updateVirtualNavigationUtilSpy,
            activeElementChangedCallback: activeElementChangedCallbackSpy,
            hasItemsOutRangeChangedCallback: hasItemsOutRangeChangedCallbackSpy,
            itemsEndedCallback: itemsEndedCallbackSpy,
            feature1183225611: false,
            isReact: false,
            disableVirtualScroll: false,
            initialScrollPosition: null,
            multiColumns: false,
            viewportSize: 0,
            contentSize: 0,
            scrollPosition: 0,
        };
        controller = new TestVirtualScrollController(controllerParams);

        const scrollContainer = getScrollContainerWithList(collection);
        listContainer = scrollContainer.querySelector(
            `.${ListContainerUniqueClass}`
        ) as HTMLElement;
        itemsContainer = scrollContainer.querySelector(
            `.${ItemsContainerUniqueClass}`
        ) as HTMLElement;
        controller.setListContainer(listContainer);
        controller.setItemsContainer(itemsContainer);
    });

    describe('constructor', () => {
        it('should set iterator to collection', () => {
            expect(setIteratorSpy).toHaveBeenCalled();
        });

        it('should set indexes', () => {
            expect(controller.getIndexes()).toEqual({
                startIndex: 0,
                endIndex: 5,
            });
        });
    });

    describe('endBeforeMountListControl', () => {
        it('should schedule setIndexes if has changes between beforeMount and afterMount', () => {
            controller.endBeforeMountListControl();
            controller.addItems(0, 2, 'unfixed', 'extend');

            // проверяем что новые индексы не проставились сразу же. Это значит что их применение было запланировано
            expect(controller.getIndexes()).toEqual({
                startIndex: 0,
                endIndex: 5,
            });
        });
    });

    describe('afterMountListControl', () => {
        it('should call callbacks for initialize', () => {
            controller.afterMountListControl();

            expect(updatePlaceholdersUtilSpy).toHaveBeenCalledWith({
                backward: 0,
                forward: 0,
            });
            expect(hasItemsOutRangeChangedCallbackSpy).toHaveBeenCalledWith({
                backward: false,
                forward: true,
            });
            expect(updateVirtualNavigationUtilSpy).toHaveBeenCalledWith({
                backward: false,
                forward: true,
            });
            expect(updateShadowsUtilSpy).toHaveBeenCalledWith({
                backward: false,
                forward: true,
            });
            const expectedCallOrder = [
                updatePlaceholdersUtilSpy,
                hasItemsOutRangeChangedCallbackSpy,
                updateVirtualNavigationUtilSpy,
                updateShadowsUtilSpy,
            ];
            checkCallOrder(expectedCallOrder);
            expect(scrollToElementUtilSpy).not.toHaveBeenCalled();
            expect(doScrollUtilSpy).not.toHaveBeenCalled();
            expect(activeElementChangedCallbackSpy).not.toHaveBeenCalled();
            expect(itemsEndedCallbackSpy).not.toHaveBeenCalled();
        });

        it('should scroll to active element', () => {
            const controller = new TestVirtualScrollController({
                ...controllerParams,
                activeElementKey: 3,
                itemsContainer,
            });

            controller.afterMountListControl();

            const activeElement = itemsContainer.querySelector('div[item-key="3"]');
            expect(scrollToElementUtilSpy).toHaveBeenCalledWith(activeElement, 'top', true);
            expect(doScrollUtilSpy).not.toHaveBeenCalled();
        });

        it('should not scroll to active element at the beginning when not scrolled', () => {
            const controller = new TestVirtualScrollController({
                ...controllerParams,
                activeElementKey: 1,
                itemsContainer,
            });
            controller.afterMountListControl();

            expect(scrollToElementUtilSpy).not.toHaveBeenCalled();
        });

        it('should not scroll to top on mount', () => {
            controller.afterMountListControl();

            expect(doScrollUtilSpy).not.toHaveBeenCalled();
        });

        it('should call update shadows util if disable virtual scroll', () => {
            const controller = new TestVirtualScrollController({
                ...controllerParams,
                disableVirtualScroll: true,
                itemsContainer,
            });

            controller.afterMountListControl();

            expect(updateShadowsUtilSpy).toHaveBeenCalledWith({
                backward: false,
                forward: false,
            });
        });
    });

    describe('endBeforeUpdateListControl', () => {
        it('should schedule setIndexes if has changes between beforeUpdate and afterRender', () => {
            controller.endBeforeUpdateListControl();
            controller.addItems(0, 2, 'unfixed', 'extend');

            // проверяем что новые индексы не проставились сразу же. Это значит что их применение было запланировано
            expect(controller.getIndexes()).toEqual({
                startIndex: 0,
                endIndex: 5,
            });
        });
    });

    describe('afterRenderListControl', () => {
        it('should set indexes if schedule it on mount', () => {
            controller.endBeforeMountListControl();
            controller.addItems(0, 2, 'unfixed', 'extend');
            controller.afterMountListControl();
            controller.beforeRenderListControl();

            controller.afterRenderListControl();

            expect(controller.getIndexes()).toEqual({
                startIndex: 0,
                endIndex: 7,
            });
            expect(controller.getShiftDirection()).toEqual('backward');
        });

        it('should set indexes if schedule it on update', () => {
            controller.endBeforeUpdateListControl();
            controller.addItems(0, 2, 'unfixed', 'extend');
            controller.afterMountListControl();
            controller.beforeRenderListControl();

            controller.afterRenderListControl();

            expect(controller.getIndexes()).toEqual({
                startIndex: 0,
                endIndex: 7,
            });
            expect(controller.getShiftDirection()).toEqual('backward');
        });

        it('should not log error from updateItemsSizes (imitate react)', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(0);
            controller.contentResized(250);
            controller.viewportResized(100);
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);
            controller.addItems(0, 5, 'fixed', 'shift');
            collection.at(0).setMarked(true);
            controller.beforeRenderListControl();
            collection.at(0).setRenderedOutsideRange(true);
            renderCollectionChanges(itemsContainer, collection);

            controller.afterRenderListControl();

            expect(stubLoggerError).not.toHaveBeenCalled();
        });

        it('should not log error on contentResized from updateItemsSizes', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(0);
            controller.contentResized(250);
            controller.viewportResized(100);
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);
            controller.addItems(0, 5, 'fixed', 'shift');
            collection.at(0).setMarked(true);
            controller.beforeRenderListControl();
            collection.at(0).setRenderedOutsideRange(true);
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            collection.at(0).setMarked(false);
            controller.beforeRenderListControl();
            collection.at(0).setRenderedOutsideRange(false);
            renderCollectionChanges(itemsContainer, collection);
            controller.contentResized(260);
            controller.afterRenderListControl();

            expect(stubLoggerError).not.toHaveBeenCalled();
        });

        it('should not log error on viewportResized from updateItemsSizes', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(0);
            controller.contentResized(250);
            controller.viewportResized(100);
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);
            controller.addItems(0, 5, 'fixed', 'shift');
            collection.at(0).setMarked(true);
            controller.beforeRenderListControl();
            collection.at(0).setRenderedOutsideRange(true);
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            collection.at(0).setMarked(false);
            controller.beforeRenderListControl();
            collection.at(0).setRenderedOutsideRange(false);
            renderCollectionChanges(itemsContainer, collection);
            controller.viewportResized(110);
            controller.afterRenderListControl();

            expect(stubLoggerError).not.toHaveBeenCalled();
        });

        it('should not log error on scrollResized from updateItemsSizes', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(0);
            controller.contentResized(250);
            controller.viewportResized(100);
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);
            controller.addItems(0, 5, 'fixed', 'shift');
            collection.at(0).setMarked(true);
            controller.beforeRenderListControl();
            collection.at(0).setRenderedOutsideRange(true);
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            collection.at(0).setMarked(false);
            controller.beforeRenderListControl();
            collection.at(0).setRenderedOutsideRange(false);
            renderCollectionChanges(itemsContainer, collection);
            controller.scrollResized();
            controller.afterRenderListControl();

            expect(stubLoggerError).not.toHaveBeenCalled();
        });

        it('should not scroll to top on renders after mount', () => {
            controller.afterMountListControl();

            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).not.toHaveBeenCalled();
        });

        it('should scroll to top after reset items', () => {
            controller.afterMountListControl();
            controller.viewportResized(300);
            controller.contentResized(600);
            controller.scrollPositionChange(100);
            controller.setScrollBehaviourOnReset('reset');
            controller.resetItems();

            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).toHaveBeenCalledWith('top');
        });

        it('should not scroll to top after reset items if scroll keeping is enabled', () => {
            controller.scrollPositionChange(100);
            controller.setScrollBehaviourOnReset('keep');
            controller.resetItems();

            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).not.toHaveBeenCalled();
        });
    });

    describe('test restore scroll: beforeRenderListControl, afterRenderListControl', () => {
        it('should restore scroll position after adding items', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(0);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            controller.addItems(0, 2, 'fixed', 'shift');

            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).toHaveBeenCalledWith(100);
            expect(updatePlaceholdersUtilSpy).toHaveBeenCalledWith({
                backward: 0,
                forward: 100,
            });
            const expectedCallOrder = [updatePlaceholdersUtilSpy, doScrollUtilSpy];
            checkCallOrder(expectedCallOrder);
            expect(scrollToElementUtilSpy).not.toHaveBeenCalled();
            expect(activeElementChangedCallbackSpy).not.toHaveBeenCalled();
            expect(itemsEndedCallbackSpy).not.toHaveBeenCalled();
            expect(hasItemsOutRangeChangedCallbackSpy).not.toHaveBeenCalled();
            expect(updateVirtualNavigationUtilSpy).not.toHaveBeenCalled();
            expect(updateShadowsUtilSpy).not.toHaveBeenCalled();
        });

        it('should restore scroll when render item outside range', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(0);
            controller.contentResized(250);
            controller.viewportResized(100);
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);
            controller.addItems(0, 5, 'fixed', 'shift');
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();
            resetHistoryCallbacks();
            collection.at(0).setMarked(true);
            collection.at(0).setRenderedOutsideRange(true);

            // проверяем что сохранилась позиция скролла при отображении элемента за пределами диапазона
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).toHaveBeenCalledWith(50);
            expect(scrollToElementUtilSpy).not.toHaveBeenCalled();
            expect(activeElementChangedCallbackSpy).not.toHaveBeenCalled();
            expect(itemsEndedCallbackSpy).not.toHaveBeenCalled();
            expect(hasItemsOutRangeChangedCallbackSpy).not.toHaveBeenCalled();
            expect(updateVirtualNavigationUtilSpy).not.toHaveBeenCalled();
            expect(updatePlaceholdersUtilSpy).not.toHaveBeenCalled();
            expect(updateShadowsUtilSpy).not.toHaveBeenCalled();
        });

        it('should restore scroll when hide rendered item outside range', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(0);
            controller.contentResized(250);
            controller.viewportResized(100);
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);
            controller.addItems(0, 5, 'fixed', 'shift');
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();
            collection.at(0).setMarked(true);
            collection.at(0).setRenderedOutsideRange(true);
            // отрисовываем элемент за пределами диапазона
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();
            // скрываем элемент за пределами диапазона
            collection.at(0).setMarked(false);
            collection.at(0).setRenderedOutsideRange(false);
            controller.scrollPositionChange(100);
            resetHistoryCallbacks();

            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).toHaveBeenCalledWith(50);
            expect(scrollToElementUtilSpy).not.toHaveBeenCalled();
            expect(activeElementChangedCallbackSpy).not.toHaveBeenCalled();
            expect(itemsEndedCallbackSpy).not.toHaveBeenCalled();
            expect(hasItemsOutRangeChangedCallbackSpy).not.toHaveBeenCalled();
            expect(updateVirtualNavigationUtilSpy).not.toHaveBeenCalled();
            expect(updatePlaceholdersUtilSpy).toHaveBeenCalled();
            expect(updateShadowsUtilSpy).not.toHaveBeenCalled();
        });

        it('should restore scroll by passed direction (imitate expand node)', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(100);
            controller.contentResized(250);
            controller.viewportResized(100);
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 31, height: 50 } }), 3);
            controller.setPredicatedRestoreDirection('backward');
            controller.addItems(3, 1, 'fixed', 'extend');
            resetHistoryCallbacks();

            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).toHaveBeenCalledWith(100);
        });

        it('should not restore scroll position if should reset scroll', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(100);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            controller.setScrollBehaviourOnReset('reset');
            controller.resetItems();
            controller.addItems(0, 2, 'fixed', 'shift');

            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).toHaveBeenCalledWith('top');
        });

        it('should restore scroll position after adding items (touch)', async () => {
            detection.isMobileIOS = true;

            controller.afterMountListControl();
            controller.scrollPositionChange(0);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            controller.addItems(0, 2, 'fixed', 'shift');
            // Дожидаемся пока остановится инерционный скролл
            jest.advanceTimersByTime(101);

            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            // Все таки на тач устройствах должны сразу же кидать событие с новой позицией.
            // Должен в этот момент останавливаться инерционный скролл.
            expect(doScrollUtilSpy).toHaveBeenCalledWith(100);
        });
    });

    describe('destroy', () => {
        it('should reset scrollContainer state', () => {
            controller.destroy();

            expect(updateVirtualNavigationUtilSpy).toHaveBeenCalledWith({
                backward: false,
                forward: false,
            }, true);
            expect(updatePlaceholdersUtilSpy).toHaveBeenCalledWith({
                backward: 0,
                forward: 0,
            });
        });

        it('if schedule reset scroll position then should do it', () => {
            controller.viewportResized(300);
            controller.contentResized(600);
            controller.scrollPositionChange(100);
            controller.setScrollBehaviourOnReset('reset');
            controller.resetItems();

            controller.destroy();

            expect(doScrollUtilSpy).toHaveBeenCalledWith('top');
        });
    });

    describe('setCollection', () => {
        it('should set iterator to collection', () => {
            const newCollection = getCollection([]);
            const setIteratorSpy = jest.spyOn(newCollection, 'setViewIterator').mockClear();

            controller.setCollection(newCollection);

            expect(setIteratorSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('setItemsContainer', () => {
        it('should update items sizes and should not log error', () => {
            collection.at(9).setMarked(true);
            renderCollectionChanges(itemsContainer, collection);

            controller.setItemsContainer(itemsContainer);

            expect(stubLoggerError).not.toHaveBeenCalled();
        });
    });

    describe('addItems', () => {
        it('should set indexes to collection', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(100);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);

            controller.addItems(0, 5, 'fixed', 'shift');

            expect(controller.getIndexes()).toEqual({
                startIndex: 3,
                endIndex: 8,
            });
            expect(controller.getShiftDirection()).toEqual('backward');
        });

        it('should not restore scroll if param scrollMode=unfixed', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(100);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);

            controller.addItems(0, 5, 'unfixed', 'shift');
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).not.toHaveBeenCalled();
        });

        it('should call updatePlaceholdersUtil only after render', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(100);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);

            controller.addItems(0, 5, 'fixed', 'shift');
            controller.endBeforeUpdateListControl();
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(updatePlaceholdersUtilSpy).toHaveBeenCalledTimes(1);
            expect(updatePlaceholdersUtilSpy).toHaveBeenCalledWith({
                backward: 0,
                forward: 100,
            });
        });

        it('should update items sizes even if range is not changed and should restore scroll on next adding', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(100);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 31, height: 50 } }), 2);
            controller.addItems(0, 5, 'fixed', 'nothing');
            // Добавили элементы, но диапазон не изменился, отрисовываем тот же диапазон
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();
            // Добавили элементы и диапазон пересчитался, после этой отрисовки должны правильно восстановить скролл
            // Если бы на прошлой отрисовке не обновились размеры, то сейчас бы скролл восстановился криво
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 10);
            controller.addItems(10, 1, 'fixed', 'shift');
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).toHaveBeenCalled();
        });

        it('should schedule check triggers visibility and recalculate range', () => {
            const collection = getCollection([
                { key: 1, height: 50 },
                { key: 2, height: 50 },
                { key: 3, height: 50 },
            ]);
            const controller = new TestVirtualScrollController({
                ...controllerParams,
                collection,
                virtualScrollConfig: {
                    pageSize: 3,
                },
            });
            const scrollContainer = getScrollContainerWithList(collection);
            listContainer = scrollContainer.querySelector(
                `.${ListContainerUniqueClass}`
            ) as HTMLElement;
            itemsContainer = scrollContainer.querySelector(
                `.${ItemsContainerUniqueClass}`
            ) as HTMLElement;
            controller.setListContainer(listContainer);
            controller.setItemsContainer(itemsContainer);
            controller.afterMountListControl();
            controller.scrollPositionChange(0);
            controller.contentResized(150);
            controller.viewportResized(300);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 4, height: 50 } }), 3);
            controller.addItems(3, 1, 'fixed', 'nothing');

            // убедились что индексы сразу же не проставились и они пересчитаются когда сработает нижний триггер
            expect(controller.getIndexes()).toEqual({
                startIndex: 0,
                endIndex: 3,
            });
            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            // Триггеры проверяем с таймаутом
            jest.advanceTimersByTime(10);

            expect(controller.getIndexes()).toEqual({
                startIndex: 0,
                endIndex: 4,
            });
            expect(controller.getShiftDirection()).toEqual('forward');
        });
    });

    describe('removeItems', () => {
        it('should set indexes to collection', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(100);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.removeAt(2);
            recordSet.removeAt(2);

            controller.removeItems(2, 2, 'fixed');

            expect(controller.getIndexes()).toEqual({
                startIndex: 0,
                endIndex: 5,
            });
            expect(controller.getShiftDirection()).toEqual(null);
        });

        it('should not restore scroll after removing items if indexes is not changed', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(100);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.removeAt(2);
            recordSet.removeAt(2);

            controller.removeItems(2, 2, 'fixed');
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).not.toHaveBeenCalled();
        });
    });

    describe('resetItems', () => {
        it('should set indexes to collection', () => {
            controller.resetItems();

            expect(controller.getIndexes()).toEqual({
                startIndex: 0,
                endIndex: 5,
            });
        });

        it('should save range if should keep scroll position', () => {
            controller.afterMountListControl();
            controller.scrollPositionChange(100);
            controller.contentResized(250);
            controller.viewportResized(100);
            resetHistoryCallbacks();
            const recordSet = collection.getSourceCollection() as unknown as RecordSet;
            recordSet.add(new Model({ rawData: { key: 0, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -1, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -2, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -3, height: 50 } }), 0);
            recordSet.add(new Model({ rawData: { key: -4, height: 50 } }), 0);
            controller.addItems(0, 5, 'fixed', 'shift');
            controller.scrollPositionChange(100);

            controller.setScrollBehaviourOnReset('keep');
            controller.resetItems();

            expect(controller.getIndexes()).toEqual({
                startIndex: 3,
                endIndex: 8,
            });
            expect(controller.getShiftDirection()).toEqual(null);
        });

        it('should not scroll to top on render if last scrollBehaviourOnReset equal "reset"', () => {
            controller.viewportResized(300);
            controller.contentResized(600);
            controller.scrollPositionChange(100);
            controller.setScrollBehaviourOnReset('keep');
            controller.setScrollBehaviourOnReset(null);
            controller.setScrollBehaviourOnReset('reset');
            controller.resetItems();

            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).toHaveBeenCalledWith('top');
        });

        it('should not scroll to top on render if should keep scroll', () => {
            controller.scrollPositionChange(100);
            controller.setScrollBehaviourOnReset('keep');

            controller.resetItems();
            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).not.toHaveBeenCalled();
        });

        it('should not scroll to top on render if list is not scrolled', () => {
            controller.resetItems();
            controller.setScrollBehaviourOnReset('reset');

            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).not.toHaveBeenCalled();
        });

        it('should scroll to bottom after reset items', () => {
            const controller = new TestVirtualScrollController({
                ...controllerParams,
                collection,
                initialScrollPosition: SCROLL_POSITION.END,
            });
            controller.afterMountListControl();
            controller.viewportResized(300);
            controller.contentResized(600);
            controller.scrollPositionChange(100);
            controller.setScrollBehaviourOnReset('reset');
            controller.resetItems();

            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            expect(doScrollUtilSpy).toHaveBeenCalledWith('bottom');
        });

        it('should start range with activeElement', () => {
            controller.setActiveElementKey(3);

            controller.resetItems();

            expect(controller.getIndexes()).toEqual({
                startIndex: 2,
                endIndex: 7,
            });
        });

        it('should scroll to active element on render', () => {
            controller.setActiveElementKey(3);
            controller.scrollPositionChange(100);
            resetHistoryCallbacks();

            controller.resetItems();
            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            const activeElement = itemsContainer.querySelector('div[item-key="3"]');
            expect(scrollToElementUtilSpy).toHaveBeenCalledWith(activeElement, 'top', true);
            expect(doScrollUtilSpy).not.toHaveBeenCalled();
        });

        it('should restore scroll', () => {
            controller.afterMountListControl();
            controller.contentResized(250);
            controller.viewportResized(100);
            controller.scrollPositionChange(100);
            controller.setScrollBehaviourOnReset('restore');
            resetHistoryCallbacks();

            controller.resetItems();
            controller.beforeRenderListControl();
            controller.afterRenderListControl();

            expect(updatePlaceholdersUtilSpy).toHaveBeenCalledWith({
                backward: 0,
                forward: 0,
            });
            expect(hasItemsOutRangeChangedCallbackSpy).toHaveBeenCalledWith({
                backward: false,
                forward: true,
            });
            expect(updateVirtualNavigationUtilSpy).toHaveBeenCalledWith({
                backward: false,
                forward: true,
            });
            expect(updateShadowsUtilSpy).toHaveBeenCalledWith({
                backward: false,
                forward: true,
            });
            expect(doScrollUtilSpy).toHaveBeenCalledWith(100);
            const expectedCallOrder = [
                updatePlaceholdersUtilSpy,
                hasItemsOutRangeChangedCallbackSpy,
                updateVirtualNavigationUtilSpy,
                updateShadowsUtilSpy,
                doScrollUtilSpy,
            ];
            checkCallOrder(expectedCallOrder);
            expect(itemsEndedCallbackSpy).not.toHaveBeenCalled();
            expect(activeElementChangedCallbackSpy).not.toHaveBeenCalled();
            expect(scrollToElementUtilSpy).not.toHaveBeenCalled();
        });
    });

    describe('scrollToItem', () => {
        it('should scroll right away if range is not changed', () => {
            controller.afterMountListControl();
            resetHistoryCallbacks();

            controller.scrollToItem(2, 'top', true);

            const activeElement = itemsContainer.querySelector('div[item-key="2"]');
            expect(scrollToElementUtilSpy).toHaveBeenCalledWith(activeElement, 'top', true);
        });

        it('should not scroll after render if there was a scroll immediately', () => {
            controller.afterMountListControl();
            resetHistoryCallbacks();
            controller.scrollToItem(2, 'top', true);

            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(scrollToElementUtilSpy).toHaveBeenCalledTimes(1);
        });

        it('should scroll after render if range is changed', () => {
            controller.scrollToItem(6, 'bottom', false);

            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            const activeElement = itemsContainer.querySelector('div[item-key="6"]');
            expect(scrollToElementUtilSpy).toHaveBeenCalledWith(activeElement, 'bottom', false);
        });

        it('should not scroll if item is not found', () => {
            controller.scrollToItem(999);
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            expect(scrollToElementUtilSpy).not.toHaveBeenCalled();
        });

        it('should not scroll to hidden element', () => {
            controller.afterMountListControl();
            resetHistoryCallbacks();
            const firstElement = itemsContainer.querySelector('div[item-key="1"]') as HTMLElement;
            firstElement.style.display = 'none';

            controller.scrollToItem(1);

            expect(scrollToElementUtilSpy).not.toHaveBeenCalledWith(firstElement);
        });

        it('should scroll to next visible element if target element is hidden', () => {
            controller.afterMountListControl();
            resetHistoryCallbacks();
            const firstElement = itemsContainer.querySelector('div[item-key="1"]') as HTMLElement;
            firstElement.style.display = 'none';

            controller.scrollToItem(1);

            const nextVisibleElement = itemsContainer.querySelector(
                'div[item-key="2"]'
            ) as HTMLElement;
            expect(scrollToElementUtilSpy).toHaveBeenCalledWith(
                nextVisibleElement,
                undefined,
                undefined
            );
        });
    });

    describe('scrollToPage', () => {
        describe('scroll on page', () => {
            it('should scroll to forward', () => {
                controller.afterMountListControl();
                controller.contentResized(250);
                controller.viewportResized(100);

                const result = controller.scrollToPage('forward');

                // как-будто проскроллили, чтобы протестировать firstVisibleItemKey
                controller.scrollPositionChange(100);
                return result.then((firstVisibleItemKey) => {
                    expect(firstVisibleItemKey).toEqual(3);
                    expect(scrollToElementUtilSpy).not.toHaveBeenCalled();
                    expect(doScrollUtilSpy).toHaveBeenCalledWith('pageDown');
                });
            });

            it('should scroll to backward', () => {
                controller.afterMountListControl();
                controller.contentResized(250);
                controller.viewportResized(100);
                controller.scrollPositionChange(100);

                const result = controller.scrollToPage('backward');

                // как-будто проскроллили, чтобы протестировать firstVisibleItemKey
                controller.scrollPositionChange(0);
                return result.then((firstVisibleItemKey) => {
                    expect(firstVisibleItemKey).toEqual(1);
                    expect(scrollToElementUtilSpy).not.toHaveBeenCalled();
                    expect(doScrollUtilSpy).toHaveBeenCalledWith('pageUp');
                });
            });
        });
    });

    describe('scrollToEdge', () => {
        it('should scroll to forward edge', () => {
            controller.scrollToEdge('forward');
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            const activeElement = itemsContainer.querySelector('div[item-key="10"]');
            expect(scrollToElementUtilSpy).toHaveBeenCalledWith(activeElement, 'bottom', true);
        });

        it('should scroll to backward edge', () => {
            controller.scrollPositionChange(100);
            controller.scrollToEdge('backward');
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            const activeElement = itemsContainer.querySelector('div[item-key="1"]');
            expect(scrollToElementUtilSpy).toHaveBeenCalledWith(activeElement, 'top', true);
        });

        it('should pass position="bottom" if scroll to forward and initial position is end', () => {
            const controller = new TestVirtualScrollController({
                ...controllerParams,
                itemsContainer,
                listContainer,
                initialScrollPosition: SCROLL_POSITION.END,
            });
            controller.afterMountListControl();

            controller.scrollToEdge('forward');
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            const activeElement = itemsContainer.querySelector('div[item-key="10"]');
            expect(scrollToElementUtilSpy).toHaveBeenCalledWith(activeElement, 'bottom', true);
        });
    });

    describe('scrollPositionChange', () => {
        it('should calculate activeElement', () => {
            controller.afterMountListControl();

            controller.scrollPositionChange(100);

            expect(activeElementChangedCallbackSpy).toHaveBeenCalledWith(0);
        });

        it('should not calculate activeElement if indexes are changed', () => {
            controller.afterMountListControl();
            controller.addItems(0, 1, 'fixed', 'shift');

            controller.scrollPositionChange(100);

            expect(activeElementChangedCallbackSpy).not.toHaveBeenCalled();
        });

        it('should not calculate activeElement after restore scroll', () => {
            controller.afterMountListControl();
            controller.contentResized(250);
            controller.viewportResized(100);
            controller.addItems(0, 1, 'fixed', 'shift');
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();

            controller.scrollPositionChange(100);

            expect(activeElementChangedCallbackSpy).not.toHaveBeenCalled();
        });
    });
});
