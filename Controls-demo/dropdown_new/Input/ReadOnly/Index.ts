import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/ReadOnly/Index');
import { Memory } from 'Types/source';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _sourceMax: Memory;
    protected _selectedKeys: number[] = [1];
    protected _selectedKeys2: number[] = [null];
    protected _selectedKeys3: number[] = [1, 2, 4];
    protected _selectedKeys4: number[] = [1, 2, 4];
    protected _selectedKeys5: number[] = [];

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
        this._sourceMax = new Memory({
            keyProperty: 'key',
            data: itemsMax,
        });
        this._selectedKeys5 = Array.from({ length: 50 }, (_, index) => index);
    }

    static _styles: string[] = ['Controls-demo/dropdown_new/Input/Index'];
}
