/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanelEditors/Lookup/_BaseLookup';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Selector, ILookupOptions } from 'Controls/lookup';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { RecordSet, List, factory as CollectionFactory, IList } from 'Types/collection';
import { Model } from 'Types/entity';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { isEqual } from 'Types/object';
import { TKey, ISuggestTemplateProp } from 'Controls/interface';
import { IBaseEditor } from 'Controls/filterPanel';
import { IBaseLookupEditorOptions, ILookupEditor } from './interface/ILookupEditor';
import { IFrequentItem } from 'Controls/_filterPanelEditors/FrequentItem/IFrequentItem';
import { IData, ICrud, CrudEntityKey } from 'Types/source';
import { descriptor, format } from 'Types/entity';
import { Logger } from 'UI/Utils';
import { initItems } from 'Controls/_filterPanelEditors/Utils/InitItems';
import { process } from 'Controls/error';
import 'css!Controls/filterPanelEditors';

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
    caption?: string;
}

/**
 * Контрол используют в качестве редактора для выбора значения из справочника.
 * @class Controls/_filterPanelEditors/Lookup/_BaseLookup
 * @extends Controls/lookup:Input
 * @demo Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/Base/Index
 * @public
 */

class LookupEditor extends Control<ILookupEditorOptions> implements ILookupEditor {
    readonly '[Controls/_filterPanelEditors/Lookup/interface/ILookupEditor]': boolean = true;
    protected _template: TemplateFunction = template;
    protected _textValue: string;
    protected _sourceController: SourceController;
    protected _items: RecordSet | List<Model>;
    protected _suggestTemplate: ISuggestTemplateProp;
    protected _children: {
        lookupEditor: Selector;
    };

    protected _beforeMount(options: ILookupEditorOptions): void {
        this._validateOptions(options);
        this._suggestTemplate = this._getSuggestTemplate(options);
        this._sourceControllerItemsChanged = this._sourceControllerItemsChanged.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);

        if (options.sourceController) {
            this._initSourceController(options);
        }
        if (options.sourceController || options.emptyText) {
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
        } else if (propertyValueChanged) {
            this._items = initItems(newOptions, this._sourceController);
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
        this._items = initItems(options, this._sourceController);

        if (this._items) {
            this._textValue = this._getTextValue(this._items as RecordSet, options);
        }
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
        const isCloudViewMode =
            this._options.editorsViewMode === 'cloud' ||
            this._options.editorsViewMode === 'cloud|default';
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
            if (isCloudViewMode) {
                sourceController.setItems(newItems);
            }
        } else if (isCloudViewMode) {
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

    protected _itemsChangedHandler(event: Event, selectedItems: RecordSet | List<Model>): void {
        this._handleItemsChanged(selectedItems);
    }

    protected _selectCallback(event: Event, selectedItems: RecordSet | List<Model>): void {
        const deps: [Promise<typeof import('Controls/lookup')>, Promise<typeof import('Controls/HistoryStore')>?]
            = [loadAsync('Controls/lookup')];
        if (this._options.historyId) {
            deps[1] = loadAsync('Controls/HistoryStore');
        }
        Promise.all(deps).then(([lookup, historyStore]) => {
            const items = lookup.ToSourceModel(
                selectedItems,
                this._options.source as IData & ICrud,
                this._options.keyProperty
            );
            if (this._options.historyId) {
                const itemsIds: CrudEntityKey[] = [];
                items.each((el) => {
                    itemsIds.push(el.getKey());
                });
                historyStore?.Store.push(this._options.historyId, itemsIds);
            }
            this._handleItemsChanged(items);
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
        loadAsync('Controls/lookup')
            .then(({ showSelector }) => {
                showSelector(this, this._getLookupPopupOptions(), this._options.multiSelect);
            })
            .catch((error) => {
                return process({ error });
            });
    }

    protected _frequentItemClickHandler(event: SyntheticEvent, extendedValue): void {
        this._propertyValueChanged(extendedValue.value, extendedValue.textValue);
    }

    protected _handleTextValueChanged(event: Event, value: string): void {
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

    protected _handleLookupClick(_: Event, lookupEditor: Selector): void {
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
                items.resetDeclaredFormat();
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

    private _validateOptions(options: ILookupEditorOptions): void {
        if (options.emptyKey instanceof Object) {
            Logger.error(
                'Controls/filterPanelEditors:Lookup: Опция emptyKey имеет некорректный тип, необходимо передавать строку, число или null',
                this
            );
        }
    }

    static getOptionTypes(): object {
        return {
            source: descriptor(Object).required(),
            selectorTemplate: descriptor(Object).required(),
        };
    }
}

export default LookupEditor;
