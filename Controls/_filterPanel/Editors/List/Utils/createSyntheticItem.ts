import { IListEditorOptions } from '../interface/IList';
import { TKey } from 'Controls/interface';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { create as DiCreate } from 'Types/di';

function getItemModel(items: RecordSet, keyProperty: string): Model {
    const model = items.getModel();
    const modelConfig = {
        keyProperty,
        format: items.getFormat(),
        adapter: items.getAdapter(),
    };
    if (typeof model === 'string') {
        return DiCreate(model, modelConfig);
    } else {
        return new model(modelConfig);
    }
}

export default function getSyntheticItem(
    {
        keyProperty,
        displayProperty,
        parentProperty,
        root,
        additionalTextProperty,
        mainCounterProperty,
        emptyTextAdditionalCounterProperty,
        emptyTextMainCounterProperty,
    }: Partial<IListEditorOptions>,
    key: TKey,
    text: string,
    items: RecordSet
): Model {
    const emptyItem = getItemModel(items, keyProperty);

    const data = {};
    data[keyProperty] = key;
    data[displayProperty] = text;
    data[additionalTextProperty] = items
        .getMetaData()
        ?.results?.get(emptyTextAdditionalCounterProperty);
    data[mainCounterProperty] = items.getMetaData()?.results?.get(emptyTextMainCounterProperty);
    if (emptyItem.get(parentProperty) !== undefined) {
        data[parentProperty] = root;
    }
    emptyItem.set(data);
    return emptyItem;
}
