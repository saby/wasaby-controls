import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ItemHeightProperty/Template';
import { Memory } from 'Types/source';

interface IItem {
    title: string;
    key: number;
    height: number;
}

function getData(): IItem[] {
    return [300, 250, 200, 250, 300].map((height, index) => {
        return {
            key: index,
            height,
            title: `Запись с ключом ${index} и высотой ${height}.`,
        };
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _activeElement: number = 2;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollItemHeightProperty: {
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
