/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import FilterView, { IFilterViewWidgetOptions } from 'Controls-ListEnv/_filterConnected/View';
import { connectToDataContext } from 'Controls/context';

export interface IFilterCompatibleViewOptions extends IFilterViewWidgetOptions {
    detailPanelTemplateName?: string;
}

/**
 * Контрол "Объединённый фильтр" совместимый со старой панелью Controls/filterPopup:DetailPanel.
 * Реализует UI для отображения и редактирования фильтра с помощью контрола {@link Controls/filter:View}.
 * Может отображать окно фильтров или выступать в качестве быстрого фильтра.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настроке фильтра на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @public
 *
 * @class Controls-ListEnv/filterConnected:CompatibleView
 * @extends Controls-ListEnv/filterConnected:View
 * @ignoreOptions detailPanelTemplateOptions source
 * @ignoreEvents filterChanged itemsChanged
 * @ignoreMethods openDetailPanel reset
 *
 * @demo Controls-ListEnv-demo/Filter/CompatibleView/Index
 * @see Controls/filter:View
 * @see Controls-ListEnv/filterPanelConnected:Widget
 */

class FilterViewWidget extends FilterView {
    readonly _options: IFilterCompatibleViewOptions;

    protected _getDetailPanelName(): string {
        return this._options.detailPanelTemplateName;
    }
}

export default connectToDataContext(FilterViewWidget);
