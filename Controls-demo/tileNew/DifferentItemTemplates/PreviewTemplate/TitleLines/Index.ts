import { Control, TemplateFunction } from 'UI/Base';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/TitleLines/TitleLines';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            key: 0,
            title: 'Плитка c длинным заголовком, который отображается в две строки',
            image: Images.CHEETAH,
            hasTitle: true,
            titleLines: 2,
        },
        {
            key: 1,
            title: 'Плитка c длинным заголовком, который отображается в одну строку и должен быть отрезан по многоточию',
            image: Images.LION,
            hasTitle: true,
            titleLines: 1,
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
