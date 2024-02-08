import { Control, TemplateFunction } from 'UI/Base';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/CustomTemplate/StaticHeight/StaticHeight';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            key: 0,
            title: 'Плитка со статической высотой',
            image: Images.CHEETAH,
            staticHeight: true,
        },
        {
            key: 1,
            title: 'Высота изменяется пропорционально',
            image: Images.LION,
            staticHeight: false,
        },
    ];
}

/**
 * Демка используется для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/config/
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectedKeys: string[] = [];

    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/tileNew/DifferentItemTemplates/CustomTemplate/StaticHeight/StaticHeight',
    ];

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
