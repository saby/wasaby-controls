/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_popup/WasabyOpeners/Edit/Container');
import { IContextOptionsValue } from 'Controls/context';
import { RecordSet } from 'Types/collection';

interface IContainerOptions extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}
/**
 * Контрол используют в качестве контейнера для {@link Controls/popup:Edit}. Он получает данные и передаёт их в Controls/popup:Edit.
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @see Controls/popup:Edit
 * @see Controls/listDataOld:DataContainer
 * @see Controls/popupTemplate:Stack
 * @see Controls/form:Controller
 * @public
 * @remark
 * Подробнее об организации поиска и фильтрации в реестре читайте {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ здесь}.
 * Подробнее о классификации контролов Wasaby и схеме их взаимодействия читайте {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/component-kinds/ здесь}.
 */
class Container extends Control<IContainerOptions> {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;

    _beforeMount(options: IContainerOptions): void {
        this._updateItems(options);
    }
    _beforeUpdate(options: IContainerOptions): void {
        this._updateItems(options);
    }
    _updateItems(options: IContainerOptions): void {
        const dataOptionsValue = options._dataOptionsValue;
        const context = dataOptionsValue?._dataSyntheticStoreId || dataOptionsValue;
        if (context && context.items) {
            this._items = context.items;
        }
    }
}

export default Container;
