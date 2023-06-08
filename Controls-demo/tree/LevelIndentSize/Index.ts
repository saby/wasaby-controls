import { Control, TemplateFunction } from 'UI/Base';
import { Memory, CrudEntityKey } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';
import * as Template from 'wml!Controls-demo/tree/LevelIndentSize/LevelIndentSize';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return data;
}

/**
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree/paddings/
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _expandedItems: CrudEntityKey[] = [1];

    static _styles: string[] = ['DemoStand/Controls-demo'];

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
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1],
                },
            },
        };
    }
}
