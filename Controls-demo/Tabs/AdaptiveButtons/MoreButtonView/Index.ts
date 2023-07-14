import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import * as template from 'wml!Controls-demo/Tabs/AdaptiveButtons/MoreButtonView/Template';
import 'css!Controls-demo/Tabs/Buttons/Buttons';

export default class MoreButtonViewDemo extends Control {
    protected _template: TemplateFunction = template;
    protected SelectedKey1: string = '6';
    protected SelectedKey2: string = '1';
    protected _items: RecordSet | null = null;
    protected _containerWidth: number = 500;
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
    }
}
