import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import * as ListTemplate from 'wml!Controls/_filterPanel/Editors/List';
import * as ColumnTemplate from 'wml!Controls/_filterPanel/Editors/resources/ColumnTemplate';
import * as AdditionalColumnTemplate from 'wml!Controls/_filterPanel/Editors/resources/AdditionalColumnTemplate';
import * as CircleTemplate from 'wml!Controls/_filterPanel/Editors/resources/CircleTemplate';
import {StackOpener, DialogOpener} from 'Controls/popup';
import {BaseEditor} from 'Controls/_filterPanel/Editors/Base';
import {Model} from 'Types/entity';
import {
    IFilterOptions,
    ISourceOptions,
    INavigationOptions,
    INavigationOptionValue,
    IItemActionsOptions,
    ISelectorDialogOptions
} from 'Controls/interface';
import {IList} from 'Controls/list';
import {IColumn} from 'Controls/grid';
import {List, RecordSet} from 'Types/collection';
import {factory} from 'Types/chain';
import {isEqual} from 'Types/object';
import * as Clone from 'Core/core-clone';
import 'css!Controls/toggle';
import 'css!Controls/filterPanel';

export interface IListEditorOptions extends IControlOptions, IFilterOptions, ISourceOptions,
    INavigationOptions<unknown>, IItemActionsOptions, IList, IColumn, ISelectorDialogOptions {
    propertyValue: number[]|string[];
    additionalTextProperty: string;
    imageProperty?: string;
    multiSelect: boolean;
}

/**
 * Контрол используют в качестве редактора для выбора значений из списка на {@link Controls/filterPanel:View панели фильтров}.
 * @class Controls/_filterPanel/Editors/List
 * @extends Core/Control
 * @mixes Controls/grid:IGridControl
 * @mixes Controls/interface:INavigation
 * @author Мельникова Е.А.
 * @public
 */

/**
 * @name Controls/_filterPanel/Editors/List#additionalTextProperty
 * @cfg {String} Имя свойства, содержащего информацию об идентификаторе дополнительного столбца в списке.
 * @demo Controls-demo/filterPanel/ListEditor/AdditionalTextProperty/Index
 */

/**
 * @name Controls/_filterPanel/Editors/List#imageProperty
 * @cfg {String} Имя свойства, содержащего ссылку на изображение для элемента списка.
 * @demo Controls-demo/filterPanel/View/Index
 */

/**
 * @name Controls/_filterPanel/Editors/List#style
 * @cfg {String} Стиль отображения чекбокса в списке.
 * @variant default
 * @variant master
 * @default default
 */

/**
 * @name Controls/_filterPanel/Editors/List#multiSelect
 * @cfg {boolean} Определяет, установлен ли множественный выбор.
 * @demo Controls-demo/filterPanel/ListEditor/MultiSelect/Index
 * @default false
 */

class ListEditor extends BaseEditor {
    protected _template: TemplateFunction = ListTemplate;
    protected _circleTemplate: TemplateFunction = CircleTemplate;
    protected _columns: object[] = null;
    protected _popupOpener: StackOpener|DialogOpener = null;
    protected _items: RecordSet = null;
    protected _selectedKeys: string[]|number[] = [];
    protected _filter: object = {};
    protected _navigation: INavigationOptionValue<unknown> = null;
    protected _editorTarget: HTMLElement | EventTarget;
    private _itemsReadyCallback: Function = null;

    protected _beforeMount(options: IListEditorOptions): void {
        this._selectedKeys = options.propertyValue;
        this._setColumns(options, options.propertyValue);
        this._itemsReadyCallback = this._handleItemsReadyCallback.bind(this);
        this._setFilter(this._selectedKeys, options.filter, options.keyProperty);
        this._navigation = options.navigation;
    }

    protected _beforeUpdate(options: IListEditorOptions): void {
        const valueChanged =
            !isEqual(options.propertyValue, this._options.propertyValue) &&
            !isEqual(options.propertyValue, this._selectedKeys);
        const filterChanged = !isEqual(options.filter, this._options.filter);
        const displayPropertyChanged = options.displayProperty !== this._options.displayProperty;
        const additionalDataChanged = options.additionalTextProperty !== this._options.additionalTextProperty;
        if (additionalDataChanged || valueChanged || displayPropertyChanged) {
            this._selectedKeys = options.propertyValue;
            this._setColumns(options, options.propertyValue);
            this._navigation = this._getNavigation(options);
        }
        if (filterChanged || valueChanged) {
            this._setFilter(this._selectedKeys, options.filter, options.keyProperty);
        }
    }

    protected _handleItemsReadyCallback(items: RecordSet): void {
        if (!this._items) {
            this._items = items;
        }
    }

    protected _handleItemClick(event: SyntheticEvent, item: Model, nativeEvent: SyntheticEvent): void {
        const contentClick = nativeEvent.target.closest('.controls-ListEditor__columns');
        if (contentClick) {
            const selectedKeysArray = this._options.multiSelect ? Clone(this._selectedKeys) : [];
            const itemkey = item.get(this._options.keyProperty);
            if (!selectedKeysArray.includes(itemkey)) {
                selectedKeysArray.unshift(item.get(this._options.keyProperty));
            }
            this._editorTarget = this._getEditorTarget(nativeEvent);
            this._processPropertyValueChanged(selectedKeysArray, selectedKeysArray.length === 1);
        }
    }

    protected _handleSelectedKeysChanged(event: SyntheticEvent, keys: string[]|number[]): void {
        this._processPropertyValueChanged(keys, !this._options.multiSelect);
    }

    protected _handleCheckBoxClick(event: SyntheticEvent, keys: string[]|number[]): void {
        this._editorTarget = this._getEditorTarget(event);
    }

    protected _handleSelectedKeyChanged(event: SyntheticEvent, key: string|number): void {
        this._processPropertyValueChanged([key], !this._options.multiSelect);
    }

    protected _handleSelectorResult(result: Model[]): void {
        const selectedKeys = [];
        result.forEach((item) => {
            selectedKeys.push(item.get(this._options.keyProperty));
        });
        if (selectedKeys.length) {
            this._items.assign(result);
            this._setFilter(selectedKeys, this._options.filter, this._options.keyProperty);
        }
        this._navigation = this._getNavigation(this._options, selectedKeys);
        this._processPropertyValueChanged(selectedKeys, !this._options.multiSelect);
    }

    protected _handleFooterClick(event: SyntheticEvent): void {
        const selectorOptions = this._options.selectorTemplate;
        this._getPopupOpener(selectorOptions.mode).open({
            ...{
                opener: this,
                templateOptions: {
                    ...selectorOptions.templateOptions,
                    ...{
                        selectedKeys: this._selectedKeys,
                        selectedItems: this._getSelectedItems(),
                        multiSelect: this._options.multiSelect
                    }
                },
                template: selectorOptions.templateName,
                eventHandlers: {
                    onResult: this._handleSelectorResult.bind(this)
                }
            },
            ...selectorOptions.popupOptions
        });
    }

    protected _processPropertyValueChanged(value: string[] | number[], needCollapse: boolean): void {
        this._selectedKeys = value;
        this._setColumns(this._options, this._selectedKeys);
        this._notifyPropertyValueChanged(needCollapse);
    }

    protected _getExtendedValue(needCollapse?: boolean): object {
        return {
            value: this._selectedKeys,
            textValue: this._getTextValue(this._selectedKeys),
            needCollapse
        };
    }

    protected _setColumns(options: IListEditorOptions, propertyValue: string[]|number[]): void {
        this._columns = [{
            template: ColumnTemplate,
            selected: propertyValue,
            displayProperty: options.displayProperty,
            keyProperty: options.keyProperty,
            imageProperty: options.imageProperty
        }];
        if (options.additionalTextProperty) {
            this._columns.push({
                template: AdditionalColumnTemplate,
                align: 'right',
                displayProperty: options.additionalTextProperty,
                width: 'auto'});
        }
    }

    protected _beforeUnmount(): void {
        if (this._popupOpener) {
            this._popupOpener.destroy();
        }
    }

    private _setFilter(selectedKeys: string[]|number[], filter: object, keyProperty: string): void {
        this._filter = {...filter};
        if (selectedKeys && selectedKeys.length) {
            this._filter[keyProperty] = selectedKeys;
        }
    }

    private _getEditorTarget(event: SyntheticEvent): HTMLElement | EventTarget {
        return event.target.closest('.controls-Grid__row').lastChild;
    }

    private _getNavigation(options: IListEditorOptions, selectedKeys?: string[]): INavigationOptionValue<unknown> {
        const selectedKeysArray = selectedKeys || this._selectedKeys;
        return selectedKeysArray.length ? null : options.navigation;
    }

    private _getSelectedItems(): List<Model> {
        const selectedItems = [];
        factory(this._selectedKeys).each((key) => {
            const record = this._items.getRecordById(key);
            if (record) {
                selectedItems.push(record);
            }
        });
        return new List({
            items: selectedItems
        });
    }

    private _getTextValue(selectedKeys: number[]|string[]|Model[]): string {
        const textArray = [];
        selectedKeys.forEach((item, index) => {
            const record = this._items.getRecordById(item);
            if (record) {
                textArray.push(record.get(this._options.displayProperty));
            } else {
                textArray.push(item.get(this._options.displayProperty));
            }
        });
        return textArray.join(', ');
    }

    private _getPopupOpener(mode?: string): StackOpener|DialogOpener {
        if (!this._popupOpener) {
            this._popupOpener = mode === 'dialog' ? new DialogOpener() : new StackOpener();
        }
        return this._popupOpener;
    }

    static getDefaultOptions(): object {
        return {
            propertyValue: [],
            style: 'default',
            itemPadding: {
                right: 'm'
            }
        };
    }
}

Object.defineProperty(ListEditor, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return ListEditor.getDefaultOptions();
   }
});

export default ListEditor;
