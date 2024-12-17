import * as React from 'react';
import {
    render,
    RenderOptions,
    RenderResult,
    Queries,
    Matcher,
    MatcherOptions,
} from '@testing-library/react';

import { QA_SELECTORS } from 'Controls/_columnScrollReact/common/data-qa';

export interface IBaseQueries extends Queries {
    getByQA: <T extends HTMLElement = HTMLElement>(
        container: HTMLElement,
        id: Matcher
    ) => HTMLElement;
}

export interface IRenderStyleInnerPureComponentQueries extends IBaseQueries {
    getStyleTag: (container: HTMLElement) => HTMLStyleElement;
}

interface IRenderDragScrollOverlayComponentQueries extends IBaseQueries {
    getOverlay: (container: HTMLElement) => HTMLDivElement;
}

function getStyleTag(container: HTMLElement): HTMLStyleElement {
    const item = container.getElementsByTagName('style').item(0);
    if (!item) {
        throw Error('Could not find style tag!');
    }
    return item;
}

function getOverlay(container: HTMLElement): HTMLDivElement {
    const itemsContainer = container.querySelector(
        `[data-qa="${QA_SELECTORS.DRAG_SCROLL_OVERLAY}"]`
    );
    if (!itemsContainer) {
        throw Error('Could not find overlay container');
    }
    return itemsContainer as HTMLDivElement;
}

function getByQA(container: HTMLElement, id: Matcher, options?: MatcherOptions): HTMLElement {
    const element = container.querySelector(`[data-qa="${id}"]`);
    if (!element) {
        throw Error('Could not find container');
    }
    return element as HTMLDivElement;
}

export function renderStyleInnerPureComponent(
    ui: React.ReactElement,
    options?: RenderOptions<Queries>
): RenderResult<IRenderStyleInnerPureComponentQueries> {
    const queries: IRenderStyleInnerPureComponentQueries = {
        ...options.queries,
        getStyleTag,
        getByQA,
    };
    return render<IRenderStyleInnerPureComponentQueries>(ui, {
        ...options,
        queries,
    });
}

export function renderStyleCompositeComponent(
    ui: React.ReactElement,
    options?: RenderOptions<Queries>
): RenderResult<IBaseQueries> {
    const queries: IBaseQueries = {
        ...options.queries,
        getByQA,
    };
    return render<IBaseQueries>(ui, { ...options, queries });
}

export function renderAnyComponent(
    ui: React.ReactElement,
    options?: RenderOptions<Queries>
): RenderResult<IBaseQueries> {
    const queries: IBaseQueries = {
        ...options.queries,
        getByQA,
    };

    return render<IBaseQueries>(ui, { ...options, queries });
}

export function renderDragScrollOverlayComponent(
    ui: React.ReactElement,
    options?: RenderOptions<Queries>
): RenderResult<IRenderDragScrollOverlayComponentQueries> {
    const queries: IRenderDragScrollOverlayComponentQueries = {
        ...options.queries,
        getByQA,
        getOverlay,
    };

    return render<IRenderDragScrollOverlayComponentQueries>(ui, {
        ...options,
        queries,
    });
}
