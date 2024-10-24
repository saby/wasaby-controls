import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import * as template from 'wml!Controls-demo/Tabs/AdaptiveButtons/Template';

export default class TabButtonsDemo extends Control {
    protected _template: TemplateFunction = template;
    protected SelectedKey1: string = '6';
    protected SelectedKey2: string = '1';
    protected SelectedKey3: string = '4';
    protected SelectedKeyIcon: string = '1';
    protected _items: RecordSet | null = null;
    protected _items2: RecordSet | null = null;
    protected _containerWidth: number = 500;
    protected _itemsIcon: RecordSet | null = null;
    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Контакты',
                },
                {
                    id: '2',
                    title: 'Задачи',
                },
                {
                    id: '3',
                    title: 'Бизнес',
                },
                {
                    id: '4',
                    title: 'Деньги',
                },
                {
                    id: '5',
                    title: 'Лучшие сотрудники',
                },
                {
                    id: '6',
                    title: 'Самые важные документы',
                },
                {
                    id: '7',
                    title: 'Очень дорогие компании',
                },
            ],
        });
        this._items2 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    caption: 'Компании',
                },
                {
                    id: '2',
                    caption: 'Контактный-центр',
                },
                {
                    id: '3',
                    caption: 'Календарь',
                },
                {
                    id: '4',
                    caption: 'Самый ответственный сотрудник',
                },
                {
                    id: '5',
                    caption: 'Настройка глобального приложения',
                },
                {
                    id: '6',
                    caption: 'Документация',
                },
                {
                    id: '7',
                    caption: 'Доски',
                },
                {
                    id: '8',
                    caption: 'Проекты',
                },
                {
                    id: '9',
                    caption: 'Планы и сроки',
                },
                {
                    id: '10',
                    caption: 'Вехи',
                },
                {
                    id: '11',
                    caption: 'Торги',
                },
                {
                    id: '12',
                    caption: 'Избранное',
                },
                {
                    id: '13',
                    caption: 'Реализация',
                },
            ],
        });

        this._itemsIcon = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    caption: '5 262 052',
                    icon: 'icon-AddContact',
                    iconStyle: 'success',
                },
                {
                    id: '2',
                    caption: '132 516',
                    icon: 'icon-Admin',
                    iconStyle: 'danger',
                },
                {
                    id: '3',
                    caption: '897 133',
                    icon: 'icon-Android',
                    iconStyle: 'danger',
                },
                {
                    id: '4',
                    caption: '1 183 647',
                    icon: 'icon-AreaBlur',
                    iconStyle: 'warning',
                    iconTooltip: 'drop',
                },
                {
                    id: '5',
                    caption: '55 489 214',
                    icon: 'icon-AutoTuning',
                    iconStyle: 'success',
                },
                {
                    id: '6',
                    caption: '2 789 123',
                    icon: 'icon-Calc',
                    iconStyle: 'success',
                },
                {
                    id: '7',
                    caption: '14 132 269',
                    icon: 'icon-Check3',
                    iconStyle: 'success',
                },
            ],
        });
    }

    static _styles: string[] = ['Controls-demo/Tabs/Buttons/Buttons'];
}
