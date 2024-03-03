import { default as ScrollPaging } from 'Controls/_baseList/Controllers/ScrollPaging';

describe('Controls/Controllers/ScrollPaging', () => {
    describe('constructor', () => {
        it('scroll at top position', () => {
            const cfg = {
                scrollParams: {
                    scrollTop: 0,
                    scrollHeight: 150,
                    clientHeight: 50,
                },
                pagingCfgTrigger: (_) => {
                    return void 0;
                },
            };
            const stub = jest.spyOn(cfg, 'pagingCfgTrigger').mockClear().mockImplementation();
            const spInstance = new ScrollPaging(cfg);
            expect('top').toEqual(spInstance._curState);
            expect(stub).toHaveBeenCalledWith({
                arrowState: {
                    begin: 'readonly',
                    end: 'hidden',
                    next: 'visible',
                    prev: 'readonly',
                    reset: 'hidden',
                },
            });
        });
        it('scroll at middle position', () => {
            const cfg = {
                scrollParams: {
                    scrollTop: 50,
                    scrollHeight: 150,
                    clientHeight: 50,
                },
                pagingCfgTrigger: (_) => {
                    return void 0;
                },
            };
            const stub = jest.spyOn(cfg, 'pagingCfgTrigger').mockClear().mockImplementation();
            const spInstance = new ScrollPaging(cfg);
            expect('middle').toEqual(spInstance._curState);
            expect(stub).toHaveBeenCalledWith({
                arrowState: {
                    begin: 'visible',
                    end: 'hidden',
                    next: 'visible',
                    prev: 'visible',
                    reset: 'hidden',
                },
            });
        });
        it('scroll at bottom position', () => {
            const cfg = {
                scrollParams: {
                    scrollTop: 100,
                    scrollHeight: 150,
                    clientHeight: 50,
                },
                pagingCfgTrigger: (_) => {
                    return void 0;
                },
            };
            const stub = jest.spyOn(cfg, 'pagingCfgTrigger').mockClear().mockImplementation();
            const spInstance = new ScrollPaging(cfg);
            expect('bottom').toEqual(spInstance._curState);
            expect(stub).toHaveBeenCalledWith({
                arrowState: {
                    begin: 'visible',
                    end: 'hidden',
                    next: 'readonly',
                    prev: 'visible',
                    reset: 'hidden',
                },
            });
        });
    });
    describe('updateScrollParams', () => {
        const cfg = {
            scrollParams: {
                scrollTop: 150,
                scrollHeight: 250,
                clientHeight: 50,
            },
            pagingCfgTrigger: (_) => {
                return void 0;
            },
        };
        const spInstance = new ScrollPaging(cfg);

        it('make big window and reach bottom', () => {
            const stub = jest.spyOn(cfg, 'pagingCfgTrigger').mockClear().mockImplementation();
            spInstance.updateScrollParams({
                scrollTop: 150,
                scrollHeight: 250,
                clientHeight: 100,
            });
            expect('bottom').toEqual(spInstance._curState);
            expect(stub).toHaveBeenCalledWith({
                arrowState: {
                    begin: 'visible',
                    end: 'hidden',
                    next: 'readonly',
                    prev: 'visible',
                    reset: 'hidden',
                },
            });
        });
    });

    describe('calcPageConfigToEnd', () => {
        let spInstance;
        beforeEach(() => {
            spInstance = new ScrollPaging({
                pagingMode: 'numbers',
                loadedElementsCount: 25,
                totalElementsCount: 34001,
                scrollParams: {
                    initial: true,
                    scrollTop: 0,
                    scrollHeight: 1000,
                    clientHeight: 750,
                },
                pagingCfgTrigger: (_) => {
                    return void 0;
                },
            });
        });
        it('real case from task', () => {
            const pageSize = 25;
            const itemsOnPage = 25;
            const total = 34001;
            expect(spInstance.calcPageConfigToEnd(pageSize, itemsOnPage, total)).toEqual({
                page: 453,
                pageSize: 75,
            });
        });
    });
    describe('pagingMode numbers', () => {
        describe('other methods', () => {
            let spInstance;
            beforeEach(() => {
                spInstance = new ScrollPaging({
                    pagingMode: 'numbers',
                    loadedElementsCount: 10,
                    totalElementsCount: 100,
                    scrollParams: {
                        scrollTop: 0,
                        scrollHeight: 250,
                        clientHeight: 50,
                    },
                    pagingCfgTrigger: (_) => {
                        return void 0;
                    },
                });
            });
            it('initPagingData', () => {
                expect(spInstance._pagingData).toEqual({
                    totalHeight: 2500,
                    pagesCount: 50,
                    averageElementHeight: 25,
                });
            });
            it('getItemsCountOnPage', () => {
                expect(spInstance.getItemsCountOnPage()).toEqual(2);
            });
            it('getNeededItemsCountForPage', () => {
                expect(spInstance.getNeededItemsCountForPage(1)).toEqual(2);
                expect(spInstance.getNeededItemsCountForPage(2)).toEqual(4);
                spInstance.shiftToEdge('down', { up: true });
                expect(spInstance.getNeededItemsCountForPage(50)).toEqual(2);
                expect(spInstance.getNeededItemsCountForPage(49)).toEqual(4);
            });
            it('getScrollTopByPage numbersState = up', () => {
                spInstance.shiftToEdge('up', { down: true });
                const scrollParams = {
                    scrollTop: 0,
                    scrollHeight: 250,
                    clientHeight: 50,
                };
                spInstance.updateScrollParams(scrollParams, {
                    up: false,
                    down: true,
                });
                expect(spInstance.getScrollTopByPage(1, scrollParams)).toEqual(0);
                expect(spInstance.getScrollTopByPage(2, scrollParams)).toEqual(50);
                expect(spInstance.getScrollTopByPage(3, scrollParams)).toEqual(100);
            });
            it('getScrollTopByPage numbersState = down', () => {
                spInstance.shiftToEdge('down', { up: true });
                const scrollParams = {
                    scrollTop: 50,
                    scrollHeight: 250,
                    clientHeight: 50,
                };
                spInstance.updateScrollParams(scrollParams, {
                    up: true,
                    down: false,
                });
                expect(spInstance.getScrollTopByPage(50, scrollParams)).toEqual(200);
                expect(spInstance.getScrollTopByPage(49, scrollParams)).toEqual(150);
                expect(spInstance.getScrollTopByPage(48, scrollParams)).toEqual(100);
            });
        });
        describe('changing selectedPage', () => {
            let spInstance;
            let selectedPage;
            beforeEach(() => {
                spInstance = new ScrollPaging({
                    pagingMode: 'numbers',
                    loadedElementsCount: 10,
                    totalElementsCount: 100,
                    scrollParams: {
                        scrollTop: 0,
                        scrollHeight: 250,
                        clientHeight: 50,
                    },
                    pagingCfgTrigger: (cfg) => {
                        selectedPage = cfg.selectedPage;
                    },
                });
            });
            it('changing page from top position', () => {
                spInstance.shiftToEdge('up', {});
                spInstance.updateScrollParams(
                    {
                        scrollTop: 0,
                        scrollHeight: 250,
                        clientHeight: 50,
                    },
                    { up: false, down: true }
                );
                expect(selectedPage).toEqual(1);
                spInstance.updateScrollParams(
                    {
                        scrollTop: 50,
                        scrollHeight: 250,
                        clientHeight: 50,
                    },
                    { up: false, down: true }
                );
                expect(selectedPage).toEqual(2);
                spInstance.updateScrollParams(
                    {
                        scrollTop: 200,
                        scrollHeight: 250,
                        clientHeight: 50,
                    },
                    { up: false, down: false }
                );
                expect(selectedPage).toEqual(50);
            });

            it('Changing page from bottom position', () => {
                spInstance.shiftToEdge('down', { up: true, down: false });
                spInstance.updateScrollParams(
                    {
                        scrollTop: 200,
                        scrollHeight: 250,
                        clientHeight: 50,
                    },
                    { up: true, down: false }
                );
                expect(selectedPage).toEqual(50);
                spInstance.updateScrollParams(
                    {
                        scrollTop: 150,
                        scrollHeight: 250,
                        clientHeight: 50,
                    },
                    { up: true, down: false }
                );
                expect(selectedPage).toEqual(49);
                spInstance.updateScrollParams(
                    {
                        scrollTop: 0,
                        scrollHeight: 250,
                        clientHeight: 50,
                    },
                    { up: false, down: false }
                );
                expect(selectedPage).toEqual(1);
            });
        });
    });
});
