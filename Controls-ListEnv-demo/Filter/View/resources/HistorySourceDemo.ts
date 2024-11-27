import { Store } from 'Controls/HistoryStore';
import { LocalStorage } from 'Browser/Storage';

new LocalStorage().clear();

Store.push('FILTER_HISTORY_WITH_ITEM', [
    { value: '2', textValue: 'Женский', name: 'radioGender', viewMode: 'basic' },
]);
