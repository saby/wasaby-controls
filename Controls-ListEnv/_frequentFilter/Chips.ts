import { TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_frequentFilter/Chips/Chips';
import Base from 'Controls-ListEnv/_frequentFilter/Toggle/Base';

/**
 * Виджет - "Переключатель фильтра".
 * Реализует UI для отображения и редактирования фильтра с помощью контрола {@link Controls/Chips:Control}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настроке фильтра на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @public
 *
 * @class Controls-ListEnv/frequentFilter:Chips
 * @implements Controls/interface:IItems
 * @implements Controls/interface:IStoreId
 * @extends Controls/Chips:Control
 * @ignoreOptions items selectedKeys allowEmptySelection
 *
 * @demo Engine-demo/Controls-widgets/FilterChips/Index
 * @see Controls/filter:View
 */

export default class FilterChipsWidget extends Base {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: unknown = [];

    protected _updateValue(value: unknown): void {
        this._selectedKeys = value || [];
    }
}
