import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/OpenUrl/Template';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            key: 1,
            title: 'В этом списке',
            url: 'Controls-demo%2Flist_new%2FOpenUrl%2FPages%2FFirst',
        },
        {
            key: 2,
            title: 'При нажатии на записи',
            url: 'Controls-demo%2Flist_new%2FOpenUrl%2FPages%2FSecond',
        },
        {
            key: 3,
            title: 'Средней кнопкой',
            url: 'Controls-demo%2Flist_new%2FOpenUrl%2FPages%2FThird',
        },
        {
            key: 4,
            title: 'Открываются новые вкладки. А если нажать на ссылку www.google.com, то откроется она.',
            url: 'Controls-demo%2Flist_new%2FOpenUrl%2FPages%2FFourth',
        },
        {
            key: 5,
            special: true,
            title: 'Ссылки, в которых лежат другие элементы тоже откроются',
            url: 'Controls-demo%2Flist_new%2FOpenUrl%2FPages%2FFourth',
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
