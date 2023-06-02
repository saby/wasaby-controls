/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { Sticky } from 'Controls/filterPanelPopup';
import { WasabyEvents } from 'UICore/Events';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';
import { getInstance } from 'ControlsUnit/filterPanelPopup/UserEventSetup';
import { getExtendedItems } from 'ControlsUnit/filterPanelPopup/Sticky/ViewMode/Extended/getExtendedItems';
import { screen, render, waitFor } from '@testing-library/react';

function getExtendedBlock(container: HTMLElement): HTMLElement {
    return container.querySelector(
        '.controls-FilterViewPanel__additional-editors'
    );
}

describe(
    'Controls/filterPanelPopup:Sticky отображение и скрытие колонок ' +
        '"Можно отобрать" при выборе параметров в фильтре',
    () => {
        setTestID(117229470);

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

        it('При выборе фильтра из колонки, записи в колонке смещаются', async () => {
            const filterDescription = getExtendedItems(13);

            const userEvent = getInstance();

            render(
                <Sticky
                    items={filterDescription}
                    historyId={'testHistoryId'}
                />,
                { container }
            );

            await userEvent.click(screen.getByText('extendedFilterCaption-1'));
            await screen.findByText('extendedFilterCaption-6');

            expect(getExtendedBlock(container)).toMatchSnapshot();
        });

        it('При выборе всех фильтров из колонки, правая колонка перемещается влево', async () => {
            const filterDescription = getExtendedItems(2);

            const userEvent = getInstance();

            render(<Sticky items={filterDescription} />, { container });

            await userEvent.click(screen.getByText('extendedFilterCaption-0'));
            await waitFor(() => {
                expect(() => {
                    return screen.getByTestId(
                        'controls-FilterViewPanel__additional_left-column'
                    );
                }).toThrow();
            });
        });
    }
);
