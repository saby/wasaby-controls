/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { TNavigationPagingMode, TNavigationResetButtonMode } from 'Controls/interface';
import { IArrowState } from 'Controls/paging';

/**
 * Контроллер состояния пейджинга
 * @class Controls/_baseList/Controllers/ScrollPaging/ScrollPagingController
 * @private
 */

type IScrollPagingState = 'top' | 'bottom' | 'middle' | 'none';

interface IScrollParams {
    clientHeight: number;
    scrollTop: number;
    scrollHeight: number;
    initial: boolean;
}

export interface IPagingCfg {
    arrowState?: IArrowState;
    showDigits?: boolean;
    pagingMode?: string;
    pagesCount?: number;
    selectedPage?: number;
    elementsCount?: number;
}

interface IScrollPagingOptions {
    pagingMode?: TNavigationPagingMode;
    scrollParams?: IScrollParams;
    totalElementsCount?: number;
    loadedElementsCount?: number;
    showEndButton?: boolean;
    resetButtonMode?: TNavigationResetButtonMode;

    pagingCfgTrigger(cfg: IPagingCfg): void;
}

interface IPagingData {
    totalHeight: number;
    pagesCount: number;
    averageElementHeight: number;
}

interface IHasMoreData {
    up: boolean;
    down: boolean;
}

export default class ScrollPagingController {
    protected _curState: IScrollPagingState = 'none';
    protected _options: IScrollPagingOptions = null;
    protected _pagingData: IPagingData = null;
    protected _numbersState: 'up' | 'down' = 'up';

    constructor(cfg: IScrollPagingOptions, hasMoreData: IHasMoreData = { up: false, down: false }) {
        this._options = cfg;
        this.initializePagingData(cfg);
        this.updateStateByScrollParams(cfg.scrollParams, hasMoreData);
    }

    protected initializePagingData(cfg: IScrollPagingOptions): void {
        const averageElementHeight =
            this._options.scrollParams.scrollHeight / this._options.loadedElementsCount;
        const totalHeight = averageElementHeight * this._options.totalElementsCount;
        const pagesCount = Math.round(totalHeight / this._options.scrollParams.clientHeight);
        this._pagingData = {
            totalHeight,
            pagesCount,
            averageElementHeight,
        };
    }

    viewportResize(clientHeight: number): void {
        const pagesCount = Math.round(this._pagingData.totalHeight / clientHeight);
        this._pagingData.pagesCount = pagesCount;
        this._curState = 'none';
    }

    shiftToEdge(state: 'up' | 'down', hasMoreData: IHasMoreData): void {
        if (this._options.pagingMode === 'numbers') {
            this._numbersState = state;
            let pagingCfg;
            if (state === 'up') {
                pagingCfg = this.getPagingCfg(
                    {
                        begin: 'readonly',
                        prev: 'readonly',
                        next: 'visible',
                        end: 'visible',
                        reset:
                            (!this._options.scrollParams.initial &&
                                this._options.resetButtonMode) ||
                            'hidden',
                    },
                    hasMoreData
                );
                pagingCfg.selectedPage = 1;
            } else {
                pagingCfg = this.getPagingCfg(
                    {
                        begin: 'visible',
                        prev: 'visible',
                        next: 'readonly',
                        end: 'readonly',
                        reset:
                            (!this._options.scrollParams.initial &&
                                this._options.resetButtonMode) ||
                            'hidden',
                    },
                    hasMoreData
                );
                pagingCfg.selectedPage = this._pagingData.pagesCount;
            }
            this._options.pagingCfgTrigger(pagingCfg);
        }
    }

    /**
     * Метод вычисляет размер и номер последней страницы так,
     * чтобы на отобразить досточно записей и при этом размер страницы был минимальным возможным
     * @param pageSize
     * @param itemsOnPage
     * @param total
     */
    calcPageConfigToEnd(
        pageSize: number,
        itemsOnPage: number,
        total: number
    ): { page: number; pageSize: number } {
        const fullPagesCount = Math.floor(total / pageSize);
        // Минимальное число страниц для отображения
        const minPageCoeff = Math.ceil(itemsOnPage / pageSize);
        let currentPageCoef = minPageCoeff;
        // Имщем наименьший размер страницы кратный данному, так,
        // чтобы остаток вмещал в себя необходимое минимальное число страниц
        while (fullPagesCount % currentPageCoef < minPageCoeff) {
            currentPageCoef++;
        }
        const newPageSize = pageSize * currentPageCoef;
        const newPage = Math.floor(fullPagesCount / currentPageCoef);
        return {
            page: newPage,
            pageSize: newPageSize,
        };
    }

    /**
     * Метод вычисляет размер и номер первой страницы так,
     * чтобы на отобразить досточно записей и при этом размер страницы был минимальным возможным
     * @param pageSize
     * @param itemsOnPage
     * @param total
     */
    calcPageConfigToStart(
        pageSize: number,
        itemsOnPage: number
    ): { page: number; pageSize: number } {
        const minPageCoeff = Math.ceil(itemsOnPage / pageSize);
        const newPageSize = pageSize * minPageCoeff;
        return {
            page: 0,
            pageSize: newPageSize,
        };
    }

    protected isHasMoreData(hasMoreData: boolean): boolean {
        return (
            !hasMoreData ||
            (this._options.pagingMode !== 'edge' &&
                this._options.pagingMode !== 'edges' &&
                this._options.pagingMode !== 'end')
        );
    }

    protected updateStateByScrollParams(
        scrollParams: IScrollParams,
        hasMoreData: IHasMoreData
    ): void {
        const canScrollForward =
            Math.ceil(scrollParams.clientHeight + scrollParams.scrollTop) <
            scrollParams.scrollHeight;
        const canScrollBackward = scrollParams.scrollTop > 0;
        if (canScrollForward && canScrollBackward) {
            this.handleScrollMiddle(hasMoreData);
        } else if (canScrollForward && !canScrollBackward && this.isHasMoreData(hasMoreData.up)) {
            this.handleScrollTop(hasMoreData);
        } else if (!canScrollForward && canScrollBackward && this.isHasMoreData(hasMoreData.down)) {
            this.handleScrollBottom(hasMoreData);
        }
    }

    getItemsCountOnPage(): number {
        if (this._pagingData.averageElementHeight) {
            return Math.ceil(
                this._options.scrollParams.clientHeight / this._pagingData.averageElementHeight
            );
        }
    }

    protected getNeededItemsCountForPage(page: number): number {
        if (this._options.pagingMode === 'numbers') {
            const itemsOnPage = this.getItemsCountOnPage();
            let neededItems;
            if (this._numbersState === 'up') {
                neededItems = page * itemsOnPage;
            } else {
                neededItems = (this._pagingData.pagesCount - page + 1) * itemsOnPage;
            }
            return Math.min(neededItems, this._options.totalElementsCount);
        }
    }

    protected getPagingCfg(arrowState: IArrowState, hasMoreData: IHasMoreData): IPagingCfg {
        const pagingCfg: IPagingCfg = {};
        switch (this._options.pagingMode) {
            case 'basic':
                break;

            case 'edge':
                if (arrowState.next === 'visible' || arrowState.end === 'visible') {
                    arrowState.begin = 'hidden';
                    arrowState.end = 'visible';
                } else if (arrowState.begin === 'visible') {
                    arrowState.begin = 'visible';
                    arrowState.end = 'hidden';
                }
                arrowState.prev = 'hidden';
                arrowState.next = 'hidden';
                break;

            case 'edges':
                arrowState.end = arrowState.next;
                arrowState.prev = 'hidden';
                arrowState.next = 'hidden';
                break;

            case 'end':
                if (arrowState.next === 'visible' || arrowState.end === 'visible') {
                    arrowState.end = 'visible';
                } else {
                    arrowState.end = 'hidden';
                }
                arrowState.prev = 'hidden';
                arrowState.next = 'hidden';
                arrowState.begin = 'hidden';
                break;

            case 'numbers':
                arrowState.prev = 'hidden';
                arrowState.end = arrowState.next;
                arrowState.next = 'hidden';

                pagingCfg.pagesCount = this._pagingData.pagesCount;
                if (this._numbersState === 'up') {
                    if (
                        this._options.scrollParams.scrollTop +
                            this._options.scrollParams.clientHeight >=
                            this._options.scrollParams.scrollHeight &&
                        !hasMoreData.down
                    ) {
                        pagingCfg.selectedPage = pagingCfg.pagesCount;
                        this._numbersState = 'down';
                    } else {
                        pagingCfg.selectedPage =
                            Math.round(
                                this._options.scrollParams.scrollTop /
                                    this._options.scrollParams.clientHeight
                            ) + 1;
                    }
                } else {
                    let scrollBottom =
                        this._options.scrollParams.scrollHeight -
                        this._options.scrollParams.scrollTop -
                        this._options.scrollParams.clientHeight;
                    if (scrollBottom < 0) {
                        scrollBottom = 0;
                    }
                    if (this._options.scrollParams.scrollTop === 0 && !hasMoreData.up) {
                        pagingCfg.selectedPage = 1;
                        this._numbersState = 'up';
                    } else {
                        pagingCfg.selectedPage =
                            pagingCfg.pagesCount -
                            Math.round(scrollBottom / this._options.scrollParams.clientHeight);
                    }
                }
                break;
        }
        if (this._options.pagingMode) {
            pagingCfg.pagingMode = this._options.pagingMode;
            pagingCfg.elementsCount = this._options.totalElementsCount;
        }
        pagingCfg.arrowState = arrowState;
        return pagingCfg;
    }

    getScrollTopByPage(page: number, scrollParams: IScrollParams): number {
        if (this._options.pagingMode === 'numbers') {
            let scrollTop;
            if (this._numbersState === 'up') {
                scrollTop = (page - 1) * scrollParams.clientHeight;
            } else {
                const scrollBottom =
                    (this._pagingData.pagesCount - page) * scrollParams.clientHeight;
                scrollTop = scrollParams.scrollHeight - scrollBottom - scrollParams.clientHeight;
            }
            return scrollTop;
        }
    }

    protected handleScrollMiddle(hasMoreData: IHasMoreData): void {
        if (
            !(this._curState === 'middle') ||
            this._options.pagingMode === 'numbers' ||
            this._options.resetButtonMode
        ) {
            this._options.pagingCfgTrigger(
                this.getPagingCfg(
                    {
                        begin: 'visible',
                        prev: 'visible',
                        next: 'visible',
                        end: this._options.showEndButton ? 'visible' : 'hidden',
                        reset:
                            (!this._options.scrollParams.initial &&
                                this._options.resetButtonMode) ||
                            'hidden',
                    },
                    hasMoreData
                )
            );
            this._curState = 'middle';
        }
    }

    protected handleScrollTop(hasMoreData: IHasMoreData): void {
        if (!(this._curState === 'top')) {
            this._options.pagingCfgTrigger(
                this.getPagingCfg(
                    {
                        begin: 'readonly',
                        prev: 'readonly',
                        next: 'visible',
                        end: this._options.showEndButton ? 'visible' : 'hidden',
                        reset:
                            (!this._options.scrollParams.initial &&
                                this._options.resetButtonMode) ||
                            'hidden',
                    },
                    hasMoreData
                )
            );
            this._curState = 'top';
        }
    }

    protected handleScrollBottom(hasMoreData: IHasMoreData): void {
        if (!(this._curState === 'bottom')) {
            this._options.pagingCfgTrigger(
                this.getPagingCfg(
                    {
                        begin: 'visible',
                        prev: 'visible',
                        next: 'readonly',
                        end: this._options.showEndButton ? 'readonly' : 'hidden',
                        reset:
                            (!this._options.scrollParams.initial &&
                                this._options.resetButtonMode) ||
                            'hidden',
                    },
                    hasMoreData
                )
            );
            this._curState = 'bottom';
        }
    }

    updateScrollParams(
        scrollParams: IScrollParams,
        hasMoreData: IHasMoreData = { up: false, down: false }
    ): void {
        this._options.scrollParams = scrollParams;
        this.updateStateByScrollParams(scrollParams, hasMoreData);
    }

    destroy(): void {
        this._options = null;
    }
}
