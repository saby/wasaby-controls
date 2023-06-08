/**
 * @jest-environment jsdom
 */
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ButtonType } from 'Controls-meta/controls';
import { ObjectEditorPopup } from 'Controls-editors/objectEditorPopup';
import { WasabyEvents } from 'UICore/Events';

describe('Controls-editors/_objectEditorPopup/ObjectEditorPopup', () => {
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

    it('ObjectEditorPopup корректно рендерится', () => {
        act(() => {
            render(
                <ObjectEditorPopup
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
