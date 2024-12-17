import { isEqual } from 'Types/object';
import { TKey } from 'Controls/interface';
import { IFrequentItem } from 'Controls/_filterPanelEditors/FrequentItem/IFrequentItem';
import { factory as CollectionFactory, IList, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { ICrud, IData } from 'Types/source';
import { factory } from 'Types/chain';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { ILookupEditorOptions } from 'Controls/_filterPanelEditors/Lookup/_BaseLookup';
import { create as DiCreate } from 'Types/di';

interface IOptions extends IFrequentItem {
    multiSelect?: boolean;
    propertyValue: TKey | TKey[];
    resetValue?: TKey | TKey[];
    textValue?: string;
    emptyText?: string;
    emptyKey?: TKey;
    displayProperty?: string;
    keyProperty?: string;
    source?: ICrud;
    editorsViewMode?: string;
    sourceController?: SourceController;
}

function getItemsByPropValueAndTextValue(
    { displayProperty, keyProperty, multiSelect, source, propertyValue }: ILookupEditorOptions,
    text: string
): RecordSet {
    const model = source.getModel();
    const collectionOptions = {
        model,
        adapter: source.getAdapter(),
        keyProperty,
    };

    const items = new RecordSet(collectionOptions);
    let modelItem;
    if (typeof model === 'string') {
        modelItem = DiCreate(model, collectionOptions);
    } else {
        modelItem = new model(collectionOptions);
    }
    const filterItemValue =
        multiSelect && propertyValue instanceof Array ? propertyValue[0] : propertyValue;

    if (modelItem.getFormat()?.getFieldIndex(keyProperty) === -1) {
        modelItem.addField({
            name: keyProperty,
            type: typeof filterItemValue === 'number' ? 'integer' : 'string',
        });
    }
    modelItem.set(keyProperty, filterItemValue);

    if (
        displayProperty !== keyProperty &&
        modelItem.getFormat()?.getFieldIndex(displayProperty) === -1
    ) {
        modelItem.addField({
            name: displayProperty,
            type: 'string',
        });
    }
    modelItem.set(displayProperty, text);

    items.append([modelItem]);
    return items;
}

function isEmptyTextSelected(options: IOptions): boolean {
    const propertyValue =
        options.multiSelect && options.propertyValue instanceof Array
            ? options.propertyValue[0]
            : options.propertyValue;
    return (
        !!options.emptyText &&
        ((options.emptyKey && isEqual(options.emptyKey, propertyValue)) ||
            (!options.emptyKey && isEqual(options.propertyValue, options.resetValue)))
    );
}

function getSelectedKeys(propertyValue: TKey[] | TKey, multiSelect: boolean): TKey[] {
    return multiSelect && propertyValue instanceof Array ? propertyValue : [propertyValue as TKey];
}

function getRecordSetOptions(
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

function getFilteredItems(items: RecordSet, options: ILookupEditorOptions): RecordSet {
    const { propertyValue, value, keyProperty, source, multiSelect } = options;
    const selectedKeys = getSelectedKeys(propertyValue ?? value, multiSelect);
    const filteredItems = factory(items)
        .filter((item) => {
            return selectedKeys.includes(item.get(keyProperty));
        })
        .value();
    const recordSet = new RecordSet(
        getRecordSetOptions(items, source as ICrud & IData, keyProperty)
    );
    recordSet.assign(filteredItems);
    return recordSet;
}

function getItemsFromSourceController(options: IOptions, sourceControllerState): RecordSet {
    const { propertyValue, resetValue, source, keyProperty, editorsViewMode } = options;
    const sourceController = sourceControllerState || options.sourceController;
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
                getRecordSetOptions(items, source as ICrud & IData, keyProperty)
            );

        if (preparedItems.getCount()) {
            if (editorsViewMode === 'cloud') {
                result = getFilteredItems(preparedItems, options);
            } else {
                result = preparedItems;
            }
        }
    }
    return result;
}

function getItemTextByOptions({ caption, name, emptyText }: IOptions): string {
    if (caption) {
        // В PropertyGrid/ItemTemplate в caption может быть передано значение из name, если в editorOptions
        // не будет задано значение для caption
        return caption === name ? emptyText : caption;
    }
    return emptyText;
}

export function initItems(options: IOptions, sourceController?: SourceController): RecordSet {
    let items;
    let isItemInSourceController;

    if (!options.multiSelect) {
        const key =
            options.propertyValue instanceof Array
                ? options.propertyValue[0]
                : options.propertyValue;
        isItemInSourceController = sourceController?.getItems()?.getRecordById(key);
    }

    if (isEqual(options.propertyValue, options.frequentItemKey) && options.frequentItemText) {
        items = getItemsByPropValueAndTextValue(options, options.frequentItemText);
    } else if (isEmptyTextSelected(options)) {
        items = getItemsByPropValueAndTextValue(options, getItemTextByOptions(options));
    } else if (
        (options.multiSelect && options.propertyValue?.length >= 1) ||
        isItemInSourceController
    ) {
        items = getItemsFromSourceController(options, sourceController);
    } else if (options.textValue) {
        // Формируем записи для лукапа по value и textValue (если выбор единичный),
        // чтобы не делать лишний запрос при построении из истории
        items = getItemsByPropValueAndTextValue(options, options.textValue);
    }
    return items;
}
