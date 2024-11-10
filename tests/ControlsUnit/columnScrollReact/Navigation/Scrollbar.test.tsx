/**
 * @jest-environment jsdom
 */
jest.mock('Controls/_columnScrollReact/Navigation/PlatformScrollbar/ScrollBarBase', () => {
    return {
        __esModule: true,
        default: (props) => {
            return (
                <div data-qa="mocked_ScrollbarComponent">
                    <div data-qa="mocked_ScrollbarComponent_props">
                        {JSON.stringify(props, null, 4)}
                    </div>
                </div>
            );
        },
    };
});

import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import { renderAnyComponent } from '../forTestsOnly/helpers';

import {
    ScrollbarNavigationComponent,
    IScrollbarNavigationComponentProps,
} from 'Controls/_columnScrollReact/Navigation/Scrollbar';

import { QA_SELECTORS } from 'Controls/columnScrollReact';

describe('ControlsUnit/columnScrollReact/Navigation/Scrollbar', () => {
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

    it('На контрол можно навесить свой класс', () => {
        const props: IScrollbarNavigationComponentProps = {
            startFixedWidth: 100,
            endFixedWidth: 0,
            contentWidth: 1000,
            viewPortWidth: 500,
            position: 0,
        };
        const { getByQA } = renderAnyComponent(
            <ScrollbarNavigationComponent {...props} className="testClassName__scrollBar" />,
            { container }
        );

        const scrollBarContainer = getByQA(QA_SELECTORS.NAVIGATION_SCROLLBAR) as HTMLDivElement;

        expect(
            scrollBarContainer.className.indexOf('testClassName__scrollBar') !== -1
        ).toBeTruthy();
    });

    describe('Платформенному скроллбару должны проксироваться опции.', () => {
        const testCases: IScrollbarNavigationComponentProps[] = [
            // Только обязательные
            {
                startFixedWidth: 100,
                endFixedWidth: 0,
                contentWidth: 1000,
                viewPortWidth: 500,
                position: 0,
            },
            // Полные
            {
                startFixedWidth: 200,
                endFixedWidth: 0,
                contentWidth: 900,
                viewPortWidth: 400,
                position: 20,
                className: 'testClassName__1__scrollBar',
                readOnly: true,
                scrollBarValign: 'bottom',
            },
        ];

        testCases.forEach((props, index) => {
            it(`case #${index}.`, () => {
                const { asFragment } = renderAnyComponent(
                    <ScrollbarNavigationComponent {...props} />,
                    { container }
                );
                expect(asFragment()).toMatchSnapshot();
            });
        });
    });
});
