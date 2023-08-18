/**
 * @jest-environment jsdom
 */
jest.mock('Controls/_columnScrollReact/Navigation/ArrowButtons', () => {
    return {
        __esModule: true,
        default: (props) => {
            return (
                <div data-qa="mocked_ArrowButtonsNavigationComponent">
                    <div data-qa="mocked_arrows_props">{JSON.stringify(props, null, 4)}</div>
                    <div
                        data-qa="mocked_arrow_left"
                        onClick={() => {
                            return props.onArrowClick?.('backward');
                        }}
                    />
                    <div
                        data-qa="mocked_arrow_right"
                        onClick={() => {
                            return props.onArrowClick?.('forward');
                        }}
                    />
                </div>
            );
        },
    };
});

jest.mock('Controls/_columnScrollReact/Navigation/Scrollbar', () => {
    return {
        __esModule: true,
        default: (props) => {
            return (
                <div data-qa="mocked_ScrollbarNavigationComponent">
                    {JSON.stringify(props, undefined, 4)}
                </div>
            );
        },
    };
});

import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

import NavigationComponent, {
    INavigationComponentProps,
} from 'Controls/_columnScrollReact/NavigationComponent';
import {
    ColumnScrollContext,
    IColumnScrollContext,
    PrivateContextUserSymbol,
} from 'Controls/_columnScrollReact/context/ColumnScrollContext';
import { SELECTORS } from './SelectorsForTests';
import { renderAnyComponent } from './forTestsOnly/helpers';
import { AnimationSteps } from './forTestsOnly/animationSteps';
import { EdgeState } from 'Controls/_columnScrollReact/common/types';

function FakeContextProviderForNavigation(props: {
    children: JSX.Element;
    position?: number;
    leftEdgeState?: IColumnScrollContext['leftEdgeState'];
    rightEdgeState?: IColumnScrollContext['rightEdgeState'];
    setPositionCallback?: IColumnScrollContext['setPosition'];
}): JSX.Element {
    const contextRefForHandlersOnly = React.useRef<IColumnScrollContext>();

    const context = React.useMemo<IColumnScrollContext>(
        () => ({
            contextRefForHandlersOnly,
            SELECTORS,
            viewPortWidth: 600,
            contentWidth: 1600,
            startFixedWidth: 300,
            endFixedWidth: 0,
            position: props.position || 20.124,
            leftEdgeState: props.leftEdgeState,
            rightEdgeState: props.rightEdgeState,
            setPosition: props.setPositionCallback || jest.fn(),
            isNeedByWidth: true,

            isScrollbarDragging: false,
            updateSizes: jest.fn(),
            isMobile: false,
            isMobileScrolling: false,
            setIsMobileScrolling: jest.fn(),
            mobileSmoothedScrollPosition: undefined,
            setIsScrollbarDragging: jest.fn(),
        }),
        []
    );

    contextRefForHandlersOnly.current = context;

    return (
        <ColumnScrollContext.Provider value={context}>
            {props.children}
        </ColumnScrollContext.Provider>
    );
}

describe('ControlsUnit/columnScrollReact/NavigationComponent', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    describe('with context and consumer.', () => {
        describe('snapshots with different prop[mode].', () => {
            const testCases: INavigationComponentProps['mode'][] = [
                'arrows',
                'scrollbar',
                undefined,
            ];

            testCases.forEach((mode: INavigationComponentProps['mode']) => {
                it(`mode=${mode}`, () => {
                    const { asFragment } = renderAnyComponent(
                        <FakeContextProviderForNavigation>
                            <NavigationComponent mode={mode} />
                        </FakeContextProviderForNavigation>,
                        { container }
                    );
                    expect(asFragment()).toMatchSnapshot();
                });
            });
        });

        describe('should pass right props isLeftEnabled and isRightEnabled, depends on context props leftEdgeState and rightEdgeState.', () => {
            const testCases: [EdgeState, EdgeState][] = [
                [EdgeState.Visible, EdgeState.Invisible],
                [EdgeState.Invisible, EdgeState.Invisible],
                [EdgeState.Invisible, EdgeState.Visible],
                ...(AnimationSteps.map((step) => {
                    return [step.leftEdgeState, step.rightEdgeState];
                }) as [EdgeState, EdgeState][]),
            ];

            testCases.forEach(([leftEdgeState, rightEdgeState]) => {
                it(`leftEdgeState=${leftEdgeState}, rightEdgeState=${rightEdgeState}`, () => {
                    const { asFragment } = renderAnyComponent(
                        <FakeContextProviderForNavigation
                            leftEdgeState={leftEdgeState}
                            rightEdgeState={rightEdgeState}
                        >
                            <NavigationComponent mode="arrows" />
                        </FakeContextProviderForNavigation>,
                        { container }
                    );
                    expect(asFragment()).toMatchSnapshot();
                });
            });
        });

        it('should set new position t context on arrow click', async () => {
            const setPositionCallback = jest.fn();

            const { getByQA } = renderAnyComponent(
                <FakeContextProviderForNavigation
                    position={253}
                    setPositionCallback={setPositionCallback}
                >
                    <NavigationComponent mode="arrows" />
                </FakeContextProviderForNavigation>,
                { container }
            );

            const rightButton = getByQA('mocked_arrow_right');

            fireEvent.click(rightButton);
            await waitFor(() => {
                expect(setPositionCallback).toBeCalledTimes(1);
                expect(setPositionCallback).lastCalledWith(523, true, PrivateContextUserSymbol);
            });

            const leftButton = getByQA('mocked_arrow_left');

            fireEvent.click(leftButton);
            await waitFor(() => {
                expect(setPositionCallback).toBeCalledTimes(2);
                expect(setPositionCallback).lastCalledWith(0, true, PrivateContextUserSymbol);
            });
        });
    });
});
