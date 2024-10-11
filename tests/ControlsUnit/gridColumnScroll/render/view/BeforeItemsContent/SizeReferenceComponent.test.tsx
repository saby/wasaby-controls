/**
 * @jest-environment jsdom
 */
import type { IContentObserverComponentProps } from 'Controls/_columnScrollReact/SizeObservers/ContentObserver';

jest.mock('Controls/_columnScrollReact/SizeObservers/ContentObserver', () => {
    return {
        __esModule: true,
        default: (props: IContentObserverComponentProps) => {
            return (
                <>
                    {props.startFixedDiv}
                    {props.scrollableDiv}
                    {props.endFixedDiv}
                </>
            );
        },
    };
});
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';

import ContentObserverRow from 'Controls/_gridColumnScroll/render/view/BeforeItemsContent/ContentObserverRow';

describe('ControlsUnit/gridColumnScroll/render/view/BeforeItemsContent/ContentObserverRow', () => {
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
        const stickyColumnsCountVariants = [0, 1, 3];
        const hasMultiSelectColumnVariants = [true, false];
        const hasResizerVariants = [true, false];

        const test = (
            stickyColumnsCount: number,
            hasMultiSelectColumn: boolean,
            hasResizer: boolean
        ) => {
            it(
                `stickyColumnsCount=${stickyColumnsCount}, ` +
                    `hasMultiSelectColumn=${hasMultiSelectColumn}, ` +
                    `hasResizer=${hasResizer},`,
                () => {
                    const { asFragment } = render(
                        <ContentObserverRow
                            hasResizer={hasResizer}
                            stickyColumnsCount={stickyColumnsCount}
                            endStickyColumnsCount={0}
                            hasMultiSelectColumn={hasMultiSelectColumn}
                        />,
                        {
                            container,
                        }
                    );

                    expect(asFragment()).toMatchSnapshot();
                }
            );
        };

        stickyColumnsCountVariants.forEach((stickyColumnsCount) => {
            hasMultiSelectColumnVariants.forEach((hasMultiSelectColumn) => {
                hasResizerVariants.forEach((hasResizer) => {
                    test(stickyColumnsCount, hasMultiSelectColumn, hasResizer);
                });
            });
        });
    });
});
