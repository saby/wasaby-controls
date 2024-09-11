import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/BreadCrumbs/backgroundStyle/Template');
import { RecordSet } from 'Types/collection';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'Длинное название папки',
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
                    title: 'Record3',
                    secondTitle: 'тест6',
                    parent: 5,
                },
            ],
        });
    }
}

export default Demo;
