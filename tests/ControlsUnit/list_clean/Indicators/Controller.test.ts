import { Collection, EIndicatorState } from 'Controls/display';
import IndicatorsController, {
    IIndicatorsControllerOptions,
} from 'Controls/_baseList/Controllers/IndicatorsController';
import { RecordSet } from 'Types/collection';

function initTest(
    items: object[],
    options: Partial<IIndicatorsControllerOptions> = {},
    metaData: object = {}
): { collection: Collection; controller: IndicatorsController } {
    const recordSet = new RecordSet({
        rawData: items,
        keyProperty: 'id',
        metaData,
    });
    const collection = new Collection({
        collection: recordSet,
        keyProperty: 'id',
    });
    const controller = new IndicatorsController({
        model: collection,
        items: recordSet,
        hasError: () => {
            return false;
        },
        hasHiddenItemsByVirtualScroll: () => {
            return false;
        },
        stopDisplayPortionedSearchCallback: () => {
            return null;
        },
        iterativeLoading: true,
        supportIterativeLoading: true,
        isInfinityNavigation: true,
        ...options,
    } as IIndicatorsControllerOptions);
    return { collection, controller };
}

function getMockedIndicatorElement(): HTMLElement {
    return {
        style: {
            display: '',
            position: '',
            top: '',
            bottom: '',
        },
    } as HTMLElement;
}

describe('Controls/list_clean/Indicators/Controller', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    describe('constructor', () => {
        it('should start portioned search', () => {
            const { collection, controller } = initTest(
                [{ id: 1 }],
                { hasMoreDataToBottom: true, isIterativeLoading: true },
                { iterative: true }
            );
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false); // индикатор покажется только через 2с

            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });
    });

    describe('updateOptions', () => {
        it('changed model', () => {
            const { collection, controller } = initTest([{ id: 1 }], {});
            const newCollection = initTest([{ id: 1 }], {}).collection;

            // через контроллер нужно дожидаться таймера
            collection.displayIndicator('global', EIndicatorState.Loading, 100);
            expect(collection.hasIndicator('global')).toBe(true);

            controller.updateOptions(
                {
                    model: newCollection,
                    supportIterativeLoading: true,
                } as IIndicatorsControllerOptions,
                false
            );
            expect(newCollection.hasIndicator('global')).toBe(false);
        });

        it('changed navigation', () => {
            const options: IIndicatorsControllerOptions = {
                isInfinityNavigation: true,
                hasMoreDataToTop: true,
                hasMoreDataToBottom: true,
                attachLoadTopTriggerToNull: true,
                attachLoadDownTriggerToNull: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                scrollToFirstItem: () => {
                    return null;
                },
                iterativeLoading: true,
            } as unknown as IIndicatorsControllerOptions;
            const { collection, controller } = initTest([{ id: 1 }], options);
            controller.setViewportFilled(true);
            controller.displayTopIndicator(false, false); // верхний индикатор показывается по маусЭнтер
            controller.displayBottomIndicator();
            expect(collection.getTopIndicator().isDisplayed()).toBe(true);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            options.isInfinityNavigation = false;
            controller.updateOptions(
                {
                    items: collection.getSourceCollection() as unknown as RecordSet,
                    model: collection,
                    supportIterativeLoading: true,
                    ...options,
                },
                false
            );
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);
        });

        it('changed has more options', () => {
            const options = {
                isInfinityNavigation: true,
                hasMoreDataToTop: true,
                hasMoreDataToBottom: true,
                attachLoadTopTriggerToNull: true,
                attachLoadDownTriggerToNull: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                scrollToFirstItem: () => {
                    return null;
                },
                iterativeLoading: true,
            } as unknown as IIndicatorsControllerOptions;
            const { collection, controller } = initTest([{ id: 1 }], options);
            controller.setViewportFilled(true);
            controller.displayTopIndicator(false, false); // верхний индикатор показывается по маусЭнтер
            controller.displayBottomIndicator();
            expect(collection.getTopIndicator().isDisplayed()).toBe(true);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            options.hasMoreDataToTop = false;
            options.hasMoreDataToBottom = false;
            controller.updateOptions(
                {
                    items: collection.getSourceCollection() as unknown as RecordSet,
                    model: collection,
                    supportIterativeLoading: true,
                    ...options,
                },
                true
            );
            expect(collection.getTopIndicator().isDisplayed()).toBe(true);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.updateOptions(
                {
                    items: collection.getSourceCollection() as unknown as RecordSet,
                    model: collection,
                    supportIterativeLoading: true,
                    ...options,
                },
                false
            );
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);
        });

        // Возможен след кейс: список пустой, зовется релоад с итеративной загрузкой.
        // Событие rs не сработает и items не пересоздастся. Единственное, что случится это поменяется опция loading
        // Из-за этого мы попадем в updateOptions, в котором по hasMoreData вызовем пересчет ромашки.
        // И именно здесь определим по флагу iterative, показывать порционный поиск или просто ромашку.
        it('display portioned search to bottom by change hasMoreData', () => {
            const options = {
                isInfinityNavigation: true,
                hasMoreDataToTop: false,
                hasMoreDataToBottom: false,
                attachLoadTopTriggerToNull: true,
                attachLoadDownTriggerToNull: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                iterativeLoading: true,
            } as unknown as IIndicatorsControllerOptions;
            const { collection, controller } = initTest([{ id: 1 }], options);

            const items = collection.getSourceCollection() as unknown as RecordSet;
            items.setMetaData({ iterative: true });
            controller.updateOptions(
                {
                    ...options,
                    items,
                    model: collection,
                    isIterativeLoading: true,
                    hasMoreDataToBottom: true,
                    supportIterativeLoading: true,
                },
                false
            );
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            jest.advanceTimersByTime(2001);
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('display portioned search to top by change hasMoreData', () => {
            const options = {
                isInfinityNavigation: true,
                hasMoreDataToTop: false,
                hasMoreDataToBottom: false,
                attachLoadTopTriggerToNull: true,
                attachLoadDownTriggerToNull: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                scrollToFirstItem: () => {
                    return null;
                },
                iterativeLoading: true,
            } as unknown as IIndicatorsControllerOptions;
            const { collection, controller } = initTest([{ id: 1 }], options);

            const items = collection.getSourceCollection() as unknown as RecordSet;
            items.setMetaData({ iterative: true });
            controller.updateOptions(
                {
                    ...options,
                    items,
                    model: collection,
                    isIterativeLoading: true,
                    hasMoreDataToTop: true,
                    supportIterativeLoading: true,
                },
                false
            );
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            jest.advanceTimersByTime(2001);
            expect(collection.getTopIndicator().isDisplayed()).toBe(true);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.destroy(); // уничтожаем все таймеры
        });
    });

    describe('onDataLoad', () => {
        it('not display indicators after reload', () => {
            const options = {
                isInfinityNavigation: true,
                attachLoadTopTriggerToNull: true,
                attachLoadDownTriggerToNull: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                scrollToFirstItem: () => {
                    return null;
                },
            } as unknown as IIndicatorsControllerOptions;
            const { collection, controller } = initTest([{ id: 1 }], options);
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.setHasMoreData(true, true);
            controller.setViewportFilled(true);
            controller.onDataLoad(collection.getSourceCollection());
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);
        });

        it('hide global indicator', async () => {
            const { collection, controller } = initTest([{ id: 1 }], {});
            expect(collection.getGlobalIndicator()).toBeFalsy();
            controller.displayGlobalIndicator(100);
            expect(collection.getGlobalIndicator()).toBeFalsy(); // индикатор покажется только через 2с

            // ждем пока отобразится глобальный индикатор
            jest.advanceTimersByTime(2001);
            expect(collection.getGlobalIndicator()).toBeTruthy();

            controller.onDataLoad(collection.getSourceCollection());
            expect(collection.getGlobalIndicator()).toBeFalsy();

            controller.destroy(); // уничтожаем все таймеры
        });

        it('end portioned search', async () => {
            const { collection, controller } = initTest([{ id: 1 }], {});
            controller.startDisplayPortionedSearch('bottom');
            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.onDataLoad(collection.getSourceCollection());
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('start portioned search', async () => {
            const { collection, controller } = initTest(
                [{ id: 1 }],
                { isIterativeLoading: true },
                { iterative: true }
            );
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.setHasMoreData(false, true);
            controller.onDataLoad(collection.getSourceCollection());
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false); // индикатор покажется только через 2с

            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('hide portioned search indicator', () => {
            const { collection, controller } = initTest([{ id: 1 }], {});

            controller.setHasMoreData(true, false);
            controller.setIterativeLoading(true);
            collection.getSourceCollection().setMetaData({ iterative: true });
            controller.startDisplayPortionedSearch('top');
            expect(collection.getTopIndicator().isDisplayed()).toBe(false); // индикатор покажется только через 2с
            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            expect(collection.getTopIndicator().isDisplayed()).toBe(true);

            controller.setHasMoreData(false, false);
            controller.setIterativeLoading(true);
            collection.getSourceCollection().setMetaData({ iterative: true });
            controller.onDataLoad(collection.getSourceCollection());
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('hide global indicator when load to direction', async () => {
            const { collection, controller } = initTest([{ id: 1 }], {});
            expect(collection.getGlobalIndicator()).toBeFalsy();
            controller.displayGlobalIndicator(100);
            expect(collection.getGlobalIndicator()).toBeFalsy(); // индикатор покажется только через 2с

            // ждем пока отобразится глобальный индикатор
            jest.advanceTimersByTime(2001);
            expect(collection.getGlobalIndicator()).toBeTruthy();

            controller.onDataLoad(collection.getSourceCollection(), 'down');
            expect(collection.getGlobalIndicator()).toBeFalsy();

            controller.destroy(); // уничтожаем все таймеры
        });
    });

    describe('startDisplayPortionedSearch', () => {
        it('display portioned search after 2s', async () => {
            const { collection, controller } = initTest(
                [{ id: 1 }],
                { isIterativeLoading: true },
                { iterative: true }
            );
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.startDisplayPortionedSearch('bottom');

            expect(collection.getBottomIndicator().isDisplayed()).toBe(false); // индикатор покажется только через 2с

            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('should hide all indicators and show needed indicator after 2s', async () => {
            const options = {
                isInfinityNavigation: true,
                attachLoadTopTriggerToNull: true,
                attachLoadDownTriggerToNull: true,
                hasMoreDataToTop: true,
                hasMoreDataToBottom: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                scrollToFirstItem: () => {
                    return null;
                },
            } as unknown as IIndicatorsControllerOptions;
            const { collection, controller } = initTest([{ id: 1 }], options);
            controller.setViewportFilled(true);
            controller.displayTopIndicator(false);
            controller.displayBottomIndicator();
            expect(collection.getTopIndicator().isDisplayed()).toBe(true);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.setViewportFilled(false);
            collection.getSourceCollection().setMetaData({ iterative: true });
            controller.setIterativeLoading(true);
            controller.startDisplayPortionedSearch('bottom');

            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('recount indicators not stop display portioned search', async () => {
            const options = {
                isInfinityNavigation: true,
                attachLoadTopTriggerToNull: true,
                attachLoadDownTriggerToNull: true,
                hasMoreDataToTop: true,
                hasMoreDataToBottom: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                scrollToFirstItem: () => {
                    return null;
                },
            } as unknown as IIndicatorsControllerOptions;
            const { collection, controller } = initTest([{ id: 1 }], options);
            controller.setViewportFilled(true);
            collection.getSourceCollection().setMetaData({ iterative: true });
            controller.setIterativeLoading(true);
            controller.startDisplayPortionedSearch('bottom');

            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.recountIndicators('all');

            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            expect(collection.getTopIndicator().isDisplayed()).toBe(false);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('display portioned search in maxCount navigation', () => {
            const { collection, controller } = initTest([{ id: 1 }], {
                isInfinityNavigation: false,
                isMaxCountNavigation: true,
                iterativeLoadPageSize: 5,
                attachLoadDownTriggerToNull: true,
                hasMoreDataToBottom: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
            });

            collection.getSourceCollection().setMetaData({ iterative: true });
            controller.setIterativeLoading(true);
            controller.startDisplayPortionedSearch('bottom');

            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            // не должны скрыть индикатор порционного индикатора
            controller.recountIndicators('down');
            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('not display indicator if portioned search in maxCount navigation load all items', () => {
            const { collection, controller } = initTest([{}], {
                isInfinityNavigation: false,
                isMaxCountNavigation: true,
                iterativeLoadPageSize: 5,
                attachLoadDownTriggerToNull: true,
                hasMoreDataToBottom: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
            });

            collection.getSourceCollection().setMetaData({ iterative: true });
            controller.setIterativeLoading(true);
            controller.startDisplayPortionedSearch('bottom');

            const loadedItems = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
                keyProperty: 'id',
            });
            controller.onDataLoad(loadedItems, 'down');

            // ждем на всякий случай пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('double start portioned search but stopCallback called once', async () => {
            const stopCallback = jest.fn();
            const { controller } = initTest(
                [{ id: 1 }],
                { stopDisplayPortionedSearchCallback: stopCallback },
                { iterative: true }
            );

            controller.startDisplayPortionedSearch('bottom');
            jest.advanceTimersByTime(1000);
            controller.startDisplayPortionedSearch('bottom');

            // ждем приостановки поиска
            jest.advanceTimersByTime(30001);
            expect(stopCallback).toHaveBeenCalledTimes(1);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('should not display portioned search indicator if has items outside range', async () => {
            const { collection, controller } = initTest(
                [{ id: 1 }],
                {
                    hasHiddenItemsByVirtualScroll: () => {
                        return true;
                    },
                    isIterativeLoading: true,
                },
                { iterative: true }
            );

            controller.startDisplayPortionedSearch('bottom');
            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);

            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.destroy(); // уничтожаем все таймеры
        });
    });

    describe('stopDisplayPortionedSearch', () => {
        it('should not display continue search indicator if has items outside range', async () => {
            const { collection, controller } = initTest(
                [{ id: 1 }],
                {
                    hasHiddenItemsByVirtualScroll: () => {
                        return true;
                    },
                    isIterativeLoading: true,
                },
                { iterative: true }
            );
            controller.startDisplayPortionedSearch('bottom');

            controller.stopDisplayPortionedSearch();
            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);

            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('should has not rendered changes after display bottom continue search indicator', async () => {
            const { controller } = initTest(
                [{ id: 1 }],
                {
                    hasHiddenItemsByVirtualScroll: () => {
                        return false;
                    },
                    hasMoreDataToBottom: true,
                    isIterativeLoading: true,
                },
                { iterative: true }
            );
            controller.startDisplayPortionedSearch('bottom');

            controller.stopDisplayPortionedSearch();
            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);

            expect(controller.hasNotRenderedChanges()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('should has not rendered changes after display top continue search indicator', async () => {
            const { controller } = initTest(
                [{ id: 1 }],
                {
                    hasHiddenItemsByVirtualScroll: () => {
                        return false;
                    },
                    scrollToFirstItem: () => {
                        return null;
                    },
                    hasMoreDataToTop: true,
                    isIterativeLoading: true,
                },
                { iterative: true }
            );
            controller.startDisplayPortionedSearch('top');

            controller.stopDisplayPortionedSearch();
            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);

            expect(controller.hasNotRenderedChanges()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });
    });

    describe('shouldDisplayGlobalIndicator', () => {
        it('not should display indicator if was started timer', () => {
            const { controller } = initTest([{ id: 1 }], {});
            // запустили таймер
            controller.displayGlobalIndicator(0);
            // олжно вернуть false, т.к. таймер уже запущен
            expect(controller.shouldDisplayGlobalIndicator()).toBe(false);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('not should display indicator if portioned search', () => {
            const { controller } = initTest(
                [{ id: 1 }],
                { isIterativeLoading: true },
                { iterative: true }
            );
            controller.startDisplayPortionedSearch('bottom');

            expect(controller.shouldDisplayGlobalIndicator()).toBe(false);
            controller.destroy();
        });

        it('not should display indicator if has error', () => {
            const { controller } = initTest([{ id: 1 }], {
                hasError: () => {
                    return true;
                },
            });

            expect(controller.shouldDisplayGlobalIndicator()).toBe(false);
        });
    });

    describe('displayGlobalIndicator', () => {
        it('should display after 2s', async () => {
            const { collection, controller } = initTest([{ id: 1 }], {});
            expect(collection.getGlobalIndicator()).toBeFalsy();

            controller.displayGlobalIndicator(0);

            expect(collection.getGlobalIndicator()).toBeFalsy(); // индикатор покажется только через 2с

            // ждем пока отобразится индикатор
            jest.advanceTimersByTime(2001);
            expect(collection.getGlobalIndicator()).toBeTruthy();

            controller.destroy(); // уничтожаем все таймеры
        });

        it('display global and display bottom indicator', async () => {
            const { collection, controller } = initTest([{ id: 1 }], {});
            expect(collection.getGlobalIndicator()).toBeFalsy();

            controller.displayGlobalIndicator(0);

            expect(collection.getGlobalIndicator()).toBeFalsy(); // индикатор покажется только через 2с

            // ждем пока отобразится индикатор
            jest.advanceTimersByTime(1000);
            controller.displayBottomIndicator();
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            jest.advanceTimersByTime(2001);

            expect(collection.getBottomIndicator().isDisplayed()).toBe(true);
            expect(collection.getGlobalIndicator()).toBeFalsy();

            controller.destroy(); // уничтожаем все таймеры
        });
    });

    describe('shouldHideGlobalIndicator', () => {
        it('should hide indicator if was started timer', () => {
            const { controller } = initTest([{ id: 1 }], {});
            // запустили таймер
            controller.displayGlobalIndicator(0);
            // олжно вернуть false, т.к. таймер уже запущен
            expect(controller.shouldHideGlobalIndicator()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('should hide indicator if it was displayed', async () => {
            const { controller } = initTest([{ id: 1 }], {});
            // запустили таймер
            controller.displayGlobalIndicator(0);

            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);

            // олжно вернуть false, т.к. индикатор отображен
            expect(controller.shouldHideGlobalIndicator()).toBe(true);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('not should hide indicator if portioned search', () => {
            const { controller } = initTest(
                [{ id: 1 }],
                { isIterativeLoading: true },
                { iterative: true }
            );
            // олжно вернуть false, т.к. таймер уже запущен
            expect(controller.shouldHideGlobalIndicator()).toBe(false);
        });

        it('not should hide indicator if timer not started and it not displayed', () => {
            const { controller } = initTest(
                [{ id: 1 }],
                { isIterativeLoading: true },
                { iterative: true }
            );
            // олжно вернуть false, т.к. таймер уже запущен
            expect(controller.shouldHideGlobalIndicator()).toBe(false);
        });
    });

    describe('hideGlobalIndicator', () => {
        it('should hide indicator', async () => {
            const { collection, controller } = initTest([{ id: 1 }], {});
            expect(collection.getGlobalIndicator()).toBeFalsy();

            controller.displayGlobalIndicator(0);
            // ждем пока отобразится индикатор
            jest.advanceTimersByTime(2001);
            expect(collection.getGlobalIndicator()).toBeTruthy();

            controller.hideGlobalIndicator();
            expect(collection.getGlobalIndicator()).toBeFalsy();

            controller.destroy(); // уничтожаем все таймеры
        });

        it('should reset timer of display indicator', async () => {
            const { collection, controller } = initTest([{ id: 1 }], {});
            expect(collection.getGlobalIndicator()).toBeFalsy();

            controller.displayGlobalIndicator(0);
            controller.hideGlobalIndicator(); // прерываем таймер

            // дожидается 2с и убеждаемся что индикатор так и не показался
            jest.advanceTimersByTime(2001);
            expect(collection.getGlobalIndicator()).toBeFalsy();

            controller.destroy(); // уничтожаем все таймеры
        });
    });

    describe('displayDrawingIndicator', () => {
        it('should display', () => {
            const { controller } = initTest([{ id: 1 }], {
                attachLoadTopTriggerToNull: true,
            });
            const mockedIndicatorElement = getMockedIndicatorElement();
            controller.displayDrawingIndicator(mockedIndicatorElement, 'top');
            jest.advanceTimersByTime(2001);
            expect(mockedIndicatorElement.style.display).toEqual('');
            expect(mockedIndicatorElement.style.position).toEqual('sticky');
            expect(mockedIndicatorElement.style.top).toEqual('0');
        });

        it('not should display by portioned search', () => {
            const { controller } = initTest(
                [{ id: 1 }],
                { attachLoadTopTriggerToNull: true, isIterativeLoading: true },
                { iterative: true }
            );
            const mockedIndicatorElement = getMockedIndicatorElement();
            controller.displayDrawingIndicator(mockedIndicatorElement, 'top');
            jest.advanceTimersByTime(2001);
            expect(mockedIndicatorElement.style.display).toEqual('');
            expect(mockedIndicatorElement.style.position).toEqual('');
            expect(mockedIndicatorElement.style.top).toEqual('');
        });

        it('not should display by options', () => {
            const { controller } = initTest([{ id: 1 }], {
                attachLoadTopTriggerToNull: false,
            });
            const mockedIndicatorElement = getMockedIndicatorElement();
            controller.displayDrawingIndicator(mockedIndicatorElement, 'top');
            jest.advanceTimersByTime(2001);
            expect(mockedIndicatorElement.style.display).toEqual('');
            expect(mockedIndicatorElement.style.position).toEqual('');
            expect(mockedIndicatorElement.style.top).toEqual('');
        });
    });

    describe('hideDrawingIndicator', () => {
        it('should hide', () => {
            const { controller } = initTest([{ id: 1 }], {
                attachLoadTopTriggerToNull: true,
            });
            const mockedIndicatorElement = getMockedIndicatorElement();
            controller.displayDrawingIndicator(mockedIndicatorElement, 'top');
            jest.advanceTimersByTime(2001);
            controller.hideDrawingIndicator(mockedIndicatorElement, 'top');
            expect(mockedIndicatorElement.style.display).toEqual('none');
            expect(mockedIndicatorElement.style.position).toEqual('');
            expect(mockedIndicatorElement.style.top).toEqual('');
        });

        it('not should hide by portioned search', () => {
            const { controller } = initTest(
                [{ id: 1 }],
                { attachLoadTopTriggerToNull: true, isIterativeLoading: true },
                { iterative: true }
            );
            const mockedIndicatorElement = getMockedIndicatorElement();
            controller.hideDrawingIndicator(mockedIndicatorElement, 'top');
            expect(mockedIndicatorElement.style.display).toEqual('');
            expect(mockedIndicatorElement.style.position).toEqual('');
            expect(mockedIndicatorElement.style.top).toEqual('');
        });

        it('not should hide by options', () => {
            const { controller } = initTest([{ id: 1 }], {
                attachLoadTopTriggerToNull: false,
            });
            const mockedIndicatorElement = getMockedIndicatorElement();
            controller.hideDrawingIndicator(mockedIndicatorElement, 'top');
            expect(mockedIndicatorElement.style.display).toEqual('');
            expect(mockedIndicatorElement.style.position).toEqual('');
            expect(mockedIndicatorElement.style.top).toEqual('');
        });
    });

    describe('shouldDisplayBottomIndicator', () => {
        it('not display if collection is empty', () => {
            const options: IIndicatorsControllerOptions = {
                isInfinityNavigation: true,
                hasMoreDataToBottom: true,
                attachLoadDownTriggerToNull: true,
                isIterativeLoading: false,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
            } as unknown as IIndicatorsControllerOptions;
            const { controller } = initTest([], options);
            expect(controller.shouldDisplayBottomIndicator()).toBe(false);
        });

        it('display bottom indicator and hide it by has more data before it displayed', async () => {
            const { collection, controller } = initTest([{ id: 1 }], {
                hasMoreDataToBottom: true,
            });

            // ждем пока отобразится индикатор
            jest.advanceTimersByTime(1000);
            controller.displayBottomIndicator();
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.setHasMoreData(false, false);
            controller.recountIndicators('all');

            jest.advanceTimersByTime(2001);

            // индикатор так и не показался, потому что данные вниз кончились до того как закончился таймер
            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.destroy(); // уничтожаем все таймеры
        });

        it('not should display indicator if has error', () => {
            const options: IIndicatorsControllerOptions = {
                isInfinityNavigation: true,
                hasMoreDataToBottom: true,
                attachLoadDownTriggerToNull: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                hasError: () => {
                    return true;
                },
            } as unknown as IIndicatorsControllerOptions;
            const { controller } = initTest([{ id: 1 }], options);

            expect(controller.shouldDisplayBottomIndicator()).toBe(false);
        });
    });

    describe('displayBottomIndicator', () => {
        it('not display indicator by timer after reload', async () => {
            const { collection, controller } = initTest([{ id: 1 }], {
                hasMoreDataToBottom: true,
            });

            controller.onDataLoad(collection.getSourceCollection());
            controller.setViewportFilled(true);
            controller.setHasMoreData(false, false);
            controller.onDataLoad(collection.getSourceCollection());
            jest.advanceTimersByTime(2001);

            expect(collection.getBottomIndicator().isDisplayed()).toBe(false);

            controller.destroy(); // уничтожаем все таймеры
        });
    });

    describe('shouldDisplayTopIndicator', () => {
        it('not display if collection is empty', () => {
            const options: IIndicatorsControllerOptions = {
                isInfinityNavigation: true,
                hasMoreDataToTop: true,
                attachLoadTopTriggerToNull: true,
                isIterativeLoading: false,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
            } as unknown as IIndicatorsControllerOptions;
            const { controller } = initTest([], options);
            expect(controller.shouldDisplayTopIndicator()).toBe(false);
        });

        it('not should display indicator if has error', () => {
            const options: IIndicatorsControllerOptions = {
                isInfinityNavigation: true,
                hasMoreDataToTop: true,
                attachLoadTopTriggerToNull: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                hasError: () => {
                    return true;
                },
            } as unknown as IIndicatorsControllerOptions;
            const { controller } = initTest([{ id: 1 }], options);

            expect(controller.shouldDisplayTopIndicator()).toBe(false);
        });
    });

    describe('recountIndicators', () => {
        it('should not hide top portioned search indicator', () => {
            const { collection, controller } = initTest(
                [{ id: 1 }],
                {
                    attachLoadTopTriggerToNull: false,
                    isInfinityNavigation: true,
                    hasMoreDataToTop: true,
                    isIterativeLoading: true,
                    hasHiddenItemsByVirtualScroll: () => {
                        return false;
                    },
                    hasError: () => {
                        return false;
                    },
                },
                { iterative: true }
            );
            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);

            controller.recountIndicators('up');

            expect(collection.getTopIndicator().isDisplayed()).toBeTruthy();
        });

        it('should not hide top portioned search indicator even has items hidden by virtual scroll', () => {
            const { collection, controller } = initTest(
                [{ id: 1 }],
                {
                    attachLoadTopTriggerToNull: false,
                    isInfinityNavigation: true,
                    hasMoreDataToTop: true,
                    isIterativeLoading: true,
                    hasHiddenItemsByVirtualScroll: () => {
                        return true;
                    },
                    hasError: () => {
                        return false;
                    },
                },
                { iterative: true }
            );
            // ждем пока отобразится индикатор порционного поиска
            jest.advanceTimersByTime(2001);
            controller.continueDisplayPortionedSearch();
            jest.advanceTimersByTime(2001);

            controller.recountIndicators('up');

            expect(collection.getTopIndicator().isDisplayed()).toBeTruthy();
        });
    });

    describe('hideIndicator', () => {
        it('should has not rendered changes after hide top indicator', () => {
            const options: IIndicatorsControllerOptions = {
                isInfinityNavigation: true,
                hasMoreDataToTop: true,
                attachLoadTopTriggerToNull: true,
                hasHiddenItemsByVirtualScroll: () => {
                    return false;
                },
                scrollToFirstItem: () => {
                    return null;
                },
                hasError: () => {
                    return false;
                },
            } as unknown as IIndicatorsControllerOptions;
            const { controller } = initTest([{ id: 1 }], options);
            controller.recountIndicators('up');

            controller.hideIndicator('top');

            expect(controller.hasNotRenderedChanges()).toBe(true);
        });
    });
});
