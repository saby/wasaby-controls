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
} from 'ControlsUnit/list_clean/scroll/DomUtils';
import {
    IListVirtualScrollControllerOptions,
    ListVirtualScrollController,
} from 'Controls/baseList';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

function getController(
    options: Partial<IListVirtualScrollControllerOptions>
): ListVirtualScrollController {
    return new ListVirtualScrollController({
        itemsContainer: null,
        listContainer: null,
        listControl: getListControl(),
        collection: null,
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
        scrollToElementUtil: () => {
            return null;
        },
        doScrollUtil: () => {
            return null;
        },
        updatePlaceholdersUtil: () => {
            return null;
        },
        updateShadowsUtil: () => {
            return null;
        },
        updateVirtualNavigationUtil: () => {
            return null;
        },
        activeElementChangedCallback: () => {
            return null;
        },
        hasItemsOutRangeChangedCallback: () => {
            return null;
        },
        itemsEndedCallback: () => {
            return null;
        },
        feature1183225611: false,
        disableVirtualScroll: false,
        initialScrollPosition: null,
        multiColumns: false,
        viewportSize: 0,
        contentSize: 0,
        scrollPosition: 0,
        feature1184208466: false,
        isReact: false,
        renderedItems: undefined,
        ...options,
    });
}

describe('Controls/baseList:ListVirtualScrollController', () => {
    let collection;
    let listContainer;
    let itemsContainer;

    let oldWindow;

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

    beforeEach(() => {
        collection = getCollection([
            { key: 1, height: 50 },
            { key: 2, height: 50 },
            { key: 3, height: 50 },
            { key: 4, height: 50 },
            { key: 5, height: 50 },
        ]);

        const scrollContainer = getScrollContainerWithList(collection);
        listContainer = scrollContainer.querySelector(
            `.${ListContainerUniqueClass}`
        ) as HTMLElement;
        itemsContainer = scrollContainer.querySelector(
            `.${ItemsContainerUniqueClass}`
        ) as HTMLElement;
    });

    it('should apply indexes to collection', () => {
        const controller = getController({
            collection,
            listContainer,
            itemsContainer,
        });

        expect(collection.getStartIndex()).toEqual(0);
        expect(collection.getStopIndex()).toEqual(5);
    });

    it('should not throw error if groupKey is number', () => {
        const collection = getCollection(
            [
                { key: 1, height: 50, group: 123 },
                { key: 2, height: 50, group: 123 },
                { key: 3, height: 50, group: 123 },
                { key: 4, height: 50, group: 123 },
                { key: 5, height: 50, group: 123 },
            ],
            { groupProperty: 'group' }
        );
        const scrollContainer = getScrollContainerWithList(collection);
        listContainer = scrollContainer.querySelector(
            `.${ListContainerUniqueClass}`
        ) as HTMLElement;
        itemsContainer = scrollContainer.querySelector(
            `.${ItemsContainerUniqueClass}`
        ) as HTMLElement;
        const controller = getController({
            collection,
            listContainer,
            itemsContainer,
            virtualScrollConfig: {
                pageSize: 10,
            },
        });
        controller.afterMountListControl();
        controller.scrollPositionChange(0);
        controller.contentResized(250);
        controller.viewportResized(100);
        const recordSet = collection.getSourceCollection() as unknown as RecordSet;
        recordSet.add(new Model({ rawData: { key: 0, height: 50, group: 123 } }), 0);
        controller.addItems(1, 1, 'fixed', 'shift');

        let wasError = false;
        try {
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();
        } catch (e) {
            wasError = true;
        }

        expect(wasError).toBe(false);
    });

    it('should not throw error if not find item by edgeItemKey', () => {
        const controller = getController({
            collection,
            listContainer,
            itemsContainer,
            virtualScrollConfig: {
                pageSize: 10,
            },
        });
        controller.afterMountListControl();
        controller.scrollPositionChange(0);
        controller.contentResized(250);
        controller.viewportResized(100);
        const recordSet = collection.getSourceCollection() as unknown as RecordSet;
        recordSet.removeAt(0);
        controller.removeItems(0, Array(1), 'fixed');

        let wasError = false;
        try {
            controller.beforeRenderListControl();
            renderCollectionChanges(itemsContainer, collection);
            controller.afterRenderListControl();
        } catch (e) {
            wasError = true;
        }

        expect(wasError).toBe(false);
    });
});
