/**
 * @kaizen_zone 2ff0f2e5-8299-42f9-b53d-20ee616c3f9b
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
// @ts-ignore
import * as template from 'wml!Controls/_lookup/Button/SelectorButton';
import { default as BaseLookup, ILookupOptions } from 'Controls/_lookup/BaseLookup';
import { SelectedItems } from './BaseControllerClass';
import showSelector from 'Controls/_lookup/showSelector';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
import { EventUtils } from 'UI/Events';
import { List } from 'Types/collection';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
// @ts-ignore
import { default as itemTemplate } from './SelectedCollection/ItemTemplate';
import { IValidationStatusOptions, TValidationStatus } from '../_interface/IValidationStatus';
// @ts-ignore
import rk = require('i18n!Controls');
import { IFontColorStyleOptions, IFontSizeOptions } from 'Controls/interface';
import { StackOpener } from 'Controls/popup';

export interface ISelectorButtonOptions
    extends IControlOptions,
        IValidationStatusOptions,
        ILookupOptions,
        IFontColorStyleOptions,
        IFontSizeOptions {
    buttonStyle: string;
    maxVisibleItems: number;
    itemTemplate: TemplateFunction;
    showSelectorCaption: string;
    showClearButton?: boolean;
}

/**
 * Кнопка-ссылка с возможностью выбора значений из справочника.
 *
 * @remark
 * Выбранные значения отображаются в виде текста с кнопкой удаления.
 * Поддерживает одиночный и множественный выбор.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/directory/button/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/897d41142ed56c25fcf1009263d06508aec93c32/Controls-default-theme/variables/_lookup.less переменные тем оформления}
 *
 *
 * @class Controls/_lookup/Button
 * @extends UI/Base:Control
 * @implements Controls/interface:ILookup
 * @implements Controls/interface/ISelectedCollection
 * @implements Controls/interface:ISelectorDialog
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISelectFields
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:ITextValue
 * @implements Controls/interface:IItems
 *
 * @public
 * @demo Controls-demo/Lookup/Selector/Index
 */
/*
 * Button link with the specified text, on clicking on which a selection window opens.
 *
 * @class Controls/_lookup/Button
 * @extends UI/Base:Control
 * @implements Controls/interface/ISelectedCollection
 * @implements Controls/interface:ITextValue
 * @implements Controls/interface:ISelectorDialog
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:ISource
 *
 * @public
 * @author Герасимов А.М.
 * @demo Controls-demo/Lookup/Selector/Index
 */
export default class Button extends BaseLookup<ISelectorButtonOptions> {
    protected _template: TemplateFunction = template;
    protected _notifyHandler: Function = EventUtils.tmplNotify;
    protected _opener: StackOpener = null;

    constructor(...args) {
        super(...args);
        this._itemClickHandler = this._itemClickHandler.bind(this);
        this._removeItemHandler = this._removeItemHandler.bind(this);
        this._closeInfobox = this._closeInfobox.bind(this);
        this._reset = this._reset.bind(this);
        this._showSelectorHandler = this._showSelectorHandler.bind(this);
    }

    showSelector(popupOptions?: IStackPopupOptions): void {
        return showSelector(this, popupOptions, this._options.multiSelect);
    }

    protected _reset(): void {
        if (this._options.hasOwnProperty('selectedKeys')) {
            this._notify('selectedKeysChanged', [[], [], this._options.selectedKeys]);
        } else {
            this._updateItems(new List());
        }
    }

    protected _closeInfobox(): void {
        this._notify('closeInfoBox');
    }

    protected _itemClickHandler(
        event: SyntheticEvent<Event>,
        item: Model
    ): Promise<boolean | void> {
        this._notify('itemClick', [item]);

        if (!this._options.readOnly && !this._options.multiSelect) {
            return this._showSelector();
        }
    }

    protected _removeItemHandler(event: SyntheticEvent, item: Model): void {
        this._removeItem(item);
    }

    protected _showSelectorHandler(): void {
        this._showSelector();
    }

    protected _joinItems(items: SelectedItems): void {
        this._items = this._lookupController.getItems();
        this._items.prepend(items);
        this._lookupController.setItems(this._items);
    }

    protected _inheritorBeforeMount(options: ILookupOptions): void {
        return undefined;
    }

    protected _inheritorBeforeUpdate(options: ILookupOptions): void {
        return undefined;
    }

    protected _itemsChanged(): void {
        return undefined;
    }

    protected _beforeUnmount(): void {
        this._opener?.destroy();
    }

    static getDefaultOptions = (): ISelectorButtonOptions => {
        const buttonOptions = {
            fontColorStyle: 'link',
            fontSize: 'm',
            buttonStyle: 'secondary',
            maxVisibleItems: 7,
            itemTemplate,
            showSelectorCaption: `+${rk('еще')}`,
            showClearButton: true,
            validationStatus: 'valid' as TValidationStatus,
        };
        const baseOptions = BaseLookup.getDefaultOptions();
        return { ...buttonOptions, ...baseOptions } as ISelectorButtonOptions;
    };
}

/**
 * @name Controls/_lookup/Button#showSelectorCaption
 * @cfg {String} Заголовок кнопки, открывающей окно выбора записей из справочника
 * @remark Если опцию передать в виде пустой строки или null, то кнопка открытия справочника отображаться не будет
 * @demo Controls-demo/LookupNew/SelectorButton/ShowSelectorCaption/Index
 * @example
 * <pre class="brush: html">
 * <Controls.lookup:Selector
 *    source="{{_sourceButton}}"
 *    displayProperty="title"
 *    keyProperty="id"
 *    showSelectorCaption="+компания"
 *    caption="Выберите компанию">
 * </Controls.lookup:Selector>
 * </pre>
 */

/**
 * @name Controls/_lookup/Button#caption
 * @cfg {String} Заголовок кнопки-ссылки, отображающейся при невыбранном значении и открывающей окно выбора записей из справочника
 * @example
 * <pre class="brush: html">
 * <Controls.lookup:Selector
 *    source="{{_sourceButton}}"
 *    displayProperty="title"
 *    keyProperty="id"
 *    caption="Выберите компанию">
 * </Controls.lookup:Selector>
 * </pre>
 */
