/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import rk = require('i18n!Controls');
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_dropdown/Toggle/Toggle');
import { Memory } from 'Types/source';
import 'css!Controls/dropdown';

interface IToggleOptions extends IControlOptions {
    selectedKeys: boolean[];
}

const items = [
    {
        key: true,
        title: rk('Да'),
        icon: 'icon-Successfully',
        iconStyle: 'success',
    },
    { key: false, title: rk('Нет'), icon: 'icon-Decline', iconStyle: 'danger' },
];

/**
 * Контрол, позволяющий выбрать значение из списка. Отображается в виде выпадающего списка с тремя значениями: "Да", "Нет" и "Не выбрано".
 * @remark
 * Меню можно открыть кликом на контрол. Для работы единичным параметром selectedKeys используйте контрол с {@link Controls/source:SelectedKey}.
 *
 * @extends UI/Base:Control
 * @implements Controls/interface:IMultiSelectable
 * @demo Controls-demo/dropdown_new/Toggle/Simple/Index
 *
 * @public
 */
export default class Toggle extends Control<IToggleOptions> {
    protected _template: TemplateFunction = template;
    protected _source: Memory;
    protected _selectedKeys: boolean[];

    _beforeMount(options: IToggleOptions): void {
        this._selectedKeys = options.selectedKeys || [null];
        this._source = new Memory({
            data: items,
            keyProperty: 'key',
        });
    }

    _beforeUpdate(options: IToggleOptions): void {
        if (options.selectedKeys !== this._options.selectedKeys) {
            this._selectedKeys = options.selectedKeys;
        }
    }
}

/**
 * @name Controls/dropdown:Toggle#selectedKeys
 * @cfg {Array.<Boolean|null>} Массив с единственным элементом, который указывает на выбранный элемент.
 * @remark
 * Соответствие значений элемента массива:
 * * true — пункт "Да".
 * * false — пункт "Нет".
 * * null — пункт "Не выбрано".
 * @default [null]
 * @demo Controls-demo/dropdown_new/Toggle/SelectedKeys/Index
 */
