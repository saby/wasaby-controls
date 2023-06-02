/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import { renderAnyComponent } from '../../forTestsOnly/helpers';

import {
    default as BeforeItemsContent,
    IBeforeItemsContentProps,
} from 'Controls/_gridColumnScroll/render/view/BeforeItemsContent';
import { ColumnScrollContext, IColumnScrollContext } from 'Controls/columnScrollReact';
import { getSelectorsState, DEFAULT_SELECTORS } from 'Controls/_columnScrollReact/common/selectors';

function FakeContextProviderForBeforeItemsContent(
    props: Pick<IColumnScrollContext, any>
): JSX.Element {
    const contextRefForHandlersOnly = React.useRef<IColumnScrollContext>();

    const context = React.useMemo<Partial<IColumnScrollContext>>(() => {
        const value = {
            contextRefForHandlersOnly,
            SELECTORS: getSelectorsState(DEFAULT_SELECTORS),
            updateSizes: () => {},
        } as unknown as IColumnScrollContext;

        contextRefForHandlersOnly.current = value;

        return value;
    }, []) as IColumnScrollContext;

    return (
        <ColumnScrollContext.Provider value={context}>
            {props.children}
        </ColumnScrollContext.Provider>
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
                hasGridStickyHeader: true,
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

            const test = (
                part: IBeforeItemsContentProps['part'],
                columnScrollViewMode: IBeforeItemsContentProps['columnScrollViewMode'],
                hasResizer: boolean,
                columnScrollNavigationPosition: IBeforeItemsContentProps['columnScrollNavigationPosition']
            ) => {
                it(
                    `part=${part}, ` +
                        `columnScrollViewMode=${columnScrollViewMode}, ` +
                        `hasResizer=${hasResizer}, ` +
                        `columnScrollNavigationPosition=${columnScrollNavigationPosition}.`,
                    () => {
                        const { asFragment } = renderAnyComponent(
                            <FakeContextProviderForBeforeItemsContent>
                                <BeforeItemsContent
                                    {...staticProps}
                                    part={part}
                                    hasResizer={hasResizer}
                                    columnScrollViewMode={columnScrollViewMode}
                                    columnScrollNavigationPosition={columnScrollNavigationPosition}
                                />
                            </FakeContextProviderForBeforeItemsContent>,
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
                            test(part, columnScrollViewMode, hasResizer, columnScrollNavigationPosition);
                        });
                    });
                });
            });
        }
    );
});
