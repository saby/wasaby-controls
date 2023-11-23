/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { fireEvent, waitFor } from '@testing-library/react';

import { IColumnScrollWidths } from 'Controls/_columnScrollReact/common/interfaces';
import SmoothScrollingAnimationComponent from 'Controls/_columnScrollReact/ApplyCssTransform/SmoothScrollingAnimationComponent';
import { SELECTORS } from '../SelectorsForTests';
import { renderStyleInnerPureComponent } from '../forTestsOnly/helpers';

describe('ControlsUnit/columnScrollReact/ApplyCssTransform/SmoothScrollingAnimationComponent', () => {
    let rootContainer: HTMLDivElement = null;
    let componentContainer: HTMLDivElement = null;

    const WIDTHS: Readonly<IColumnScrollWidths> = {
        startFixedWidth: 300,
        endFixedWidth: 0,
        contentWidth: 1000,
        viewPortWidth: 450,
    };

    const initRootContainer = (): HTMLDivElement => {
        const container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
        return container;
    };

    const destroyRootContainer = () => {
        unmountComponentAtNode(rootContainer);
        WasabyEvents.destroyInstance(rootContainer);
        rootContainer.remove();
        rootContainer = null;
    };

    const addTransformedContainerToRootContainer = (): HTMLDivElement => {
        const transformedContainer = document.createElement('div');
        transformedContainer.classList.add(SELECTORS.ROOT_TRANSFORMED_ELEMENT);
        rootContainer.appendChild(transformedContainer);
        return transformedContainer;
    };

    const addComponentContainerToRootContainer = (): HTMLDivElement => {
        const container = document.createElement('div');
        rootContainer.appendChild(container);
        return container;
    };

    const destroyComponentContainer = () => {
        unmountComponentAtNode(componentContainer);
        componentContainer.remove();
        componentContainer = null;
    };

    beforeEach(() => {
        rootContainer = initRootContainer();
        componentContainer = addComponentContainerToRootContainer();
    });

    afterEach(() => {
        destroyComponentContainer();
        destroyRootContainer();
    });

    it('no root div in document.', () => {
        expect(() => {
            renderStyleInnerPureComponent(
                <SmoothScrollingAnimationComponent selectors={SELECTORS} {...WIDTHS} from={-10} to={10} />,
                { container: componentContainer }
            );
        }).not.toThrow();
    });

    it('no onAnimationEnd handler.', () => {
        const transformedElement = addTransformedContainerToRootContainer();
        expect(() => {
            renderStyleInnerPureComponent(
                <SmoothScrollingAnimationComponent selectors={SELECTORS} {...WIDTHS} from={100.21} to={-1} />,
                { container: componentContainer }
            );
        }).not.toThrow();
        expect(transformedElement.onanimationend).not.toBeDefined();
    });

    it('base animation style.', () => {
        const { getStyleTag } = renderStyleInnerPureComponent(
            <SmoothScrollingAnimationComponent selectors={SELECTORS} {...WIDTHS} from={0} to={139} />,
            { container: componentContainer }
        );
        expect(getStyleTag()).toMatchSnapshot();
    });

    it('call callback from props onAnimationEnd.', async () => {
        expect.hasAssertions();
        const transformedElement = addTransformedContainerToRootContainer();
        const onAnimationEndMock = jest.fn();

        renderStyleInnerPureComponent(
            <SmoothScrollingAnimationComponent
                selectors={SELECTORS}
                {...WIDTHS}
                from={100.21}
                to={-1}
                onAnimationEnd={onAnimationEndMock}
            />,
            { container: componentContainer }
        );

        fireEvent.animationEnd(transformedElement);

        await waitFor(() => {
            expect(onAnimationEndMock).toBeCalledTimes(1);
        });

        // Завершение другой анимации не вызовет повторный вызов колбека, т.к. мы отписались.
        fireEvent.animationEnd(transformedElement);

        await waitFor(() => {
            expect(onAnimationEndMock).toBeCalledTimes(1);
        });
    });
});
