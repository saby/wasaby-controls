import { ReactElement } from 'react';
import { RenderOptions, Matcher, MatcherOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderList, ListQueries, getItem, QueryReturnElement } from './ListHelpers';

interface TreeQueries extends ListQueries {
    toggleNode: QueryReturnElement;
    getNodeFooterMoreButton: QueryReturnElement;
}

function getExpander(itemContainer: HTMLElement, id: string | number): HTMLElement {
    const expander = itemContainer.querySelector('[data-qa="item-expander"]');
    if (!expander) {
        throw Error(`Can't find item expander with key=${id}`);
    }
    return expander as HTMLElement;
}

async function toggleNode(
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions
): Promise<HTMLElement> {
    const item = getItem(container, id, options);
    const expander = getExpander(item, id as string | number);
    await userEvent.click(expander);
    return item;
}

function getNodeFooterMoreButton(
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions
): HTMLElement {
    const item = getItem(container, `node-footer-${id}`, options);
    return item.querySelector('[data-qa="navigation-button"]');
}

function renderTree<TQueries extends TreeQueries = TreeQueries>(
    ui: ReactElement,
    options?: RenderOptions
): RenderResult<TQueries> {
    const queries: TQueries = {
        ...options.queries,
        toggleNode,
        getNodeFooterMoreButton,
    };
    return renderList<TQueries>(ui, { ...options, queries });
}

export { renderTree };
