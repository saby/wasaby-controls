/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Money} from 'Controls/baseDecorator';

describe('Controls/baseDecorator:Money',() => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('onClick', async () => {
        let isOnClickCalled = false;
        render(<Money value={1000} onClick={() => isOnClickCalled=true}/>, { container });

        await userEvent.click(screen.getByText('1 000'));

        expect(isOnClickCalled).toBeTruthy();
    });
    it('onMouseMove/onMouseLeave', async () => {
        let isOnMouseMoveCalled = false;
        let isOnMouseLeaveCalled = false;
        render(<Money value={1000}
                      onMouseMove={() => isOnMouseMoveCalled=true}
                      onMouseLeave={() => isOnMouseLeaveCalled=true}
                />
            , { container });
        await userEvent.hover(screen.getByText('1 000'));
        expect(isOnMouseMoveCalled).toBeTruthy();
        await userEvent.unhover(screen.getByText('1 000'));
        expect(isOnMouseLeaveCalled).toBeTruthy();
    });
});
