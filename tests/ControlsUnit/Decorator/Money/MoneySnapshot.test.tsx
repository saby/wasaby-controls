/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Money } from 'Controls/baseDecorator';

describe('Controls/baseDecorator:Money', function () {
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
            render(<Money value="100000" />, container);
        });
        expect(container).toMatchSnapshot();
    });
    it('useGrouping=false', () => {
        act(() => {
            render(<Money value="100000" useGrouping={false} />, container);
        });
        expect(container).toMatchSnapshot();
    });
    it('currency=Dollar', () => {
        act(() => {
            render(<Money value="100000" currency="Dollar" />, container);
        });
        expect(container).toMatchSnapshot();
    });
    it('currencyPosition=left', () => {
        act(() => {
            render(<Money value="100000" currency="Dollar" currencyPosition="left" />, container);
        });
        expect(container).toMatchSnapshot();
    });
    it('currencyStyle', () => {
        [
            'primary',
            'secondary',
            'success',
            'warning',
            'danger',
            'unaccented',
            'link',
            'label',
            'info',
            'default',
            'contrast',
        ].forEach((style) => {
            act(() => {
                render(<Money value="100000" currency="Dollar" currencyStyle={style} />, container);
            });
            expect(container).toMatchSnapshot();
        });
    });
    it('currencySize', () => {
        ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl'].forEach(
            (size) => {
                act(() => {
                    render(<Money value={1000} currency="Dollar" currencySize={size} />, container);
                });
                expect(container).toMatchSnapshot();
            }
        );
    });
    it('abbreviationType=long', () => {
        [1000, 1000000, 1000000000, 1000000000000].forEach((num) => {
            act(() => {
                render(<Money value={num} abbreviationType="long" />, container);
            });
            expect(container).toMatchSnapshot();
        });
    });
});
