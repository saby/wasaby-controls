import { ReactElement } from 'react';
import {
    render,
    RenderOptions,
    Matcher,
    MatcherOptions,
    RenderResult,
    Queries,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type QueryReturnArray = (container: HTMLElement, ...args: unknown[]) => HTMLElement[];
type QueryReturnElement = (container: HTMLElement, ...args: unknown[]) => HTMLElement;

interface ListQueries extends Queries {
    getList: QueryReturnElement;
    getItems: QueryReturnArray;
    getItem: QueryReturnElement;
    getFirstItem: QueryReturnElement;
    getLastItem: QueryReturnElement;
    getTrackedProperties: QueryReturnElement;
    getMarker: QueryReturnElement;

    getSpaceItems: QueryReturnArray;

    toggleGroup: QueryReturnElement;
    clickItem: QueryReturnElement;
    hoverList: QueryReturnElement;
}

// region Getters

function getItemsContainer(
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions
): HTMLElement {
    const itemsContainer = container.querySelector('[data-qa="items-container"]');
    if (!itemsContainer) {
        throw Error('Could not find items container');
    }
    return itemsContainer as HTMLElement;
}

function getList(container: HTMLElement, id: Matcher, options?: MatcherOptions): HTMLElement {
    const listContainer = container.querySelector('[data-qa="list"]');
    if (!listContainer) {
        throw Error('List is not rendered');
    }
    return listContainer as HTMLElement;
}

function getItems(container: HTMLElement, id: Matcher, options?: MatcherOptions): HTMLElement[] {
    const itemsContainer = getItemsContainer(container, id, options);
    return Array.from(itemsContainer.children) as HTMLElement[];
}

function getItem(container: HTMLElement, id: Matcher, options?: MatcherOptions): HTMLElement {
    if (id === undefined) {
        throw Error('Should pass item key');
    }
    const items = getItems(container, id, options);
    const item = items.find((it) => {
        return it.getAttribute('item-key') === String(id);
    });
    if (!item) {
        throw Error(`Couldn't find item with key=${id}`);
    }
    return item;
}

function getFirstItem(container: HTMLElement, id: Matcher, options?: MatcherOptions): HTMLElement {
    const items = getItems(container, id, options);
    return items[0];
}

function getLastItem(container: HTMLElement, id: Matcher, options?: MatcherOptions): HTMLElement {
    const items = getItems(container, id, options);
    return items[items.length - 1];
}

function getMarker(container: HTMLElement, id: Matcher, options?: MatcherOptions): HTMLElement {
    const item = getItem(container, id, options);
    return item.querySelector('[data-qa="marker"]');
}

function getSpaceItems(
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions
): HTMLElement[] {
    return Array.from(container.querySelectorAll('[data-qa="space-item"]'));
}

function getTrackedProperties(
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions
): HTMLElement {
    return container.querySelector('[data-qa="tracked-properties"]');
}

// endregion Getters

// region Actions

async function toggleGroup(
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions
): Promise<HTMLElement> {
    const group = getItem(container, id, options);
    const expander = group.querySelector('[data-qa="group-expander"]');
    if (!expander) {
        throw Error(`Can't find group expander with key=${id}`);
    }
    await userEvent.click(expander);
    return group;
}

async function clickItem(
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions
): Promise<HTMLElement> {
    const item = getItem(container, id, options);
    await userEvent.click(item);
    return item;
}

async function hoverList(
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions
): Promise<HTMLElement> {
    const list = container.querySelector('.controls-BaseControl');
    await userEvent.hover(list);
    return list as HTMLElement;
}

// endregion Actions

function renderList<TQueries extends ListQueries = ListQueries>(
    ui: ReactElement,
    options?: RenderOptions
): RenderResult<TQueries> {
    const queries: TQueries = {
        ...options.queries,
        getList,
        getItems,
        getItem,
        getFirstItem,
        getLastItem,
        getSpaceItems,
        getTrackedProperties,
        getMarker,
        toggleGroup,
        clickItem,
        hoverList,
    };
    return render<TQueries>(ui, { ...options, queries });
}

export { renderList, getItem, ListQueries, QueryReturnArray, QueryReturnElement };
