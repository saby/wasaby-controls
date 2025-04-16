/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { QueryNavigationType } from 'Types/source';
import { default as PageNavigationStore, IPageNavigationState } from './PageNavigationStore';
import {
    TNavigationDirection,
    TNavigationPagingMode,
    IQueryParams,
    IBasePageSourceConfig,
    INavigationPageSourceConfig,
} from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import IParamsCalculator from './interface/IParamsCalculator';

class PageParamsCalculator implements IParamsCalculator {
    getQueryParams(
        store: PageNavigationStore,
        config: INavigationPageSourceConfig,
        direction?: TNavigationDirection,
        paramsCallback?: Function,
        reset?: boolean
    ): IQueryParams {
        const addParams: IQueryParams = {};
        addParams.meta = { navigationType: QueryNavigationType.Page };

        const storeParams = store.getState();

        let page;
        switch (direction) {
            case 'forward':
                page = storeParams.nextPage;
                break;
            case 'backward':
                page = storeParams.prevPage;
                break;
            default:
                page = typeof config.page === 'number' ? config.page : storeParams.page;
        }
        const pageSize = config.pageSize ? config.pageSize : storeParams.pageSize;

        addParams.offset = page * pageSize;

        if (reset) {
            addParams.limit = pageSize;
        } else {
            addParams.limit = pageSize * storeParams.nextPage;
        }

        if (storeParams.hasMore === false) {
            addParams.meta.hasMore = false;
        }

        if (paramsCallback) {
            paramsCallback({
                page,
                pageSize,
            });
        }

        return addParams;
    }

    updateQueryProperties(
        store: PageNavigationStore,
        list: RecordSet,
        metaMore: number | boolean,
        config: IBasePageSourceConfig,
        direction?: TNavigationDirection
    ): IPageNavigationState {
        const storeParams = store.getState();

        PageParamsCalculator._validateNavigation(metaMore, storeParams.hasMore);
        store.setMetaMore(metaMore);

        switch (direction) {
            case 'forward':
                store.shiftNextPage();
                break;
            case 'backward':
                store.shiftPrevPage();
                break;
            default: {
                // Если направление не указано,
                // значит это расчет параметров после начальной загрузки списка или после перезагрузки
                if (config && config.pageSize) {
                    // TODO обработать эту ситуацию
                    const pageSizeRemainder = config.pageSize % storeParams.pageSize;
                    const pageSizeCoef =
                        (config.pageSize - pageSizeRemainder) / storeParams.pageSize;

                    if (pageSizeRemainder) {
                        throw new Error(
                            'pageSize, переданный для единичной перезагрузки списка, должен нацело делиться на pageSize из опции navigation.sourceConfig.'
                        );
                    }

                    // если мы загрузили 0 страницу размера 30 , то мы сейчас на 2 странице размера 10
                    const isMetaNumber = typeof metaMore === 'number';
                    let newNextPage = (config.page + 1) * pageSizeCoef;
                    let newCurrentPage;
                    let newPrevPage;
                    let maxPage;

                    if (isMetaNumber) {
                        maxPage = Math.max(
                            1,
                            Math.ceil((metaMore as number) / storeParams.pageSize)
                        );
                        newNextPage = Math.min(maxPage, newNextPage);
                    }

                    if (config.page) {
                        newCurrentPage = (config.page + 1) * pageSizeCoef - 1;
                        newPrevPage = config.page * pageSizeCoef - 1;
                        if (isMetaNumber) {
                            newCurrentPage = Math.min(maxPage, newCurrentPage);
                        }
                    } else {
                        newCurrentPage = 0;
                        newPrevPage = config.page - 1;
                    }
                    store.setCurrentPage(newCurrentPage);
                    store.setPrevPage(newPrevPage);
                    store.setNextPage(newNextPage);
                }
            }
        }
        return store.getState();
    }

    hasMoreData(store: PageNavigationStore, direction: TNavigationDirection): boolean {
        let result: boolean;
        const storeParams = store.getState();
        const more = store.getMetaMore();

        if (direction === 'forward') {
            // moreResult === undefined, when navigation for passed rootKey is not defined
            if (more === undefined) {
                result = false;
            } else {
                if (storeParams.hasMore === false) {
                    // в таком случае в more приходит общее число записей в списке
                    // значит умножим номер след. страницы на число записей на одной странице и сравним с общим
                    result =
                        typeof more === 'boolean'
                            ? more
                            : storeParams.nextPage * storeParams.pageSize < more;
                } else {
                    result = !!more;
                }
            }
        } else if (direction === 'backward') {
            result = storeParams.prevPage >= 0;
        } else {
            throw new Error('Parameter direction is not defined in hasMoreData call');
        }

        return result;
    }

    shiftToEdge(
        store: PageNavigationStore,
        direction: TNavigationDirection,
        shiftMode: TNavigationPagingMode,
        navigationQueryConfig: IBasePageSourceConfig
    ): IBasePageSourceConfig {
        const config: Partial<IBasePageSourceConfig> = {};
        if (direction === 'backward') {
            config.page = 0;
        } else if (direction === 'forward') {
            const metaMore = store.getMetaMore();

            if (typeof metaMore === 'number') {
                config.page = Math.ceil(metaMore / store.getState().pageSize) - 1;

                // если записей на последней странице будет мало, то загружаем еще и предыдущую.
                // Например, если есть 4 полные страницы и последняя с одной записью:
                // 0..9, 10..19, 20..29, 30..39, 40..44.
                // При переходе в конец, нужно получить загрузку с 30..44,
                // так как offset рассчитается как page*pageSize.
                // ставим page = 1
                // а pageSize = 30
                // TODO: https://online.sbis.ru/opendoc.html?guid=53c4e82d-8e21-4fc8-81dc-ccf2a8c6ba9f
                if ((metaMore / store.getState().pageSize) % 1 > 0) {
                    config.pageSize = store.getState().pageSize * (config.page - 1);
                    config.page = 1;
                }
            } else {
                config.page = -1;
            }
        }

        return { ...navigationQueryConfig, ...config };
    }

    updateQueryRange(store: PageNavigationStore): void {
        // do not need to update
    }

    getAdditionalMeta(list: RecordSet, id?: string): object {
        return {};
    }

    destroy(): void {
        return;
    }

    private static _validateNavigation(
        hasMoreValue: boolean | number,
        hasMoreOption: boolean
    ): void {
        if (hasMoreOption === false) {
            // meta.more can be undefined is is not error
            if (hasMoreValue && typeof hasMoreValue !== 'number') {
                throw new Error('"more" Parameter has incorrect type. Must be numeric');
            }
        } else {
            // meta.more can be undefined is is not error
            if (hasMoreValue && typeof hasMoreValue !== 'boolean') {
                throw new Error('"more" Parameter has incorrect type. Must be boolean');
            }
        }
    }
}

export default PageParamsCalculator;
