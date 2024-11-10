/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import { renderAnyComponent } from '../forTestsOnly/helpers';

import { ScrollbarNavigationComponent } from 'Controls/_columnScrollReact/Navigation/Scrollbar';

describe('ControlsUnit/columnScrollReact/Navigation/WithPlatformScrollbar', () => {
    let originResizeObserver;
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
        originResizeObserver = global.ResizeObserver;
        global.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
        global.ResizeObserver = originResizeObserver;
    });

    it('Базовый рендер с платформенным скроллбаром, без моков', () => {
        const { asFragment } = renderAnyComponent(
            <ScrollbarNavigationComponent
                className="testClassName__scrollBar"
                startFixedWidth={200}
                endFixedWidth={0}
                contentWidth={900}
                viewPortWidth={400}
                position={20}
                readOnly={false}
                scrollBarValign={'bottom'}
                onPositionChangeCallback={() => {}}
                onDraggingChangeCallback={() => {}}
            />,
            { container }
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
