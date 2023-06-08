/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import { renderAnyComponent } from '../forTestsOnly/helpers';

import { ScrollbarNavigationComponent } from 'Controls/_columnScrollReact/Navigation/Scrollbar';

describe('ControlsUnit/columnScrollReact/Navigation/WithPlatformScrollbar', () => {
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

    it('Базовый рендер с платформенным скроллбаром, без моков', () => {
        const { asFragment } = renderAnyComponent(
            <ScrollbarNavigationComponent
                className="testClassName__scrollBar"
                fixedWidth={200}
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
