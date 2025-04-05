/**
 * @kaizen_zone 1eafdb06-eb75-4353-b8d8-60b6cf34618f
 */

/**
 * Модуль с утилитами для работы сервисными настройками в фильтрах
 * @private
 */

const SERVICE_FILTERS = {
    HIERARCHY: {
        Разворот: 'С разворотом',
        usePages: 'full',
    },
};

/**
 * Добавляет к конфигурации фильтров сервисные настройки
 * @param {unknown} searchController
 * @param {object} filter
 * @param {string} forced
 */
function _assignServiceFilters(searchController, filter: object, forced): void {
    if (
        forced ||
        (searchController._options &&
            searchController._options.parentProperty &&
            searchController._viewMode !== 'search')
    ) {
        Object.assign(filter, SERVICE_FILTERS.HIERARCHY);
    }
}

/**
 * Удаляет из конфигурации фильтров сервисные настройки
 * @param {object} options
 * @param {object} filter
 */
function _deleteServiceFilters(options, filter: object): void {
    if (options.parentProperty) {
        for (const i in SERVICE_FILTERS.HIERARCHY) {
            if (SERVICE_FILTERS.HIERARCHY.hasOwnProperty(i)) {
                delete filter[i];
            }
        }
    }
}

export { _assignServiceFilters, _deleteServiceFilters };
