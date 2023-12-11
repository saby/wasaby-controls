/**
 * @kaizen_zone ed546588-e113-4fa9-a709-b37c7f5cc99c
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Record } from 'Types/entity';
import { isEqual } from 'Types/object';
import { RecordSet } from 'Types/collection';
import { TSortingValue } from 'Controls/interface';

import { ISortingSelectorOptions } from 'Controls/_sorting/interface/ISortingSelectorOptions';
import { ISortingParam } from 'Controls/_sorting/interface/ISortingParam';

import * as template from 'wml!Controls/_sorting/Selector/Selector';

import 'css!Controls/sorting';
import 'css!Controls/CommonClasses';

const iconSizeToInlineHeightMap = {
    '2xs': 's',
    xs: 's',
    s: 'm',
    m: 'xl',
    l: 'xl',
};

const DEFAULT_NOCAPTION_ICONSIZE = 'm';
const DEFAULT_WITHCAPTION_ICONSIZE = 's';

/**
 * Кнопка открытия меню сортировки реестра. Рекомендуется, если в реестре нет заголовков.
 * @remark В тулбаре используйте действие {@link Controls/actions:Sort Сортировка}. Подробнее про размещение кнопок в тулбаре читайте в статье {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/toolbar-config/ Настройка тулбара}.
 * @extends UI/Base:Control
 * @public
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IIconSize
 * @implements Controls/sorting:ISortingSelector
 * @demo Controls-demo/gridNew/Sorting/SortingSelector/Default/Index
 * @demo Controls-demo/gridNew/Sorting/SortingSelector/Icons/Index
 * @demo Controls-demo/gridNew/Sorting/SortingSelector/IconsSvg/Index В этом демо-примере показан полный список иконок, которые можно использовать для свойства {@link Controls/sorting:ISortingParam#icon icon} при настройка опции {@link sortingParams}.
 */
class Selector extends Control<ISortingSelectorOptions> {
    protected _template: TemplateFunction = template;
    private _selectedKeys: [number | string];
    private _currentParamName: string = null;
    private _currentIcon: string = '';
    private _currentCaption: string = '';
    private _orders: object = {};
    private _currentTitle: object = {};
    private _dropdownItems: RecordSet;
    private _saveLinkToItems: Function;
    private _items: RecordSet;
    // когда выбран пункт с иконкой, в вызывающем элементе отображается только иконка. У нее другой отступ.
    private _nocaption: boolean = false;
    private _arrowIconStyle: string;
    private _singleField: boolean;

    protected _beforeMount(options: ISortingSelectorOptions): void {
        this._saveLinkToItems = this._saveLinkToItemsFnc.bind(this);
        if (options.fontColorStyle) {
            this._arrowIconStyle = Selector._getIconStyleFromTextStyle(options.fontColorStyle);
        }
        this.updateConfig(options.sortingParams, options.value);
    }

    protected _beforeUpdate(newOptions: ISortingSelectorOptions): void {
        if (newOptions.fontColorStyle !== this._options.fontColorStyle) {
            this._arrowIconStyle = Selector._getIconStyleFromTextStyle(newOptions.fontColorStyle);
        }
        if (
            !isEqual(this._options.value, newOptions.value) ||
            !isEqual(this._options.sortingParams, newOptions.sortingParams)
        ) {
            this.updateConfig(newOptions.sortingParams, newOptions.value);
        }
    }

    protected _saveLinkToItemsFnc(items: RecordSet): void {
        this._items = items;
    }

    // надо сбросить стрелку, которая показывает текущее выбранное значение. Остальные оставляем
    protected _resetSelectedArrow(): void {
        if (this._options.value && this._options.value.length) {
            const curArrowValue = this._options.value[0][this._currentParamName] || 'ASC';
            this._items?.getRecordById(this._currentParamName)?.set('value', curArrowValue);
            this._orders[this._currentParamName] = curArrowValue;
        }
    }

    private updateConfig(sortingParams: [ISortingParam], value: [object] | undefined): void {
        const data = [];
        this._singleField = sortingParams.length === 1;
        if (value && value.length) {
            this._currentParamName = Object.keys(value[0])[0];
            this._orders[this._currentParamName] = value[0][this._currentParamName];
        } else {
            this._currentParamName = null;
        }
        sortingParams.forEach((item: ISortingParam) => {
            const dataElem = { ...item, value: '', readOnly: false };
            const key = item.paramName;
            if (this._orders[key]) {
                dataElem.value = this._orders[key];
            }
            if (dataElem.paramName === this._currentParamName) {
                this._selectedKeys = [this._currentParamName];
                this._currentCaption = dataElem.title;
                this._currentTitle =
                    {
                        ASC: dataElem.titleAsc,
                        DESC: dataElem.titleDesc,
                    }[this._orders[key]] || dataElem.title;
                if (dataElem.icon) {
                    this._nocaption = true;
                    this._arrowIconStyle = dataElem.iconStyle || 'secondary';
                    this._currentIcon = dataElem.icon;
                }
            }
            data.push(dataElem);
        });

        this._dropdownItems = new RecordSet({
            rawData: data,
            keyProperty: 'id',
        });
    }

    private _resetValue(): void {
        this._notify('valueChanged', [[]]);
    }

    private _getIcon(): string {
        if (this._currentIcon) {
            return (
                this._currentIcon +
                (this._currentParamName ? `_${this._orders[this._currentParamName]}` : '')
            );
        } else {
            if (this._currentParamName) {
                return 'Controls/sortIcons:arrow_' + this._orders[this._currentParamName];
            }
        }
    }

    private _getCaption(): string {
        if (!this._currentIcon) {
            return this._currentCaption;
        }
    }

    private _getTooltip(): string {
        if (!this._currentIcon) {
            return this._currentCaption;
        }
    }

    private _getButtonIconSize(): string {
        return (
            this._options.iconSize ||
            (this._nocaption ? DEFAULT_NOCAPTION_ICONSIZE : DEFAULT_WITHCAPTION_ICONSIZE)
        );
    }

    private _getButtonInlineHeight(): string {
        return this._options.viewMode !== 'linkButton'
            ? iconSizeToInlineHeightMap[this._getButtonIconSize()]
            : this._getButtonIconSize();
    }

    protected _dropdownItemClick(e: SyntheticEvent<Event>, key: number | string): boolean | void {
        if (key === null) {
            this._resetValue();
        } else {
            const order = this._orders[key] || 'ASC';
            this._setValue(key, key ? order : '');
        }
        this._children.dropdown.closeMenu();
        return false;
    }

    protected _selectedKeysChangedHandler(
        e: SyntheticEvent<Event>,
        [key]: [number | string]
    ): boolean | void {
        if (key === null) {
            this._resetValue();
        } else {
            const order = this._orders[key] || 'ASC';
            this._setValue(key, key ? order : '');
        }
    }

    private _setValue(param: string | number, order: string): void {
        const newValue = [];
        newValue[0] = {};
        newValue[0][param] = order;
        this._notify('valueChanged', [newValue]);
    }

    protected _switchValue(): void {
        const newValue: string = this._orders[this._currentParamName] === 'ASC' ? 'DESC' : 'ASC';
        this._setValue(this._currentParamName, newValue);
    }

    protected _arrowClick(e: SyntheticEvent<Event>, item: Record): void {
        const value = item.get('value') || 'ASC';
        const key = item.get('paramName');
        const newValue = Selector._getOppositeOrder(value);
        // для хранения текущих значений стрелок в выпадающем списке используем _orders
        // но список строится ТОЛЬКО по source и record полученным из него
        // для того чтобы перерисовать стрелку в списке пишем еще в и рекорд
        item.set('value', newValue);
        this._orders[key] = newValue;
    }

    protected static _getIconStyleFromTextStyle(fontStyle: string): string {
        let iconStyle: string;
        if (fontStyle === 'link') {
            iconStyle = 'secondary';
        } else {
            iconStyle = fontStyle || 'secondary';
        }

        return iconStyle;
    }

    protected static _getOppositeOrder = (order: TSortingValue) => {
        if (order === 'DESC' || !order) {
            return 'ASC';
        }
        return 'DESC';
    };

    static getDefaultOptions(): Partial<ISortingSelectorOptions> {
        return {
            viewMode: 'linkButton',
            menuIconSize: 'm',
        };
    }
}

/**
 * @event valueChanged Происходит при изменении выбранной сортировки.
 * @name Controls/_sorting/Selector#valueChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Object>} value Новое значение.
 */

export default Selector;
