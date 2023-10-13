import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/SmallTemplate/Cursor/Cursor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            key: 0,
            title: 'Курсор default',
            cursor: 'default',
        },
        {
            key: 1,
            title: 'Курсор pointer',
            cursor: 'pointer',
        },
    ];
}

/**
 * Демка используется для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/config/
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectedKeys: string[] = [];

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
                },
            },
        };
    }
}
