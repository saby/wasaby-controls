import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/list_new/Decorators/Decorators';
import 'css!DemoStand/Controls-demo';

function getData() {
    return [
        {
            key: 1,
            fontColorStyle: 'list',
            value: 12659333,
        },
        {
            key: 2,
            fontColorStyle: 'group',
            value: 12659333,
        },
        {
            key: 3,
            fontColorStyle: 'results',
            value: 12659333,
        },
    ];
}

/*
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/decorator/
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Decorators: {
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
