/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { renderAnyComponent } from '../../forTestsOnly/helpers';

import ScrollEventsManager from 'Controls/_columnScrollReact/Mirror/ScrollEventsManager';

describe('ControlsUnit/columnScrollReact/Mirror/ScrollEventsManager/Base', () => {
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

    it('Компонент отображает переданный контент и передает в него нужные обработчики.', () => {
        expect.assertions(4);

        function TestAssertComponent(props) {
            expect(props.onScroll).toBeInstanceOf(Function);
            expect(props.onTouchStart).toBeInstanceOf(Function);
            expect(props.onTouchEnd).toBeInstanceOf(Function);

            return <div>TestContent</div>;
        }

        const { asFragment } = renderAnyComponent(
            <ScrollEventsManager>
                <TestAssertComponent />
            </ScrollEventsManager>,
            { container }
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
