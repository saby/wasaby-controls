import { Memory } from 'Types/source';
import { merge } from 'Types/object';
import { object } from 'Types/util';
import { IFilterItem } from 'Controls/filter';
import { Store } from 'Controls/HistoryStore';
import { LocalStorage } from 'Browser/Storage';

new LocalStorage().clear();

const historyItemsValues = {
    city: {
        value: ['Moscow'],
        textValue: 'Moscow',
    },
};

const defaultItems: IFilterItem[] = [
    {
        name: 'city',
        value: ['Moscow'],
        resetValue: [],
        viewMode: 'basic',
        textValue: '',
        editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
        editorOptions: {
            source: new Memory({
                data: [
                    { id: 'Yaroslavl', title: 'Yaroslavl' },
                    { id: 'Moscow', title: 'Moscow' },
                    { id: 'Kazan', title: 'Kazan' },
                ],
                keyProperty: 'id',
            }),
            selectedAllText: 'Все города',
            multiSelect: true,
            keyProperty: 'id',
            displayProperty: 'title',
        },
    },
];

function getChangedHistoryItems(): object[] {
    return defaultItems.map((historyItem): object => {
        return merge(object.clone(historyItem), historyItemsValues[historyItem.name as string]);
    });
}

Store.push('favoriteDialogHistoryId', getChangedHistoryItems());
