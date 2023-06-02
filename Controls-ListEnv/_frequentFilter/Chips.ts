/**
 * @kaizen_zone 791267ec-c189-4684-9985-befef0ad3120
 */
import { TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_frequentFilter/Chips/Chips';
import Base from 'Controls-ListEnv/_frequentFilter/Toggle/Base';

/**
 * Контрол - "Переключатель фильтра".
 * Реализует UI для отображения и редактирования фильтра с помощью контрола {@link Controls/Chips:Control}.
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики (@link /doc/platform/developmentapl/interface-development/controls/data-store/ подробнее можно почитать тут).
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
