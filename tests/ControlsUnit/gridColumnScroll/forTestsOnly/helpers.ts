import * as React from 'react';
import {
    render,
    RenderOptions,
    RenderResult,
    Queries,
    Matcher,
    MatcherOptions,
} from '@testing-library/react';

import { act } from 'react-dom/test-utils';

export interface IBaseQueries extends Queries {
    getByQA: <T extends HTMLElement = HTMLElement>(
        container: HTMLElement,
        id: Matcher
    ) => HTMLElement;
}

function getByQA(container: HTMLElement, id: Matcher, options?: MatcherOptions): HTMLElement {
    const element = container.querySelector(`[data-qa="${id}"]`);
    if (!element) {
        throw Error('Could not find container');
    }
    return element as HTMLDivElement;
}

export function renderAnyComponent(
    ui: React.ReactElement,
    options?: RenderOptions<Queries>
): RenderResult<IBaseQueries> {
    const queries: IBaseQueries = {
        ...options.queries,
        getByQA,
    };

    let result;

    act(() => {
        result = render<IBaseQueries>(ui, { ...options, queries });
    });

    return result;
}
