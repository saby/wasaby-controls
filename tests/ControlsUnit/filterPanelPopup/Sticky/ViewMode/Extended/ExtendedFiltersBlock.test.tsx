/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { Sticky } from 'Controls/filterPanelPopup';
import { WasabyEvents } from 'UICore/Events';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';
import { getInstance } from 'ControlsUnit/filterPanelPopup/UserEventSetup';
import { screen, waitFor, render } from '@testing-library/react';
import { TFilterItemViewMode } from 'Controls/filter';
import 'Controls/filterPanelEditors';

describe(
    'Controls/filterPanelPopup:Sticky отображение и скрытие блока ' +
        '"Можно отобрать" при выборе параметров в фильтре',
    () => {
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

        it('При выборе всех фильтров из дополнительного блока он скрывается', async () => {
            const filterDescription = [
                {
                    name: 'extendedFilter',
                    value: false,
                    resetValue: false,
                    viewMode: 'extended' as TFilterItemViewMode,
                    extendedCaption: 'extendedFilterCaption',
                    editorTemplateName: 'Controls/filterPanelEditors:Boolean',
                    editorOptions: {
                        value: true,
                    },
                },
            ];
            const userEvent = getInstance();

            render(<Sticky items={filterDescription} />, { container });

            await userEvent.click(screen.getByText('extendedFilterCaption'));

            await waitFor(() => {
                expect(() => {
                    return screen.getByTestId('controls-FilterViewPanel__additional-editors');
                }).toThrow();
            });
        });
    }
);
