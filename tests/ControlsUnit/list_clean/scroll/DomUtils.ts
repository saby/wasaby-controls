import { Collection, CollectionItem } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { BaseControl } from 'Controls/baseList';
import { Control } from 'UI/Base';
import { IOptions } from 'Controls/_display/Collection';

type TGetItemElement = (item: CollectionItem) => HTMLElement;

export const ItemsContainerUniqueClass = 'itemsContainer';
export const ListContainerUniqueClass = 'listContainer';
export const ItemClass = 'item';
export const TriggerClass = 'trigger';
export const IndicatorClass = 'indicator';

export function getCollection(items: object[], options?: Partial<IOptions>): Collection {
    return new Collection({
        collection: new RecordSet({
            rawData: items,
            keyProperty: 'key',
        }),
        keyProperty: 'key',
        stickyMarkedItem: true,
        style: 'default',
        ...options,
    });
}

export function getItemsContainer(
    collection: Collection,
    customGetItemElement?: TGetItemElement
): HTMLElement {
    const itemsContainer: HTMLElement = window.document.createElement('div');
    itemsContainer.className = ItemsContainerUniqueClass;

    collection.getViewIterator().each((item) => {
        const itemElement = customGetItemElement
            ? customGetItemElement(item)
            : getItemElement(item);
        itemsContainer.appendChild(itemElement);
    });

    return itemsContainer;
}

export function getListContainer(
    collection: Collection,
    customGetItemElement?: TGetItemElement,
    withoutTopTrigger: boolean = false,
    withoutBottomTrigger: boolean = false
): HTMLElement {
    const listContainer: HTMLElement = window.document.createElement('div');
    listContainer.className = ListContainerUniqueClass;

    if (collection.getTopIndicator().isDisplayed()) {
        listContainer.appendChild(getIndicatorElement());
    }
    if (!withoutTopTrigger) {
        listContainer.appendChild(getTriggerElement());
    }
    listContainer.appendChild(getItemsContainer(collection, customGetItemElement));
    if (!withoutBottomTrigger) {
        listContainer.appendChild(getTriggerElement());
    }
    if (collection.getBottomIndicator().isDisplayed()) {
        listContainer.appendChild(getIndicatorElement());
    }

    return listContainer;
}

export function getScrollContainerWithList(
    collection: Collection,
    beforeListContent?: HTMLElement
): HTMLElement {
    const listContainer = getListContainer(collection);

    const scrollContainer: HTMLElement = window.document.createElement('div');
    scrollContainer.className = 'controls-Scroll-ContainerBase__content';
    const itemsContainer = listContainer.querySelector(
        `.${ItemsContainerUniqueClass}`
    ) as HTMLElement;

    jest.spyOn(scrollContainer, 'getBoundingClientRect')
        .mockClear()
        .mockImplementation(() => {
            return {
                width: 300,
                height: 0,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            } as DOMRect;
        });
    jest.spyOn(itemsContainer, 'getBoundingClientRect')
        .mockClear()
        .mockImplementation(() => {
            const beforeListOffset = beforeListContent?.getBoundingClientRect().height || 0;
            const indicatorOffset = collection.getTopIndicator().isDisplayed() ? 48 : 0;
            return {
                width: 300,
                height: 0,
                top: beforeListOffset + indicatorOffset,
                left: 0,
                right: 0,
                bottom: 0,
            } as DOMRect;
        });
    jest.spyOn(listContainer, 'getBoundingClientRect')
        .mockClear()
        .mockImplementation(() => {
            const beforeListOffset = beforeListContent?.getBoundingClientRect().height || 0;
            return {
                width: 300,
                height: 0,
                top: beforeListOffset,
                left: 0,
                right: 0,
                bottom: 0,
            } as DOMRect;
        });

    if (beforeListContent) {
        scrollContainer.appendChild(beforeListContent);
    }
    scrollContainer.appendChild(listContainer);

    return scrollContainer;
}

export function getListContainerWithNestedList(
    collection: Collection,
    nestedCollection: Collection
): HTMLElement {
    const customGetItemElement: TGetItemElement = (item) => {
        const itemElement: HTMLElement = window.document.createElement('div');

        itemElement.className = ItemClass;
        itemElement.setAttribute('item-key', item.key);
        // Вложенный список
        itemElement.appendChild(getListContainer(nestedCollection));

        return itemElement;
    };

    return getListContainer(collection, customGetItemElement);
}

export function getListControl(): Control {
    return new BaseControl({}, {}) as unknown as Control;
}

export function renderCollectionChanges(itemsContainer: HTMLElement, collection: Collection): void {
    const childElements = Array.from(itemsContainer.children);
    childElements.forEach((it) => {
        return it.remove();
    });
    collection.getViewIterator().each((item) => {
        const itemElement = getItemElement(item);
        itemsContainer.appendChild(itemElement);
    });
}

function getItemElement(item: CollectionItem): HTMLElement {
    const itemElement: HTMLElement = window.document.createElement('div');

    itemElement.className = ItemClass;
    itemElement.setAttribute('item-key', item.key);

    jest.spyOn(itemElement, 'getBoundingClientRect')
        .mockClear()
        .mockImplementation(() => {
            return {
                width: (item.contents.get && item.contents.get('width')) || 0,
                height: (item.contents.get && item.contents.get('height')) || 0,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            } as DOMRect;
        });

    return itemElement;
}

function getTriggerElement(): HTMLElement {
    const triggerElement: HTMLElement = window.document.createElement('div');
    triggerElement.className = TriggerClass;
    return triggerElement;
}

function getIndicatorElement(): HTMLElement {
    const indicatorElement: HTMLElement = window.document.createElement('div');
    indicatorElement.className = IndicatorClass;
    jest.spyOn(indicatorElement, 'getBoundingClientRect')
        .mockClear()
        .mockImplementation(() => {
            return {
                width: 300,
                height: 48,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            } as DOMRect;
        });
    return indicatorElement;
}

export function getBeforeListContent(): HTMLElement {
    const beforeListContent: HTMLElement = window.document.createElement('div');
    beforeListContent.className = 'beforeListContent';

    jest.spyOn(beforeListContent, 'getBoundingClientRect')
        .mockClear()
        .mockImplementation(() => {
            return {
                width: 300,
                height: 200,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            } as DOMRect;
        });

    return beforeListContent;
}
