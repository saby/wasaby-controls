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

    it('should render width styles if need scroll.', () => {
        const { getStyleTag } = renderStyleInnerPureComponent(
            <WidthsDependentStylesComponent
                isNeedByWidth={true}
                selectors={SELECTORS}
                startFixedWidth={702}
                endFixedWidth={100}
                viewPortWidth={1200}
            />,
            { container }
        );
        expect(getStyleTag()).toMatchSnapshot();
    });

    it('should not render width styles if does not need scroll.', () => {
        const { getStyleTag } = renderStyleInnerPureComponent(
            <WidthsDependentStylesComponent
                isNeedByWidth={false}
                selectors={SELECTORS}
                startFixedWidth={702}
                endFixedWidth={100}
                viewPortWidth={1200}
            />,
            { container }
        );
        expect(getStyleTag()).toMatchSnapshot();
    });
});
