/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import * as React from 'react';
import _View, { IFilterViewWidgetOptions } from './View/_View';

/**
 * Контрол "Объединённый фильтр" совместимый со старой панелью Controls/filterPopup:DetailPanel.
 * Реализует UI для отображения и редактирования фильтра с помощью контрола {@link Controls/filter:View}.
 * Может отображать окно фильтров или выступать в качестве быстрого фильтра.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настройке фильтра на странице}
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
function FilterCompatibleView(props: IFilterViewWidgetOptions, ref) {
    const getDetailPanelName = React.useCallback(() => {
        return props.detailPanelTemplateName;
    }, [props.detailPanelTemplateName]);
    return <_View {...props}
                 getDetailPanelName={getDetailPanelName}
    />;
}

export default React.forwardRef(FilterCompatibleView);