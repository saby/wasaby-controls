/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import PositionDependentStylesComponent from 'Controls/_columnScrollReact/ApplyCssTransform/PositionDependentStylesComponent';
import { SELECTORS } from '../SelectorsForTests';
import { renderStyleInnerPureComponent } from '../forTestsOnly/helpers';

describe('ControlsUnit/columnScrollReact/ApplyCssTransform/PositionDependentStylesComponent', () => {
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

    it('styles for integer.', () => {
        const { getStyleTag } = renderStyleInnerPureComponent(
            <PositionDependentStylesComponent
                selectors={SELECTORS}
                position={107}
            />,
            { container }
        );
        expect(getStyleTag()).toMatchSnapshot();
    });

    it('styles for float.', () => {
        const { getStyleTag } = renderStyleInnerPureComponent(
            <PositionDependentStylesComponent
                selectors={SELECTORS}
                position={231.324}
            />,
            { container }
        );
        expect(getStyleTag()).toMatchSnapshot();
    });
});
