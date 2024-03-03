/**
 * @kaizen_zone 1eafdb06-eb75-4353-b8d8-60b6cf34618f
 */
const SERVICE_FILTERS = {
    HIERARCHY: {
        Разворот: 'С разворотом',
        usePages: 'full',
    },
};

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
