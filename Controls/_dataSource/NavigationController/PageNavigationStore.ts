/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import INavigationStore from './interface/INavigationStore';

type TMore = boolean | number;

export interface IPageNavigationStoreOptions {
    pageSize: number;
    page?: number;
    hasMore?: boolean;
}
export interface IPageNavigationState {
    pageSize: number;
    page?: number;
    hasMore?: boolean;
    nextPage: number;
    prevPage: number;
}
class PageNavigationStore implements INavigationStore {
    private _page: number;
    private _pageSize: number;
    private _hasMore: boolean;

    private _nextPage: number;
    private _prevPage: number;
    private _more: TMore = null;

    constructor(cfg: IPageNavigationStoreOptions) {
        this._page = cfg.page || 0;
        this._prevPage = this._page - 1;
        this._nextPage = this._page + 1;
        this._initPages(cfg.page || 0);

        if (cfg.pageSize) {
            this._pageSize = cfg.pageSize;
        } else {
            throw new Error('Option pageSize is undefined in PageNavigation');
        }
        // if hasMore defined as "false", should be "false" else should be "true". By default should be "true"
        this._hasMore = cfg.hasMore !== false;
    }

    private _initPages(pageNumber: number): void {
        this._page = pageNumber;
        this._prevPage = this._page - 1;
        this._nextPage = this._page + 1;
    }

    getState(): IPageNavigationState {
        return {
            page: this._page,
            pageSize: this._pageSize,
            hasMore: this._hasMore,
            prevPage: this._prevPage,
            nextPage: this._nextPage,
        };
    }

    shiftNextPage(): void {
        this._nextPage++;
    }

    shiftPrevPage(): void {
        this._prevPage--;
    }

    setPrevPage(pageNumber: number): void {
        this._prevPage = pageNumber;
    }

    setNextPage(pageNumber: number): void {
        this._nextPage = pageNumber;
    }

    setCurrentPage(pageNumber: number): void {
        this._initPages(pageNumber);
    }

    setMetaMore(more: TMore): void {
        this._more = more;
    }

    getMetaMore(): TMore {
        return this._more;
    }

    destroy(): void {
        this._nextPage = null;
        this._prevPage = null;
        this._more = null;

        this._page = null;
        this._pageSize = null;
        this._hasMore = null;
    }
}

export default PageNavigationStore;
