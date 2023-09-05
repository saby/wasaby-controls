/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanel/Editors/Lookup/_BaseLookup';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Selector, ILookupOptions } from 'Controls/lookup';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { RecordSet, List, factory as CollectionFactory, IList } from 'Types/collection';
import { Model } from 'Types/entity';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { isEqual } from 'Types/object';
import { TKey, ISuggestTemplateProp } from 'Controls/interface';
import { IBaseEditor } from 'Controls/_filterPanel/BaseEditor';
import { IBaseLookupEditorOptions, ILookupEditor } from './interface/ILookupEditor';
import { IFrequentItem } from 'Controls/_filterPanel/Editors/resources/IFrequentItem';
import { IData, ICrud } from 'Types/source';
import { factory } from 'Types/chain';
import { descriptor, format } from 'Types/entity';
import 'css!Controls/filterPanel';

export interface ILookupEditorOptions
    extends ILookupOptions,
        IFrequentItem,
        IBaseLookupEditorOptions,
        IBaseEditor {
    propertyValue: TKey | TKey[];
    resetValue: TKey | TKey[];
    keyProperty: string;
    displayProperty: string;
    multiSelect?: boolean;
    sourceController?: SourceController;
    suggestTemplate?: ISuggestTemplateProp;
    suggestItemTemplate?: string;
    searchParam?: string;
}

/**
 * Контрол используют в качестве редактора для выбора значения из справочника.
 * @class Controls/_filterPanel/Editors/Lookup/_BaseLookup
 * @extends Controls/lookup:Input
 * @demo Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/Base/Index
 * @public
 */

class LookupEditor extends Control<ILookupEditorOptions> implements ILookupEditor {
    readonly '[Controls/_filterPanel/Editors/Lookup/interface/ILookupEditor]': boolean = true;
    protected _template: TemplateFunction = template;
    protected _textValue: string;
    protected _sourceController: SourceController;
    protected _items: RecordSet | List<Model>;
    protected _suggestTemplate: ISuggestTemplateProp;
    protected _children: {
        lookupEditor: Selector;
    };

    protected _beforeMount(options: ILookupEditorOptions): void {
        this._suggestTemplate = this._getSuggestTemplate(options);
        this._sourceControllerItemsChanged = this._sourceControllerItemsChanged.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);

        if (options.sourceController) {
            this._initSourceController(options);
            this._initItems(options);
        }
        if (options.textValue) {
            this._textValue = options.textValue;
        }
    }

    protected _beforeUpdate(newOptions: ILookupEditorOptions): void {
        const propertyValueChanged = newOptions.propertyValue !== this._options.propertyValue;
        const textValueChanged = newOptions.textValue !== this._options.textValue;
        if (newOptions.sourceController !== this._options.sourceController) {
            if (newOptions.sourceController) {
                this._unsubscribeOnSourceControllerEvents();
                this._initSourceController(newOptions);
                this._initItems(newOptions);
            } else {
                this._unsubscribeOnSourceControllerEvents();
            }
        } else if (propertyValueChanged && this._isEmptyTextSelected(newOptions)) {
            this._items = this._getItemsByPropValueAndTextValue(newOptions, newOptions.emptyText);
        }
        if (textValueChanged) {
            this._textValue = newOptions.textValue;
        }
    }

    protected _beforeUnmount(): void {
        this._unsubscribeOnSourceControllerEvents();
    }

    private _initSourceController({
        sourceController,
        filterViewMode,
        editorsViewMode,
    }: ILookupEditorOptions): void {
        if (filterViewMode === 'popup' || editorsViewMode === 'cloud') {
            this._unsubscribeOnSourceControllerEvents();
            this._sourceController = sourceController;
            this._subscribeOnSourceControllerEvents();
        }
    }

    private _initItems(options: ILookupEditorOptions): void {
        let isItemInSourceController;

        if (!options.multiSelect) {
            isItemInSourceController = this._sourceController
                ?.getItems()
                ?.getRecordById(options.propertyValue as TKey);
        }

        if (isEqual(options.propertyValue, options.frequentItemKey) && options.frequentItemText) {
            this._items = this._getItemsByPropValueAndTextValue(options, options.frequentItemText);
        } else if (
            (options.multiSelect && options.propertyValue?.length >= 1) ||
            isItemInSourceController
        ) {
            this._items = this._getItemsFromSourceController(options);
        } else if (options.textValue) {
            // Формируем записи для лукапа по value и textValue (если выбор единичный),
            // чтобы не делать лишний запрос при построении из истории
            this._items = this._getItemsByPropValueAndTextValue(options, options.textValue);
        } else if (this._isEmptyTextSelected(options)) {
            this._items = this._getItemsByPropValueAndTextValue(options, options.emptyText);
        }

        if (this._items) {
            this._textValue = this._getTextValue(this._items as RecordSet, options);
        }
    }

    private _isEmptyTextSelected(options: ILookupEditorOptions): boolean {
        return (
            options.emptyText &&
            ((options.emptyKey && isEqual(options.emptyKey, options.propertyValue)) ||
                (!options.emptyKey && isEqual(options.propertyValue, options.resetValue)))
        );
    }

    private _getFilteredItems(items: RecordSet, options: ILookupEditorOptions): RecordSet {
        const { propertyValue, value, keyProperty, source, multiSelect } = options;
        const selectedKeys = this._getSelectedKeys(propertyValue ?? value, multiSelect);
        const filteredItems = factory(items)
            .filter((item) => {
                return selectedKeys.includes(item.get(keyProperty));
            })
            .value();
        const recordSet = new RecordSet(
            this._getRecordSetOptions(items, source as ICrud & IData, keyProperty)
        );
        recordSet.assign(filteredItems);
        return recordSet;
    }

    private _getItemsByPropValueAndTextValue(
        { displayProperty, keyProperty, multiSelect, source, propertyValue }: ILookupEditorOptions,
        text: string
    ): RecordSet {
        const collectionOptions = {
            model: source.getModel(),
            adapter: source.getAdapter(),
            keyProperty,
        };
        const items = new RecordSet(collectionOptions);
        const model = new Model(collectionOptions);
        const filterItemValue = multiSelect ? propertyValue[0] : propertyValue;

        model.addField({
            name: keyProperty,
            type: typeof filterItemValue === 'number' ? 'integer' : 'string',
        });
        model.set(keyProperty, filterItemValue);

        if (displayProperty !== keyProperty) {
            model.addField({
                name: displayProperty,
                type: 'string',
            });
            model.set(displayProperty, text);
        }

        items.append([model]);
        return items;
    }

    private _getItemsFromSourceController(options: ILookupEditorOptions): RecordSet {
        const { propertyValue, resetValue, source, keyProperty, editorsViewMode } = options;
        const sourceController = this._sourceController || options.sourceController;
        const items = sourceController?.getItems();
        let result;
        if (items?.getCount() && (!isEqual(propertyValue, resetValue) || propertyValue)) {
            const selectedKeys = Array.isArray(propertyValue) ? propertyValue : [propertyValue];
            const preparedItems = factory(items)
                .filter((item) => {
                    return selectedKeys.includes(item.getKey());
                })
                .value<RecordSet>(
                    CollectionFactory.recordSet,
                    this._getRecordSetOptions(items, source as ICrud & IData, keyProperty)
                );

            if (preparedItems.getCount()) {
                if (editorsViewMode === 'cloud') {
                    result = this._getFilteredItems(preparedItems, options);
                } else {
                    result = preparedItems;
                }
            }
        }
        return result;
    }

    private _getSelectedKeys(propertyValue: TKey[] | TKey, multiSelect: boolean): TKey[] {
        return multiSelect && propertyValue instanceof Array
            ? propertyValue
            : [propertyValue as TKey];
    }

    private _getRecordSetOptions(
        items: IList<Model>,
        source: IData & ICrud,
        keyProperty: string
    ): object {
        return {
            adapter: source.getAdapter(),
            model: source.getModel(),
            format: items.at(0).getFormat(),
            keyProperty,
        };
    }

    private _subscribeOnSourceControllerEvents(): void {
        this._sourceController.subscribe('itemsChanged', this._sourceControllerItemsChanged);
    }

    private _unsubscribeOnSourceControllerEvents(): void {
        this._sourceController?.unsubscribe('itemsChanged', this._sourceControllerItemsChanged);
    }

    private _sourceControllerItemsChanged(event: SyntheticEvent, items: RecordSet): void {
        this._items = items;
    }

    private _getSuggestTemplate(options: ILookupEditorOptions): ISuggestTemplateProp {
        if (options.searchParam) {
            return (
                options.suggestTemplate || {
                    templateName: 'Controls/suggestPopup:SuggestTemplate',
                    templateOptions: {
                        suggestItemTemplate: options.suggestItemTemplate,
                    },
                }
            );
        }
    }

    private _setItemsToSourceController(items: RecordSet | List<Model>): void {
        const sourceController = this._sourceController;

        if (!sourceController) {
            return;
        }
        if (items.getCount()) {
            // items из окна выбора может возвращаться List'ом
            // всегда приводим его к recordSet'у
            // потому что sourceController работает только с RecordSet'ом
            const newItems = new RecordSet(
                this._getRecordSetOptions(
                    items,
                    this._options.source as ICrud & IData,
                    this._options.keyProperty
                )
            );
            const currentItems = sourceController.getItems();
            newItems.assign(items);

            if (currentItems) {
                this._prepareFormat(currentItems, newItems);
            }
            sourceController.setItems(newItems);
        } else {
            sourceController.getItems()?.clear();
        }
    }

    private _prepareFormat(currentItems: RecordSet, newItems: RecordSet): void {
        const currentItemsFormat = currentItems.getFormat(true);
        newItems.getFormat(true).each((field) => {
            if (currentItemsFormat.getFieldIndex(field.getName()) === -1) {
                currentItems.addField({
                    name: field.getName(),
                    type: field.getType(),
                    defaultValue: field.getDefaultValue(),
                    kind:
                        field.getType() === 'array' ? (field as format.ArrayField).getKind() : null,
                });
            }
        });
    }

    private _handleItemsChanged(selectedItems: RecordSet | List<Model>): void {
        const selectedText = [];
        const selectedValue = [];
        selectedItems.forEach((item) => {
            selectedValue.push(item.get(this._options.keyProperty));
            selectedText.push(item.get(this._options.displayProperty));
        });
        const value = this._getLookupValue(selectedValue);
        this._setItemsToSourceController(selectedItems);
        this._items = this._sourceController ? this._sourceController.getItems() : selectedItems;
        if (!isEqual(value, this._options.propertyValue)) {
            this._propertyValueChanged(value, selectedText.join(', '));
        }
    }

    protected _itemsChangedHandler(selectedItems: RecordSet | List<Model>): void {
        this._handleItemsChanged(selectedItems);
    }

    protected _selectCallback(event: Event, selectedItems: RecordSet | List<Model>): void {
        loadAsync('Controls/lookup').then(({ ToSourceModel }) => {
            this._handleItemsChanged(
                ToSourceModel(
                    selectedItems,
                    this._options.source as IData & ICrud,
                    this._options.keyProperty
                )
            );
        });
    }

    protected _propertyValueChanged(
        value: number[] | string[] | number | string,
        textValue: string
    ): void {
        const extendedValue = {
            value,
            textValue,
            viewMode:
                isEqual(value, this._options.resetValue) && this._options.extendedCaption
                    ? 'extended'
                    : 'basic',
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
    }

    protected _extendedCaptionClickHandler(event: SyntheticEvent): void {
        loadAsync('Controls/lookup').then(({ showSelector }) => {
            showSelector(this, this._getLookupPopupOptions(), this._options.multiSelect);
        });
    }

    protected _frequentItemClickHandler(event: SyntheticEvent, extendedValue): void {
        this._propertyValueChanged(extendedValue.value, extendedValue.textValue);
    }

    protected _handleTextValueChanged(value: string): void {
        this._textValue = value;
    }

    protected _dataLoadCallback(items: RecordSet): void {
        if (this._destroyed) {
            return;
        }
        if (this._options.dataLoadCallback) {
            this._options.dataLoadCallback(items);
        }
        this._textValue = this._getTextValue(items, this._options);
    }

    protected _getTextValue(
        items: RecordSet,
        { propertyValue, multiSelect, displayProperty }: ILookupEditorOptions
    ): string {
        let textValue = '';

        if (propertyValue) {
            const selectedText = [];

            this._getSelectedKeys(propertyValue, multiSelect).forEach((key) => {
                const item = items.getRecordById(key);
                if (item) {
                    selectedText.push(item.get(displayProperty));
                }
            });
            textValue = selectedText.join(', ');
        }

        return textValue;
    }

    protected _handleLookupClick(lookupEditor: Selector): void {
        lookupEditor.showSelector(this._getLookupPopupOptions());
    }

    protected _resetClick(): void {
        if (this.isResetValueEmpty() && this._options.filterViewMode !== 'popup') {
            this._clearItemsInSourceController();
        }
    }

    private _getLookupPopupOptions(): object {
        return {
            target: this._container,
        };
    }

    private isResetValueEmpty(): boolean {
        const { multiSelect, resetValue } = this._options;
        return multiSelect ? !resetValue.length : resetValue === null || resetValue === undefined;
    }

    private _clearItemsInSourceController(): void {
        if (this._sourceController) {
            const items = this._sourceController.getItems();

            if (items?.getCount()) {
                items.clear();
                this._sourceController.setItems(items);
            }
        }
    }

    private _getLookupValue(
        selectedKeys: number[] | string[]
    ): number[] | string[] | number | string {
        if (this._options.multiSelect) {
            return selectedKeys;
        }
        return selectedKeys.length ? selectedKeys[0] : this._options.resetValue;
    }

    static getOptionTypes(): object {
        return {
            source: descriptor(Object).required(),
            selectorTemplate: descriptor(Object).required(),
        };
    }
}

export default LookupEditor;
