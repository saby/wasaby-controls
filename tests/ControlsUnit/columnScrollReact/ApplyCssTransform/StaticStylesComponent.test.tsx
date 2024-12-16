/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import StaticStylesComponent from 'Controls/_columnScrollReact/ApplyCssTransform/StaticStylesComponent';
import { SELECTORS } from '../SelectorsForTests';
import { renderStyleInnerPureComponent } from '../forTestsOnly/helpers';

describe('ControlsUnit/columnScrollReact/ApplyCssTransform/StaticStylesComponent', () => {
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

    it('should render static styles.', () => {
        const { getStyleTag } = renderStyleInnerPureComponent(
            <StaticStylesComponent selectors={SELECTORS} />,
            { container }
        );
        expect(getStyleTag()).toMatchSnapshot();
    });
});
