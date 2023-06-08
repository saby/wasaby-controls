/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import EditingDemo from 'Controls-demo/gridReact/Editing/EditByCells';

describe('Controls-ListsUnit/Lists/Editing/InputBorderVisibility', () => {
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

    it('by default should not add border', () => {
        renderGrid(<EditingDemo />, { container });

        const elements = container.getElementsByClassName(
            'controls-EditingTemplateText_borderBottom'
        );
        expect(elements.length).toBe(0);
    });

    it('should add border if value is partial', () => {
        renderGrid(<EditingDemo inputBorderVisibility={'partial'} />, {
            container,
        });

        const elements = container.getElementsByClassName(
            'controls-EditingTemplateText_borderBottom'
        );
        expect(elements.length).toBe(9);
    });

    it('should rerender if change inputBorderVisibility', async () => {
        renderGrid(<EditingDemo inputBorderVisibility={'hidden'} />, {
            container,
        });

        await userEvent.selectOptions(
            screen.getByTestId('input-border-visibility-selector'),
            'partial'
        );

        await waitFor(() => {
            const elements = container.getElementsByClassName(
                'controls-EditingTemplateText_borderBottom'
            );
            expect(elements.length).toBe(9);
        });
    });
});
