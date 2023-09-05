/**
 * @jest-environment jsdom
 */
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ButtonType } from 'Controls-meta/controls';
import { PropertyGridPopup } from 'Controls-editors/propertyGridPopup';
import { WasabyEvents } from 'UICore/Events';

describe('Controls-editors/_propertyGridPopup/PropertyGridPopup', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        WasabyEvents.initInstance(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    it('PropertyGridPopup корректно рендерится', () => {
        act(() => {
            render(
                <PropertyGridPopup
                    metaType={ButtonType}
                    value={ButtonType.getDefaultValue()}
                    onChange={jest.fn()}
                    onClose={jest.fn()}
                />,
                container
            );
        });

        expect(container).toMatchSnapshot();
    });
});
