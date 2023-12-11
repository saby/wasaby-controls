/**
 * @jest-environment jsdom
 */
jest.mock('Controls/_filterPanel/ExtendedItems', () => {
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
import { screen, render, waitFor, within } from '@testing-library/react';
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
                <Sticky items={filterDescription} historyId={'testHistory9Pinned'} />
            </AdaptiveInitializer>,
            { container }
        );

        await waitFor(() => {
            expect(() => {
                return screen.getByTestId('controls-FilterViewPanel__history-editors');
            }).toBeTruthy();
        });
        await userEvent.click(screen.getByTestId('FilterViewPanel-history__more'));

        const historyList = screen.getByTestId('controls-FilterViewPanel__history-editors-list');
        await userEvent.hover(historyList);

        const pinElements = screen.getAllByTestId('controls-itemActions__action PinNull');
        expect(pinElements.length).toBe(1);
        await userEvent.click(pinElements[0]);

        await waitFor(() => {
            const pinElements = within(
                within(historyList).getByTestId('items-container')
            ).getAllByTestId('controls-FilterViewPanel__history-editor pinned');
            expect(pinElements.length).toBe(countOfVisibleEditors);
            resetHistory();
        });
    });
});
