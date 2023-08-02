/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, TemplateFunction } from 'UI/Base';
import LookupTemplate = require('wml!Controls/_filterPopup/Panel/HierarchyLookup/HierarchyLookup');
import 'css!Controls/filterPopup';

import { factory } from 'Types/chain';

/**
 * Обертка над контролом {@link Controls/_filterPopup/Panel/Lookup Controls/filterPopup:Lookup} для работы с иерархическим фильтром.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filterPopup.less переменные тем оформления}
 *
 * @class Controls/_filterPopup/Panel/HierarchyLookup
 * @extends UI/Base:Control
 * @implements Controls/interface:IMultiSelectable
 * @public
 *
 */

class HierarchyLookup extends Control {
    protected _template: TemplateFunction = LookupTemplate;
    protected _selectedKeys: number[] | string[];

    protected _beforeMount(options: object): void {
        this._selectedKeys = options.selectedKeys
            ? factory(options.selectedKeys).flatten().value()
            : options.selectedKeys;
    }

    protected _beforeUpdate(newOptions: object): void {
        if (newOptions.selectedKeys && this._options.selectedKeys !== newOptions.selectedKeys) {
            this._selectedKeys = newOptions.selectedKeys
                ? factory(newOptions.selectedKeys).flatten().value()
                : newOptions.selectedKeys;
        }
    }

    protected _itemsChanged(event: Event, items: object): void {
        if (items) {
            const selectedKeys = {};
            factory(items).each((item) => {
                const parentId =
                    item.get(this._options.parentProperty) || item.get(this._options.keyProperty);
                selectedKeys[parentId] = selectedKeys[parentId] || [];
                selectedKeys[parentId].push(item.get(this._options.keyProperty));
            });
            this._notify('selectedKeysChanged', [selectedKeys]);
        }
    }
}

/**
 * @name Controls/_filterPopup/Panel/HierarchyLookup#keyProperty
 * @cfg {String} Имя свойства, уникально идентифицирующего элемент коллекции.
 */

/**
 * @name Controls/_filterPopup/Panel/HierarchyLookup#parentProperty
 * @cfg {String} Имя свойства, содержащего информацию о родительском узле элемента.
 */

export default HierarchyLookup;
