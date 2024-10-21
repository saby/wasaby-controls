/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { Sticky } from 'Controls/filterPanelPopup';
import { TFilterItemViewMode } from 'Controls/filter';
import { render, screen } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';
import 'ControlsUnit/filterPanelPopup/Sticky/items/filterVisibilityCallback/callback';

describe('Controls/filterPanelPopup:Sticky тесты filterVisibilityCallback', () => {
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

    it('filterVisibility callback вызывается при построении, редакторы скрываются', () => {
        const filterDescription = [
            {
                name: 'hiddenItem',
                viewMode: 'basic' as TFilterItemViewMode,
                value: ['test'],
                resetValue: [null],
                editorTemplateName: 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests',
                filterVisibilityCallback:
                    'ControlsUnit/filterPanelPopup/Sticky/items/filterVisibilityCallback/callback',
            },
            {
                name: 'item',
                viewMode: 'basic' as TFilterItemViewMode,
                value: [null],
                resetValue: [null],
                editorTemplateName: 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests',
                filterVisibilityCallback:
                    'ControlsUnit/filterPanelPopup/Sticky/items/filterVisibilityCallback/callback',
            },
        ];

        const filter = {
            serviceField: 'forTest',
        };

        render(<Sticky items={filterDescription} filter={filter} />, { container });
        expect(screen.getAllByTestId('controls-PropertyGrid__editor').length).toBe(1);
    });
});
