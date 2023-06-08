/**
 * @jest-environment jsdom
 */
jest.mock('Controls/_gridColumnScroll/render/view/BeforeItemsContent/NavigationRow', () => {
    return {
        __esModule: true,
        default: (props) => {
            return (
                <div data-qa="mocked_NavigationRow">
                    <div data-qa="mocked_NavigationRow_props">{JSON.stringify(props, null, 4)}</div>
                </div>
            );
        },
    };
});

jest.mock('Controls/_gridColumnScroll/render/view/BeforeItemsContent/ContentObserverRow', () => {
    return {
        __esModule: true,
        default: (props) => {
            return (
                <div data-qa="mocked_ContentObserverRow">
                    <div data-qa="mocked_ContentObserverRow">{JSON.stringify(props, null, 4)}</div>
                </div>
            );
        },
    };
});

import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import { renderAnyComponent } from '../../forTestsOnly/helpers';

import {
    default as BeforeItemsContent,
    IBeforeItemsContentProps,
} from 'Controls/_gridColumnScroll/render/view/BeforeItemsContent';

describe('ControlsUnit/gridColumnScroll/render/view/BeforeItemsContent', () => {
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

    it(
        'Нужно всегда рендерить переданный в опциях beforeItemsContent. ' +
            'Горизонтальный скролл расширяет функционал, а не перебивает его.',
        () => {
            const { asFragment } = renderAnyComponent(
                <BeforeItemsContent
                    part={'scrollable'}
                    columnScrollViewMode={'scrollbar'}
                    columnScrollNavigationPosition={undefined}
                    hasMultiSelectColumn={false}
                    stickyColumnsCount={2}
                    hasGridStickyHeader={true}
                >
                    <div>Какой то базовый контент</div>
                </BeforeItemsContent>,
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

    describe('Рендер при различных значениях опций part, columnScrollViewMode и columnScrollNavigationPosition.', () => {
        const staticProps: IBeforeItemsContentProps = {
            hasMultiSelectColumn: false,
            stickyColumnsCount: 2,
            hasGridStickyHeader: true,

            part: undefined,
            columnScrollViewMode: undefined,
            columnScrollNavigationPosition: undefined,
        };

        const parts: IBeforeItemsContentProps['part'][] = ['fixed', 'scrollable'];
        const columnScrollViewModes: IBeforeItemsContentProps['columnScrollViewMode'][] = [
            'arrows',
            'scrollbar',
            'unaccented',
        ];
        const columnScrollNavigationPositions: IBeforeItemsContentProps['columnScrollNavigationPosition'][] =
            ['custom', undefined];

        parts.forEach((part) => {
            columnScrollViewModes.forEach((columnScrollViewMode) => {
                columnScrollNavigationPositions.forEach((columnScrollNavigationPosition) => {
                    it(`part=${part}, columnScrollViewMode=${columnScrollViewMode}, columnScrollNavigationPosition=${columnScrollNavigationPosition}.`, () => {
                        const { asFragment } = renderAnyComponent(
                            <BeforeItemsContent
                                {...staticProps}
                                part={part}
                                columnScrollViewMode={columnScrollViewMode}
                                columnScrollNavigationPosition={columnScrollNavigationPosition}
                            />,
                            {
                                container,
                                wrapper: (props) => {
                                    return <div className="wrapper">{props.children}</div>;
                                },
                            }
                        );

                        expect(asFragment()).toMatchSnapshot();
                    });
                });
            });
        });
    });
});
