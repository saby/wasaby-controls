/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import ToggleButton from 'Controls/ToggleButton';

describe('Controls/ToggleButton', function () {
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
    it('captions and value true', function () {
        act(() => {
            render(<ToggleButton value={true} captions={['Change', 'Save']} />, container);
        });
        expect(container).toMatchSnapshot();
    });

    it('captions and value false', function () {
        act(() => {
            render(<ToggleButton value={false} captions={['Change', 'Save']} />, container);
        });
        expect(container).toMatchSnapshot();
    });

    it('icons and value true', function () {
        act(() => {
            render(
                <ToggleButton
                    value={true}
                    viewMode="ghost"
                    icons={['icon-ArrangeList03', 'icon-ArrangeList04']}
                />,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });

    it('icons and value false', function () {
        act(() => {
            render(
                <ToggleButton
                    value={false}
                    viewMode="ghost"
                    icons={['icon-ArrangeList03', 'icon-ArrangeList04']}
                />,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });

    it('iconStyles and value true', function () {
        act(() => {
            render(
                <ToggleButton
                    value={true}
                    viewMode="ghost"
                    iconStyles={['secondary', 'unaccented']}
                />,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });

    it('iconStyles and value false', function () {
        act(() => {
            render(
                <ToggleButton
                    value={false}
                    viewMode="ghost"
                    iconStyles={['secondary', 'unaccented']}
                />,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });

    it('viewMode=pushButton and inlineHeight=l', function () {
        act(() => {
            render(
                <ToggleButton value={false} viewMode="pushButton" inlineHeight="l" />,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });
});
