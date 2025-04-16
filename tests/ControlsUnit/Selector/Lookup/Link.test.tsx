/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { Link } from 'Controls/lookup';
import { WasabyEvents } from 'UICore/Events';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';
import { render } from '@testing-library/react';

function getLinkBlock(container: HTMLElement): HTMLElement {
    return container.querySelector('.controls-Lookup__link');
}

describe('Controls/lookup:Link', () => {
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

    it('link render', () => {
        render(<Link caption={'caption '} />, { container });
        expect(getLinkBlock(container)).toMatchSnapshot();
    });
});
