/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { query } from 'Application/Env';
import { isEqual, isEmpty } from 'Types/object';
import { Serializer } from 'UI/State';
import { IFilterItem } from 'Controls/_filter/View/interface/IFilterItem';
import { getConfig } from 'Application/Env';

interface IQueryParams {
    /**
     * @cfg {string} Фильтр в формате JSON string.
     */
    filter?: string;
    /**
     * @cfg {boolean} Опция для очистки текущих query-параметров.
     */
    replace?: boolean;
}

/**
 * Возвращает объект, содержащий фильтр для последующего сохранения его в праметры url.
 * @param {IFilterItem[]} filterButtonItems Массив элементов фильтра
 * @returns IQueryParams
 */
export function getQueryParamsByFilter(filterButtonItems: IFilterItem[]): IQueryParams {
    const filterItems = [];

    for (const item of filterButtonItems) {
        if (!isEqual(item.value, item.resetValue)) {
            filterItems.push({
                name: item.name,
                value: item.value,
                textValue: item.textValue,
                visibility: item.visibility,
            });
        }
    }

    const applicationSerializer = new Serializer();
    let queryParams = {};

    if (filterItems.length) {
        queryParams = {
            filter: JSON.stringify(filterItems, applicationSerializer.serialize),
        };
    }

    return queryParams;
}

/**
 * Обновляет url, добавляя в него параметры фильтрации
 * @param {IFilterItem[]} filterButtonItems Массив элементов фильтра
 * @returns void
 */
export function updateUrlByFilter(filterButtonItems: IFilterItem[]): void {
    const queryParams = getQueryParamsByFilter(filterButtonItems);
    if (isEmpty(queryParams)) {
        queryParams.replace = true;
    }

    // eslint-disable-next-line
    import('Router/router').then((router) => {
        const state = router.MaskResolver.calculateQueryHref(queryParams);

        // Нужно убрать название точки входа (например, OnlineSbisRu) из ссылки на страницу.
        // Если страница на сервисе, то точка входа в урл не добавляется и удалять ее, соответственно, не нужно.
        // Высчитываем с какой позиции начинается чистый урл и убираем точку входа из урл.
        const service = getConfig('appRoot');

        let href;
        if (!service || service === '/') {
            const pageIndex = state.indexOf('/page/');
            href = state.substring(pageIndex);
        }

        router.History.replaceState({ state, href });
    });
}

/**
 * Возвращает элементы фильтра, взятые из url
 * @returns void | IFilterItem[]
 */
export function getFilterFromUrl(): void | IFilterItem[] {
    const urlFilter = query.get.filter;

    if (!urlFilter) {
        return;
    }

    const applicationSerializer = new Serializer();

    return JSON.parse(decodeURIComponent(urlFilter), applicationSerializer.deserialize);
}
