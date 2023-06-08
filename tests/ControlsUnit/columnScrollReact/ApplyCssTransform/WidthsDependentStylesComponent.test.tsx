/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import WidthsDependentStylesComponent from 'Controls/_columnScrollReact/ApplyCssTransform/WidthsDependentStylesComponent';
import { SELECTORS } from '../SelectorsForTests';
import { renderStyleInnerPureComponent } from '../forTestsOnly/helpers';

describe('ControlsUnit/columnScrollReact/ApplyCssTransform/WidthsDependentStylesComponent', () => {
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

    it('should render width styles.', () => {
        const { getStyleTag } = renderStyleInnerPureComponent(
            <WidthsDependentStylesComponent
                selectors={SELECTORS}
                fixedWidth={702}
            />,
            { container }
        );
        expect(getStyleTag()).toMatchSnapshot();
    });
});
