/**
 * @jest-environment jsdom
 */
jest.mock('Controls/_columnScrollReact/NavigationComponent', () => {
    return {
        __esModule: true,
        default: (props) => {
            return (
                <div data-qa="mocked_ColumnScrollReact__NavigationComponent">
                    <div data-qa="mocked_ColumnScrollReact__NavigationComponent">
                        {JSON.stringify(props, null, 4)}
                    </div>
                </div>
            );
        },
    };
});
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';

import {
    InnerNavigationComponentWrapper,
    IInnerNavigationComponentWrapperProps,
} from 'Controls/_gridColumnScroll/render/view/BeforeItemsContent/NavigationComponentWrapper';
import { DEFAULT_SELECTORS, getSelectorsState } from 'Controls/_columnScrollReact/common/selectors';

describe('ControlsUnit/gridColumnScroll/render/view/BeforeItemsContent/NavigationComponentWrapper', () => {
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

    describe('Рендер при различных значениях опций stickyColumnsCount и hasMultiSelectColumn.', () => {
        const staticProps: IInnerNavigationComponentWrapperProps = {
            part: undefined,
            mode: undefined,
            isMobileScrolling: undefined,
            hasGridStickyHeader: undefined,
            startFixedWidth: 100,
            endFixedWidth: 0,
            contentWidth: 1000,
            viewPortWidth: 500,
            SELECTORS: getSelectorsState(DEFAULT_SELECTORS),
        };
        const parts: IInnerNavigationComponentWrapperProps['part'][] = ['fixed', 'scrollable'];
        const modes: IInnerNavigationComponentWrapperProps['mode'][] = ['scrollbar', 'arrows'];
        const hasGridStickyHeaderVariants: IInnerNavigationComponentWrapperProps['hasGridStickyHeader'][] =
            [true, false];
        const isMobileScrollingVariants: IInnerNavigationComponentWrapperProps['isMobileScrolling'][] =
            [true, false];

        parts.forEach((part) => {
            modes.forEach((mode) => {
                hasGridStickyHeaderVariants.forEach((hasGridStickyHeader) => {
                    isMobileScrollingVariants.forEach((isMobileScrolling) => {
                        it(`part=${part}, mode=${mode}, hasGridStickyHeader=${hasGridStickyHeader}, isMobileScrolling=${isMobileScrolling}`, () => {
                            const { asFragment } = render(
                                <InnerNavigationComponentWrapper
                                    {...staticProps}
                                    part={part}
                                    mode={mode}
                                    hasGridStickyHeader={hasGridStickyHeader}
                                    isMobileScrolling={isMobileScrolling}
                                />,
                                {
                                    container,
                                }
                            );

                            expect(asFragment()).toMatchSnapshot();
                        });
                    });
                });
            });
        });
    });
});
