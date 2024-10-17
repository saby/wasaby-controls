/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_filterPopup/Panel/Dropdown/Dropdown');
import { List } from 'Types/collection';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Selector } from 'Controls/dropdown';
import 'css!Controls/filterPopup';
import { IStickyPopupOptions } from 'Controls/popup';

/**
 * Контрол, позволяющий выбрать значение из списка. Отображается в виде ссылки и используется на панели фильтров.
 * Текст ссылки отображает выбранные значения. Значения выбирают в выпадающем меню, которое по умолчанию скрыто.
 *
 * @remark
 * Меню можно открыть кликом на контрол. Для работы единичным параметром selectedKeys используйте контрол с {@link Controls/source:SelectedKey}.
 *
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filterPopup.less переменные тем оформления}
 *
 * @class Controls/_filterPopup/Panel/Dropdown
 * @extends Controls/dropdown:Selector
 * @public
 */

class FilterDropdown extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        selector: Selector;
    };

    openMenu(popupOptions?: IStickyPopupOptions): void {
        this._children.selector.openMenu(popupOptions);
    }

    closeMenu(): void {
        this._children.selector.closeMenu();
    }

    protected _selectedKeysChangedHandler(event: SyntheticEvent, keys: any[]): Boolean | undefined {
        return this._notify('selectedKeysChanged', [keys]);
    }

    protected _menuItemClickHandler(event: SyntheticEvent, item: Model): void {
        this._notify('menuItemClick', [item]);
    }

    protected _textValueChangedHandler(event: SyntheticEvent, text: string): void {
        this._notify('textValueChanged', [text]);
    }

    protected _selectorCallbackHandler(
        event: SyntheticEvent,
        initSelectorItems: List<Model>,
        selectedItems: List<Model>
    ): {} {
        return this._notify('selectorCallback', [initSelectorItems, selectedItems]);
    }

    protected _resetHandler(): void {
        this._notify('visibilityChanged', [false]);
    }

    protected _dropDownOpen(event: SyntheticEvent<Event>): void {
        this._notify('dropDownOpen');
    }

    protected _dropDownClose(event: SyntheticEvent<Event>): void {
        this._notify('dropDownClose');
    }

    static getDefaultOptions(): object {
        return {
            displayProperty: 'title',
        };
    }
}

export default FilterDropdown;
/**
 * @name Controls/_filterPopup/Panel/Dropdown#showCross
 * @cfg {Boolean} Показать крестик сброса рядом с выпадающим списком.
 * Используется для контрола в блоке "Отбираются".
 * По клику на крестик выпадающий список переместится в блок "Можно отобрать".
 * @default false
 * @example
 * <pre class="brush: html">
 * <Controls.filterPopup:Dropdown showCross="{{true}}"/>
 * </pre>
 */
