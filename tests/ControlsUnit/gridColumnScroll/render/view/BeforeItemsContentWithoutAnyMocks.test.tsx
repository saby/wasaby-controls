/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import { render } from '@testing-library/react';

import {
    default as BeforeItemsContent,
    IBeforeItemsContentProps,
} from 'Controls/_gridColumnScroll/render/view/BeforeItemsContent';
import { ColumnScrollContext, IColumnScrollContext } from 'Controls/columnScrollReact';
import { EdgeState } from 'Controls/_columnScrollReact/common/types';
import { getSelectorsState, DEFAULT_SELECTORS } from 'Controls/_columnScrollReact/common/selectors';
import {
    Container as ResizeObserverContainer
} from 'Controls/resizeObserver';

function FakeContextBase(
    props: Pick<
        IColumnScrollContext,
        | 'startFixedWidth'
        | 'contentWidth'
        | 'viewPortWidth'
        | 'position'
        | 'isNeedByWidth'
        | 'leftEdgeState'
        | 'rightEdgeState'
    > & {
        children: JSX.Element;
    }
): JSX.Element {
    const contextRefForHandlersOnly = React.useRef<IColumnScrollContext>();

    const context = React.useMemo<IColumnScrollContext>(() => {
        const value: IColumnScrollContext = {
            contextRefForHandlersOnly,
            SELECTORS: getSelectorsState(DEFAULT_SELECTORS),
            isMobileScrolling: false,
            isMobile: false,
            mobileSmoothedScrollPosition: undefined,
            setIsMobileScrolling: jest.fn(),
            setPosition: jest.fn(),
            updateSizes: jest.fn(),
            endFixedWidth: 0,
            isScrollbarDragging: false,
            setIsScrollbarDragging: jest.fn(),
            ...props,
        };

        contextRefForHandlersOnly.current = value;

        return value;
    }, []) as IColumnScrollContext;

    return (
        <ResizeObserverContainer>
            <ColumnScrollContext.Provider value={context}>
                {props.children}
            </ColumnScrollContext.Provider>
        </ResizeObserverContainer>
    );
}

function FakeScrollContextWithColumnScroll(props: { children: JSX.Element }): JSX.Element {
    return (
        <FakeContextBase
            children={props.children}
            viewPortWidth={500}
            startFixedWidth={100}
            contentWidth={1000}
            position={0}
            leftEdgeState={EdgeState.Visible}
            rightEdgeState={EdgeState.Invisible}
            isNeedByWidth={true}
        />
    );
}

function FakeScrollContextWithColumnScrollPositionEnd(props: {
    children: JSX.Element;
}): JSX.Element {
    return (
        <FakeContextBase
            children={props.children}
            viewPortWidth={600}
            startFixedWidth={50}
            contentWidth={1000}
            position={400}
            leftEdgeState={EdgeState.Visible}
            rightEdgeState={EdgeState.Invisible}
            isNeedByWidth={true}
        />
    );
}

function FakeScrollContextWithoutColumnScroll(props: { children: JSX.Element }): JSX.Element {
    return (
        <FakeContextBase
            children={props.children}
            viewPortWidth={500}
            startFixedWidth={0}
            contentWidth={500}
            position={0}
            leftEdgeState={EdgeState.Visible}
            rightEdgeState={EdgeState.Visible}
            isNeedByWidth={false}
        />
    );
}

describe('ControlsUnit/gridColumnScroll/render/view/BeforeItemsContentWithoutAnyMocks', () => {
    let originResizeObserver;
    let container = null;

    beforeAll(() => {
        originResizeObserver = global.ResizeObserver;
        global.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
    });

    afterAll(() => {
        global.ResizeObserver = originResizeObserver;
    });

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

    // FIXME: Большинство снапшотов падает из за ошибок в стики шапках.
    //  Выписана ошибка, по ней снапшоты должны быть обновлены, но тест меняться НЕ ДОЛЖЕН.
    //  https://online.sbis.ru/opendoc.html?guid=fa605c0d-c8a9-4cbf-8275-20982c996243&client=3

    describe(
        'Тесты без моков для проверки стыка логики gridColumnScroll, columnScrollReact и gridReact. \n' +
            'Рендер при различных значениях опций part, columnScrollViewMode и columnScrollNavigationPosition.',
        () => {
            const staticProps: Omit<
                IBeforeItemsContentProps,
                'part' | 'hasResizer' | 'columnScrollViewMode' | 'columnScrollNavigationPosition'
            > = {
                hasMultiSelectColumn: false,
                stickyColumnsCount: 2,
                endStickyColumnsCount: 0,
                hasGridStickyHeader: true,
                columnsCount: 6,
                hasColumnScrollCustomAutoScrollTargets: true,
            };

            const parts: IBeforeItemsContentProps['part'][] = ['fixed', 'scrollable'];
            const columnScrollViewModes: IBeforeItemsContentProps['columnScrollViewMode'][] = [
                'arrows',
                'scrollbar',
                'unaccented',
            ];
            const columnScrollNavigationPositions: IBeforeItemsContentProps['columnScrollNavigationPosition'][] =
                ['custom', undefined];

            const hasResizerVariants = [true, false];

            const providers: [React.FC, string][] = [
                [FakeScrollContextWithColumnScroll as React.FC, 'WithColumnScroll'],
                [
                    FakeScrollContextWithColumnScrollPositionEnd as React.FC,
                    'WithColumnScrollPositionEnd',
                ],
                [FakeScrollContextWithoutColumnScroll as React.FC, 'WithoutColumnScroll'],
            ];

            const test = (
                part: IBeforeItemsContentProps['part'],
                columnScrollViewMode: IBeforeItemsContentProps['columnScrollViewMode'],
                hasResizer: boolean,
                columnScrollNavigationPosition: IBeforeItemsContentProps['columnScrollNavigationPosition'],
                [ContextProvider, contextName]: [React.FC, string]
            ) => {
                it(
                    `part=${part}, ` +
                        `columnScrollViewMode=${columnScrollViewMode}, ` +
                        `hasResizer=${hasResizer}, ` +
                        `columnScrollNavigationPosition=${columnScrollNavigationPosition}, ` +
                        `contextName=${contextName}`,
                    () => {
                        const { asFragment } = render(
                            <ContextProvider>
                                <BeforeItemsContent
                                    {...staticProps}
                                    part={part}
                                    hasResizer={hasResizer}
                                    columnScrollViewMode={columnScrollViewMode}
                                    columnScrollNavigationPosition={columnScrollNavigationPosition}
                                />
                            </ContextProvider>,
                            {
                                container,
                                wrapper: (props) => {
                                    return <div className="wrapper">{props.children}</div>;
                                },
                            }
                        );

                        expect(asFragment()).toMatchSnapshot();
                    }
                );
            };

            parts.forEach((part) => {
                columnScrollViewModes.forEach((columnScrollViewMode) => {
                    columnScrollNavigationPositions.forEach((columnScrollNavigationPosition) => {
                        hasResizerVariants.forEach((hasResizer) => {
                            providers.forEach((providerParams) => {
                                test(
                                    part,
                                    columnScrollViewMode,
                                    hasResizer,
                                    columnScrollNavigationPosition,
                                    providerParams
                                );
                            });
                        });
                    });
                });
            });
        }
    );
});
