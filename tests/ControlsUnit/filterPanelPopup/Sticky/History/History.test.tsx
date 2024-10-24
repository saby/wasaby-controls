/**
 * @jest-environment jsdom
 */
jest.mock('Controls/_filterPanelExtendedItems/Control', () => {
    return {
        __esModule: true,
        default() {
            return <div></div>;
        },
    };
});

import { unmountComponentAtNode } from 'react-dom';
import { Sticky } from 'Controls/filterPanelPopup';
import { WasabyEvents } from 'UICore/Events';
import { getInstance } from 'ControlsUnit/filterPanelPopup/UserEventSetup';
import { getExtendedItems } from 'ControlsUnit/filterPanelPopup/Sticky/ViewMode/Extended/getExtendedItems';
import { screen, render, waitFor } from '@testing-library/react';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';
import { initHistory } from 'ControlsUnit/Filter/HistoryUtilForTests';
import { Store } from 'Controls/HistoryStore';

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

        render(<Sticky items={filterDescription} historyId={'testHistoryId'} />, {
            container,
        });
        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__history-editors');
            }).toThrow();
        });
    });

    it('При открытии окна фильтров с историей - история отображается', async () => {
        const filterDescription = getExtendedItems(3);
        await initHistory('testHistoryId', 1, 'extendedFilter');
        render(<Sticky items={filterDescription} historyId={'testHistoryId'} />, { container });

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__history-editors');
            }).toBeTruthy();
        });
    });

    it('При нажатии на элемент истории он сразу применяется', async () => {
        const filterDescription = getExtendedItems(3);
        const userEvent = getInstance();

        await initHistory('testHistoryId', 1, 'extendedFilter');
        render(<Sticky items={filterDescription} historyId={'testHistoryId'} />, { container });

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
    });

    it('При запинивании всех 10 элементов истории не возникает ошибок', async () => {
        const filterDescription = getExtendedItems(countOfVisibleEditors);
        const userEvent = getInstance();
        await initHistory(
            'testHistoryId',
            countOfVisibleEditors,
            'extendedFilter',
            countOfVisibleEditors - 1
        );
        render(<Sticky items={filterDescription} historyId={'testHistoryId'} />, {
            container,
        });

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__history-editors');
            }).toBeTruthy();
        });

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('FilterViewPanel-history__more');
            }).toBeTruthy();
        });
        await userEvent.click(screen.getByTestId('FilterViewPanel-history__more'));

        const historyList = screen.getByTestId('controls-FilterViewPanel__history-editors-list');
        await userEvent.hover(historyList);

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-itemActions__action PinNull');
            }).toBeTruthy();
        });
        const pinElements = screen.getAllByTestId('controls-itemActions__action PinNull');
        expect(pinElements.length).toBe(1);
        await userEvent.click(pinElements[0]);

        await waitFor(() => {
            expect(Store.getLocal('testHistoryId').pinned?.getCount()).toBe(countOfVisibleEditors);
        });
    });
});
