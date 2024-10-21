/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import Separator from 'Controls/Separator';

describe('Controls/Separator', function () {
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
    it('default', () => {
        act(() => {
            render(<Separator />, container);
        });
        expect(container).toMatchSnapshot();
    });

    it('value=true', function () {
        act(() => {
            render(<Separator value={true} />, container);
        });
        expect(container).toMatchSnapshot();
    });

    it('bold=true', function () {
        act(() => {
            render(<Separator bold={true} />, container);
        });
        expect(container).toMatchSnapshot();
    });

    it('style=primary', function () {
        act(() => {
            render(<Separator style="primary" />, container);
        });
        expect(container).toMatchSnapshot();
    });
});
