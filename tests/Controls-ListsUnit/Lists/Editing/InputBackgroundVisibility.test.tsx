/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import EditingDemo from 'Controls-demo/gridReact/Editing/EditByCells';

describe('Controls-ListsUnit/Lists/Editing/InputBackgroundVisibility', () => {
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

    it('by default should not add background', () => {
        renderGrid(<EditingDemo />, { container });

        let elements = container.getElementsByClassName(
            'controls-EditingTemplateText_InputBackgroundVisibility_onhover'
        );
        expect(elements.length).toBe(0);
        elements = container.getElementsByClassName(
            'controls-EditingTemplateText_InputBackgroundVisibility_visible'
        );
        expect(elements.length).toBe(0);
    });

    it('should add background by hover', () => {
        const { getItems } = renderGrid(<EditingDemo inputBackgroundVisibility={'onhover'} />, {
            container,
        });

        const elements = container.getElementsByClassName(
            'controls-EditingTemplateText_InputBackgroundVisibility_onhover'
        );

        // Первые ячейки во второй и третьей строке не могут редактироваться (getCellProps().editable === false)
        expect(elements.length).toBe(7);

        const items = getItems();

        expect(
            getCell(items[1], 0).querySelector(
                '.controls-EditingTemplateText_InputBackgroundVisibility_onhover'
            )
        ).toBeFalsy();

        expect(
            getCell(items[2], 0).querySelector(
                '.controls-EditingTemplateText_InputBackgroundVisibility_onhover'
            )
        ).toBeFalsy();
    });

    it('should add background if value is visible', () => {
        const { getItems } = renderGrid(<EditingDemo inputBackgroundVisibility={'visible'} />, {
            container,
        });

        const elements = container.getElementsByClassName(
            'controls-EditingTemplateText_InputBackgroundVisibility_visible'
        );
        expect(elements.length).toBe(7);

        const items = getItems();

        expect(
            getCell(items[1], 0).querySelector(
                '.controls-EditingTemplateText_InputBackgroundVisibility_visible'
            )
        ).toBeFalsy();

        expect(
            getCell(items[2], 0).querySelector(
                '.controls-EditingTemplateText_InputBackgroundVisibility_visible'
            )
        ).toBeFalsy();
    });

    it('should add bottom border if value is visible', () => {
        const { getItems } = renderGrid(<EditingDemo inputBackgroundVisibility={'visible'} />, {
            container,
        });

        const elements = container.getElementsByClassName(
            'controls-EditingTemplateText_borderBottom'
        );
        expect(elements.length).toBe(7);

        const items = getItems();

        expect(
            getCell(items[1], 0).querySelector('.controls-EditingTemplateText_borderBottom')
        ).toBeFalsy();

        expect(
            getCell(items[2], 0).querySelector('.controls-EditingTemplateText_borderBottom')
        ).toBeFalsy();
    });

    it('should rerender if change inputBackgroundVisibility', async () => {
        renderGrid(<EditingDemo inputBackgroundVisibility={'visible'} />, {
            container,
        });

        await userEvent.selectOptions(
            screen.getByTestId('input-background-visibility-selector'),
            'onhover'
        );

        await waitFor(() => {
            const elements = container.getElementsByClassName(
                'controls-EditingTemplateText_InputBackgroundVisibility_onhover'
            );
            expect(elements.length).toBe(7);
        });
    });
});
