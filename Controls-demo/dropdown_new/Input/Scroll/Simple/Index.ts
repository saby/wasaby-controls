import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/Scroll/Simple/Index');
import { Memory } from 'Types/source';
import 'css!Controls-demo/dropdown_new/Input/Scroll/Index';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _maxSource: Memory;
    protected _selectedKeys: number[] = [1];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                { key: 1, title: 'Ярославль' },
                { key: 2, title: 'Москва' },
                { key: 3, title: 'Санкт-Петербург' },
                { key: 4, title: 'Новосибирск' },
                { key: 5, title: 'Нижний новгород' },
                { key: 6, title: 'Кострома' },
                { key: 7, title: 'Рыбинск' },
                { key: 8, title: 'Тверь' },
                { key: 9, title: 'Киров' },
                { key: 10, title: 'Калининград' },
            ],
        });
        const itemsMax = [];
        for (let i = 0; i < 50; i++) {
            itemsMax.push({
                key: i,
                title: `Запись ${i}`,
            });
        }
        itemsMax.push({
            key: '2000',
            title: 'Lorem ipsum dolor sit amet, consectetur tincidunt',
        });
        this._maxSource = new Memory({
            keyProperty: 'key',
            data: itemsMax,
        });
    }
}
