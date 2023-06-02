import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
// @ts-ignore
import Template = require('wml!Controls-demo/BreadCrumbs/BreadCrumbs/BreadCrumbs');
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RecordSet } from 'Types/collection';

class BreadCrumbs extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _recordItems: RecordSet = null;
    protected _items: Model[] = null;
    protected _items1: Model[] = null;
    protected _items2: Model[] = null;
    protected _items3: Model[] = null;
    protected _items4: Model[] = null;
    protected _containerWidth: number = 350;
    protected info: string = '';
    protected _arrowActivated: boolean = false;

    protected _beforeMount(): void {
        this._recordItems = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
                    secondTitle: 'тест1',
                    parent: null,
                },
                {
                    id: 2,
                    title: 'Notebooks 2',
                    secondTitle: 'тест2',
                    parent: 1,
                },
                {
                    id: 3,
                    title: 'Smartphones 3',
                    secondTitle: 'тест3',
                    parent: 2,
                },
                {
                    id: 4,
                    title: 'Record1',
                    secondTitle: 'тест4',
                    parent: 3,
                },
                {
                    id: 5,
                    title: 'Record2',
                    secondTitle: 'тест5',
                    parent: 4,
                },
                {
                    id: 6,
                    title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
                    secondTitle: 'тест6',
                    parent: 5,
                },
            ],
        });
        this._items = [
            {
                id: 1,
                title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
                secondTitle: 'тест1',
                parent: null,
            },
            {
                id: 2,
                title: 'Notebooks 2',
                secondTitle: 'тест2',
                parent: 1,
            },
            {
                id: 3,
                title: 'Smartphones 3',
                secondTitle: 'тест3',
                parent: 2,
            },
            {
                id: 4,
                title: 'Record1',
                secondTitle: 'тест4',
                parent: 3,
            },
            {
                id: 5,
                title: 'Record2',
                secondTitle: 'тест5',
                parent: 4,
            },
            {
                id: 6,
                title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
                secondTitle: 'тест6',
                parent: 5,
            },
        ].map((item) => {
            return new Model({
                rawData: item,
                keyProperty: 'id',
            });
        });
        this._items1 = [
            {
                id: 1,
                title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
                secondTitle: 'тест1',
            },
        ].map((item) => {
            return new Model({
                rawData: item,
                keyProperty: 'id',
            });
        });
        this._items2 = [
            {
                id: 1,
                title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
                secondTitle: 'тест1',
            },
            {
                id: 6,
                title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
                secondTitle: 'тест6',
            },
        ].map((item) => {
            return new Model({
                rawData: item,
                keyProperty: 'id',
            });
        });
        this._items3 = [
            { id: 5, title: 'Recor' },
            {
                id: 6,
                title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
                secondTitle: 'тест6',
            },
        ].map((item) => {
            return new Model({
                rawData: item,
                keyProperty: 'id',
            });
        });
        this._items4 = [
            {
                id: 1,
                title: 'Record3eqweqweqeqweqweedsadeqweqewqeqwqewqeqweqweqw',
                secondTitle: 'тест6',
            },
        ].map((item) => {
            return new Model({
                rawData: item,
                keyProperty: 'id',
            });
        });
    }

    private _onItemClick(e: SyntheticEvent<MouseEvent>, item: Model): void {
        this.info = '' + item.getId();
        this._arrowActivated = false;
    }

    private _resetCrumbs(): void {
        this._items = [
            {
                id: 1,
                title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
                secondTitle: 'тест1',
                parent: null,
            },
            {
                id: 2,
                title: 'Notebooks 2',
                secondTitle: 'тест2',
                parent: 1,
            },
            {
                id: 3,
                title: 'Smartphones 3',
                secondTitle: 'тест3',
                parent: 2,
            },
            {
                id: 4,
                title: 'Record1',
                secondTitle: 'тест4',
                parent: 3,
            },
            {
                id: 5,
                title: 'Record2',
                secondTitle: 'тест5',
                parent: 4,
            },
            {
                id: 6,
                title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
                secondTitle: 'тест6',
                parent: 5,
            },
        ].map((item) => {
            return new Model({
                rawData: item,
                keyProperty: 'id',
            });
        });
        this.info = '';
        this._arrowActivated = false;
    }

    private _onArrowActivated(): void {
        this.info = '';
        this._arrowActivated = true;
    }
    static _styles: string[] = [
        'Controls-demo/BreadCrumbs/BreadCrumbs/BreadCrumbs',
    ];
}

export default BreadCrumbs;
