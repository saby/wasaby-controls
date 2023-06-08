/**
 * @kaizen_zone 791267ec-c189-4684-9985-befef0ad3120
 */
import { TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_frequentFilterConnected/Chips/Chips';
import Base from 'Controls-ListEnv/_frequentFilterConnected/Toggle/Base';

/**
 * Контрол - "Переключатель фильтра".
 * Реализует UI для отображения и редактирования фильтра с помощью контрола {@link Controls/Chips:Control}.
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики. Подробнее можно прочитать в {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ статье}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настроке фильтра на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @public
 *
 * @class Controls-ListEnv/frequentFilterConnected:Chips
 * @implements Controls/interface:IItems
 * @implements Controls/interface:IStoreId
 * @mixes Controls-ListEnv/filter:IFilterNames
 * @extends Controls/Chips:Control
 * @ignoreOptions items selectedKeys allowEmptySelection
 *
 * @demo Controls-ListEnv-demo/FrequentFilter/Chips/Index
 * @see Controls/filter:View
 */

export default class FilterChipsWidget extends Base {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: unknown = [];

    protected _updateValue(value: unknown): void {
        this._selectedKeys = value || [];
    }
}
