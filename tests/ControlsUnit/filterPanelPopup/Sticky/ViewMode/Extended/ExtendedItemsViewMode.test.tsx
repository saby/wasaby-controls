/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { Sticky } from 'Controls/filterPanelPopup';
import { WasabyEvents } from 'UICore/Events';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';
import { getExtendedItems } from 'ControlsUnit/filterPanelPopup/Sticky/ViewMode/Extended/getExtendedItems';
import { screen, render } from '@testing-library/react';

describe('Вывод параметров в строку', () => {
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

    it('На редактор фильтра вешается класс при установке опции editorsViewMode', async () => {
        const filterDescription = getExtendedItems(1);

        render(
            <Sticky items={filterDescription} extendedItemsViewMode={'row'} />,
            { container }
        );

        expect(
            screen
                .getByTestId('FilterViewPanel__additional-editor')
                .classList.contains(
                    'controls-FilterViewPanel__additional-editor-popup-in-row'
                )
        ).toBeTruthy();
    });
});
