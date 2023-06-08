/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { Sticky } from 'Controls/filterPanelPopup';
import { WasabyEvents } from 'UICore/Events';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';
import { getExtendedItems } from 'ControlsUnit/filterPanelPopup/Sticky/ViewMode/Extended/getExtendedItems';
import { getInstance } from 'ControlsUnit/filterPanelPopup/UserEventSetup';
import { screen, waitFor, render } from '@testing-library/react';

const countOfFilterItemsForExpanderVisible = 13;
const countOfVisibleEditors = 10;

describe('Controls/filterPanelPopup:Sticky отображение кнопки-экпандера в блоке дополнительных фильтров', () => {
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

    it(
        'В блоке дополнительных фильтров отображается кнопка разворота, ' +
            'если элементов в блоке больше определённого стандартом кол-ва',
        async () => {
            const filterDescription = getExtendedItems(
                countOfFilterItemsForExpanderVisible
            );
            render(
                <Sticky
                    items={filterDescription}
                    historyId={'testHistoryId'}
                />,
                { container }
            );
            expect(
                !!screen.getByTestId('FilterViewPanel-additional__more')
            ).toBeTruthy();
            expect(
                screen.getAllByTestId('FilterViewPanel__additional-editor')
                    .length
            ).toBe(countOfVisibleEditors);
        }
    );

    it('Клик по кнопке разворота показывает все редакторы', async () => {
        const filterDescription = getExtendedItems(
            countOfFilterItemsForExpanderVisible
        );
        const userEvent = getInstance();

        render(
            <Sticky items={filterDescription} historyId={'testHistoryId'} />,
            { container }
        );

        await userEvent.click(
            screen.getByTestId('FilterViewPanel-additional__more')
        );

        await waitFor(() => {
            expect(
                screen.getAllByTestId('FilterViewPanel__additional-editor')
                    .length
            ).toBe(countOfVisibleEditors);
        });
    });

    it('Выбор фильтров из дополнительного блока скрывает кнопку разворота', async () => {
        const filterDescription = getExtendedItems(
            countOfFilterItemsForExpanderVisible
        );
        const userEvent = getInstance();

        render(
            <Sticky items={filterDescription} historyId={'testHistoryId'} />,
            { container }
        );

        await userEvent.click(
            screen.getByTestId('FilterViewPanel-additional__more')
        );

        await userEvent.click(screen.getByText('extendedFilterCaption-11'));
        await userEvent.click(screen.getByText('extendedFilterCaption-10'));
        await userEvent.click(screen.getByText('extendedFilterCaption-0'));
        await userEvent.click(screen.getByText('extendedFilterCaption-1'));
        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('FilterViewPanel-additional__more');
            }).toThrow();
        });
    });

    it(
        'Выбор фильтров из одной колонки блока дополнительных фильтров ' +
            'не должен скрывать кнопку разворота',
        async () => {
            const filterDescription = getExtendedItems(
                countOfFilterItemsForExpanderVisible
            );
            const userEvent = getInstance();

            render(
                <Sticky
                    items={filterDescription}
                    historyId={'testHistoryId'}
                />,
                { container }
            );

            await userEvent.click(
                screen.getByTestId('FilterViewPanel-additional__more')
            );

            await userEvent.click(screen.getByText('extendedFilterCaption-11'));
            await userEvent.click(screen.getByText('extendedFilterCaption-10'));
            await waitFor(() => {
                expect(
                    !!screen.getByTestId('FilterViewPanel-additional__more')
                ).toBeTruthy();
            });
        }
    );
});
