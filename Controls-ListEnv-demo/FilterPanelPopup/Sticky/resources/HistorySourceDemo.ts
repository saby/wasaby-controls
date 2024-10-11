import { Store } from 'Controls/HistoryStore';
import { LocalStorage } from 'Browser/Storage';

new LocalStorage().clear();

Store.push('FILTER_HISTORY_WITH_ITEM', [
    { value: '6', textValue: 'Проектирование', name: 'department', viewMode: 'basic' },
]);

Store.push('FILTER_HISTORY_WITH_ITEM', [
    { value: '5', textValue: 'Учебный', name: 'department', viewMode: 'basic' },
]);

Store.push('FILTER_HISTORY_WITH_ITEM', [
    { value: '4', textValue: 'Тестирование', name: 'department', viewMode: 'basic' },
]);

Store.push('FILTER_HISTORY_WITH_ITEM', [
    { value: '3', textValue: 'Администрация', name: 'department', viewMode: 'basic' },
]);

Store.push('FILTER_HISTORY_WITH_ITEM', [
    { value: '1', textValue: 'Разработка', name: 'department', viewMode: 'basic' },
]);

Store.push('FILTER_HISTORY_WITH_ITEM', [
    {
        value: '2',
        textValue: 'Очень длинное название для редактора выбора отдела',
        name: 'department',
        viewMode: 'basic',
    },
]);

Store.push('FILTER_HISTORY', [
    {
        value: '2',
        textValue: 'Очень длинное название для редактора выбора отдела',
        name: 'department',
        viewMode: 'basic',
    },
]);
