/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { Empty } from 'Controls-ListEnv/listSearchHints';

describe('Controls-ListEnv/listSearchHints:Empty', () => {
    let container: HTMLDivElement;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
    });

    it('Without filters', async () => {
        const { findByTestId } = render(<Empty storeId="emptySearchHint" />, { container });

        const continueSearch = await findByTestId('continue-search');
        expect(continueSearch).toMatchSnapshot();
    });
});
