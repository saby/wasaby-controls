/**
 * @kaizen_zone 772ff1d9-b53b-4f9c-86eb-a788c4cdfc36
 */
import { TemplateFunction, Control, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_ExtSearch/InputWrapper';
import { IFilterItem } from 'Controls/filter';
import { TKey } from 'Controls/interface';
import { List, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'UI/Vdom';
import { ILookupOptions } from 'Controls/lookup';
import { NewSourceController } from 'Controls/dataSource';

interface IInputWrapperOptions extends IControlOptions {
    filterDescription: IFilterItem[];
    value: string;
}

interface ILookupEditorOptions extends ILookupOptions {
    sourceController: NewSourceController;
}

export default class InputWrapper extends Control<IInputWrapperOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: TKey[] = [];
    protected _value: string;
    protected _items: List<Model> | void;
    protected _filterDescription: IFilterItem[];

    protected _beforeMount(options: IInputWrapperOptions): void {
        this._setItems(options.filterDescription);
    }

    protected _beforeUpdate(newOptions: IInputWrapperOptions): void {
        if (this._options.value !== newOptions.value) {
            this._value = newOptions.value;
        }
        if (!isEqual(this._options.filterDescription, newOptions.filterDescription)) {
            this._setItems(newOptions.filterDescription);
        }
    }

    protected _filterSourceChanged(event: SyntheticEvent, filterDescription: IFilterItem[]): void {
        this._setItems(filterDescription);
    }

    private _setItems(filterDescription: IFilterItem[]): void {
        this._filterDescription = filterDescription;
        this._selectedKeys = this._getSelectedKeys(filterDescription);
        this._items = this._getItems(filterDescription);
    }

    private _getSelectedKeys(filterDescription: IFilterItem[]): TKey[] {
        const selectedKeys = [];
        if (!filterDescription) {
            return selectedKeys;
        }

        const suggestFilterItems = filterDescription.filter(({ editorTemplateName }) => {
            return (
                editorTemplateName === 'Controls/filterPanel:LookupEditor' ||
                editorTemplateName === 'Controls/filterPanel:ListEditor'
            );
        });
        suggestFilterItems.forEach((filterItem) => {
            if (!isEqual(filterItem.value, filterItem.resetValue)) {
                selectedKeys.push(this._getSelectedKey(filterItem));
            }
        });
        return selectedKeys;
    }

    private _getItems(filterDescription: IFilterItem[]): List<Model> | void {
        const items = new List<Model>();
        filterDescription?.forEach((filterItem) => {
            const { value, textValue, editorOptions } = filterItem;
            if (!isEqual(value, filterItem.resetValue)) {
                const selectedItem = this._getItemFromSourceControllerByValue(filterItem);
                if (selectedItem) {
                    return items.append([selectedItem]);
                } else if (textValue) {
                    // При применении из истории есть только value и textValue, создадим по ним запись,
                    // чтобы не делать лишних запросов
                    return items.append(this._getItemsByTextValue(textValue, value, editorOptions));
                }
            }
        });

        if (items.getCount()) {
            this._items = items;
            return items;
        }

        this._items = undefined;
    }

    private _getItemFromSourceControllerByValue(filterItem: IFilterItem): void | Model {
        const editorItems = filterItem.editorOptions?.sourceController?.getItems();
        const selectedKey = this._getSelectedKey(filterItem);
        let selectedItem;

        if (editorItems?.getCount()) {
            editorItems.each((item) => {
                if (!selectedItem && isEqual(selectedKey, item.getKey())) {
                    selectedItem = item;
                }
            });
        }

        return selectedItem;
    }

    private _getItemsByTextValue(
        textValue: string,
        value: TKey | TKey[],
        { keyProperty, displayProperty, multiSelect, source }: ILookupEditorOptions
    ): RecordSet {
        const collectionOptions = {
            model: source.getModel(),
            adapter: source.getAdapter(),
            keyProperty,
        };
        const items = new RecordSet(collectionOptions);
        const model = new Model(collectionOptions);
        const filterItemValue = multiSelect ? value[0] : value;

        model.addField({
            name: keyProperty,
            type: filterItemValue instanceof Number ? 'number' : 'string',
        });
        model.addField({
            name: displayProperty,
            type: 'string',
        });
        model.set({
            [keyProperty]: filterItemValue,
            [displayProperty]: textValue,
        });
        items.append([model]);
        return items;
    }

    private _getSelectedKey(filterItem: IFilterItem): TKey {
        return filterItem.editorOptions?.multiSelect && filterItem.value instanceof Array
            ? filterItem.value[0]
            : filterItem.value;
    }
}
