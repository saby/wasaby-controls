/**
 * @kaizen_zone 36b6051b-790d-4170-b31c-ecc1485a7232
 */

const MAX_HISTORY = 10;

const Constants = {
    /**
     * Константы, необходимые для работы с историей выбора.
     * @remark
     * Список констант:
     *
     * * MAX_HISTORY — максимальное число элементов, которые сохраняются историей выбора.
     * * MAX_HISTORY_REPORTS — максимальное число элементов на <a href="/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter/filter-view/">Панели фильтров</a>, которые сохраняются историей выбора.
     * * MIN_RECENT — минимальное число элементов <a href="/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter/filter-view/">Панели фильтров</a>, сохраняемых для блока "Ранее отбирались".
     * @class Controls/_history/Constants
     * @public
     */
    /**
     * The maximum count of history
     */
    MAX_HISTORY,

    /**
     * The minimum count of recent item
     */
    MIN_RECENT: 3,
    HISTORY_CONFIG: {
        pinned: MAX_HISTORY,
        recent: MAX_HISTORY,
        frequent: 0,
    },
};

export = Constants;
