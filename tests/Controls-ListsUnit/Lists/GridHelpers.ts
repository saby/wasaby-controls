import { ReactElement } from 'react';
import {
    RenderOptions,
    Matcher,
    MatcherOptions,
    RenderResult,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ListQueries, renderList, QueryReturnElement } from './ListHelpers';

interface GridQueries extends ListQueries {
    getHeader: QueryReturnElement;
}

function getCell(itemContainer: HTMLElement, index: number): HTMLElement {
    const column = getCells(itemContainer)[index];
    if (!column) {
        throw Error(`Shouldn't get column at ${index}`);
    }
    return column as HTMLElement;
}

async function clickCell(
    itemContainer: HTMLElement,
    index: number
): Promise<HTMLElement> {
    const cell = getCell(itemContainer, index);
    await userEvent.click(cell);
    return cell;
}

function getCells(itemContainer: HTMLElement): HTMLElement[] {
    return Array.from(itemContainer.children) as HTMLElement[];
}

function getHeader(
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions
): HTMLElement {
    return container.querySelector('[data-qa="header"]');
}

function renderGrid<TQueries extends GridQueries = GridQueries>(
    ui: ReactElement,
    options?: RenderOptions
): RenderResult<TQueries> {
    const queries: TQueries = {
        ...options.queries,
        getHeader,
    };
    return renderList<TQueries>(ui, { ...options, queries });
}

export { renderGrid, getCell, getCells, clickCell };
