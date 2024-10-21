/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { Sticky } from 'Controls/filterPanelPopup';
import { TFilterItemViewMode } from 'Controls/filter';
import { WasabyEvents } from 'UICore/Events';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';
import { getInstance } from 'ControlsUnit/filterPanelPopup/UserEventSetup';
import { screen, waitFor, render } from '@testing-library/react';
import 'ControlsUnit/Filter/Utils/FilterVisibilityCallback';

describe('Controls/filterPanelPopup:Sticky сброс значений для редакторов с viewMode: basic', () => {
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

    it('После сброса параметры с viewMode: basic должны остаться в основном блоке фильтров', async () => {
        const filterDescription = [
            {
                name: 'basicFilter',
                viewMode: 'basic' as TFilterItemViewMode,
                value: ['test'],
                resetValue: [null],
                editorTemplateName: 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests',
            },
            {
                name: 'basicFilter2',
                viewMode: 'basic' as TFilterItemViewMode,
                value: ['test'],
                resetValue: [null],
                filterVisibilityCallback: 'ControlsUnit/Filter/Utils/FilterVisibilityCallback',
            },
        ];
        const userEvent = getInstance();
        const filter = {
            hideEditor: true,
        };

        render(<Sticky items={filterDescription} filter={filter} />, { container });
        const resetButton = await screen.getByTestId('controls-FilterPanelPopup__reset-button');
        await userEvent.click(resetButton);

        /* Проверяем:
          1) Кнопка применения фильтра должна отображаться
          2) Кнопка "Сбросить" должна быть скрыта
          3) Блок основных фильтров отображается
          4) Блок extended фильтров должен быть скрыт */
        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__additional-editors');
            }).toThrow();
        });

        await waitFor(() => {
            expect(!!screen.getByTestId('controls-FilterPanelPopup__applyButton')).toBeTruthy();
        });

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__additional-editors');
            }).toThrow();
        });

        await waitFor(() => {
            expect(!!screen.getByTestId('controls-FilterViewPanel__basic-editors')).toBeTruthy();
        });

        await waitFor(() => {
            expect(screen.getAllByTestId('controls-PropertyGrid__editor').length).toBe(1);
        });
    });
});
