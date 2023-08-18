/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { Sticky } from 'Controls/filterPanelPopup';
import { WasabyEvents } from 'UICore/Events';
import { getInstance } from 'ControlsUnit/filterPanelPopup/UserEventSetup';
import { getExtendedItems } from 'ControlsUnit/filterPanelPopup/Sticky/ViewMode/Extended/getExtendedItems';
import { screen, render, waitFor } from '@testing-library/react';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';
import { resetHistory } from 'ControlsUnit/filterPanelPopup/Sticky/History/HistorySource';
import { AdaptiveInitializer } from 'UI/Adaptive';

const countOfVisibleEditors = 10;

describe('Controls/filterPanelPopup:Sticky отображение и применение фильтров в блоке Ранее отбирались', () => {
    let container = null;

    const srcIntersectionObserver = window.IntersectionObserver;
    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);

        const mockIntersectionObserver = jest.fn();
        mockIntersectionObserver.mockReturnValue({
            observe: () => {
                return null;
            },
            unobserve: () => {
                return null;
            },
            disconnect: () => {
                return null;
            },
        });
        window.IntersectionObserver = mockIntersectionObserver;
    });
    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
        window.IntersectionObserver = srcIntersectionObserver;
    });

    it('При первом открытии история отсутствует', async () => {
        const filterDescription = getExtendedItems(3);

        render(
            <AdaptiveInitializer>
                <Sticky items={filterDescription} historyId={'testHistoryIdWithoutData'} />
            </AdaptiveInitializer>,
            {
                container,
            }
        );
        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__history-editors');
            }).toThrow();
        });
        resetHistory();
    });

    it('При открытии окна фильтров с историей - история отображается', async () => {
        const filterDescription = getExtendedItems(3);

        render(
            <AdaptiveInitializer>
                <Sticky items={filterDescription} historyId={'testHistoryId'} />
            </AdaptiveInitializer>,
            { container }
        );

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__history-editors');
            }).toBeTruthy();
        });
        resetHistory();
    });

    it('При нажатии на элемент истории он сразу применяется', async () => {
        const filterDescription = getExtendedItems(3);
        const userEvent = getInstance();

        render(
            <AdaptiveInitializer>
                <Sticky items={filterDescription} historyId={'testHistoryId'} />
            </AdaptiveInitializer>,
            { container }
        );

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__history-editor');
            }).toBeTruthy();
        });

        await userEvent.click(screen.getByTestId('controls-FilterViewPanel__history-editor'));

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__basic-editors');
            }).toBeTruthy();
        });
        resetHistory();
    });

    it('При запинивании всех 10 элементов истории не возникает ошибок', async () => {
        const filterDescription = getExtendedItems(countOfVisibleEditors);
        const userEvent = getInstance();
        render(
            <AdaptiveInitializer>
                <Sticky items={filterDescription} historyId={'testHistoryIdAll'} />
            </AdaptiveInitializer>,
            { container }
        );

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__history-editors');
            }).toBeTruthy();
        });
        await userEvent.click(screen.getByTestId('FilterViewPanel-history__more'));

        const editorElements = screen.getAllByTestId('controls-FilterViewPanel__history-editor');
        const hoverFunction = async (item) => {
            await userEvent.hover(item);
        };
        const hoverPromises = editorElements.map(hoverFunction);
        await Promise.all(hoverPromises);

        let pinElements;
        await waitFor(() => {
            pinElements = screen.getAllByTestId('controls-itemActions__action PinNull');
            expect(pinElements.length).toBe(countOfVisibleEditors);
        });
        const pinClickFunction = async (item) => {
            await userEvent.click(item);
        };
        const promises = pinElements.map(pinClickFunction);
        await Promise.all(promises);

        await waitFor(() => {
            pinElements = screen.getAllByTestId('controls-itemActions__action PinOff');
            expect(pinElements.length).toBe(countOfVisibleEditors);
            resetHistory();
        });
    });
});
