/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

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
        renderGrid(<EditingDemo inputBackgroundVisibility={'onhover'} />, {
            container,
        });

        const elements = container.getElementsByClassName(
            'controls-EditingTemplateText_InputBackgroundVisibility_onhover'
        );
        expect(elements.length).toBe(9);
    });

    it('should add background if value is visible', () => {
        renderGrid(<EditingDemo inputBackgroundVisibility={'visible'} />, {
            container,
        });

        const elements = container.getElementsByClassName(
            'controls-EditingTemplateText_InputBackgroundVisibility_visible'
        );
        expect(elements.length).toBe(9);
    });

    it('should add bottom border if value is visible', () => {
        renderGrid(<EditingDemo inputBackgroundVisibility={'visible'} />, {
            container,
        });

        const elements = container.getElementsByClassName(
            'controls-EditingTemplateText_borderBottom'
        );
        expect(elements.length).toBe(9);
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
            expect(elements.length).toBe(9);
        });
    });
});
