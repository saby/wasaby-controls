/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * Тип значения навигации по крошкам в режиме поиска
 * @typedef Controls/_interface/ISearchBreadcrumbs/TSearchNavigationMode
 * @variant open В {@link Controls/_explorer/interface/IExplorerOptions#viewMode режиме поиска} при клике на хлебную крошку происходит проваливание в данный узел.
 * @variant expand В режиме поиска при клике на хлебную крошку данные отображаются от корня, путь до узла разворачивается.
 * @variant readonly В режиме поиска хлебные крошки не кликаются и не подсвечиваются
 */
export type TSearchNavigationMode = 'open' | 'expand' | 'readonly';

/**
 * Интерфейс контролов, которые поддерживают поиск с выводом хлебных крошек
 * @interface Controls/_interface/ISearchBreadcrumbs
 * @public
 */
export default interface ISearchBreadcrumbsOptions {
    '[Controls/_штеукафсу:ISearchBreadcrumbs]': boolean;

    /**
     * @name Controls/_interface/ISearchBreadcrumbs#searchNavigationMode
     * @cfg {Controls/_interface/ISearchBreadcrumbs/TSearchNavigationMode.typedef} Режим навигации при поиске в иерархическом проводнике.
     * @default open
     * @demo Controls-ListEnv-demo/Search/Explorer/SearchNavigationMode/Expand/Index
     */
    searchNavigationMode?: TSearchNavigationMode;
}
