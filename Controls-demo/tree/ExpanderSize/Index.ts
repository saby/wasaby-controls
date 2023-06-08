import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/tree/ExpanderSize/ExpanderSize';

function getData() {
    return [
        {
            key: 1,
            title: 'Node',
            parent: null,
            type: true,
            hasChild: true,
        },
        {
            key: 11,
            title: 'Node',
            parent: 1,
            type: true,
        },
        {
            key: 111,
            title: 'Leaf',
            parent: 11,
            type: null,
        },
        {
            key: 12,
            title: 'Hidden node',
            parent: 1,
            type: false,
            hasChild: false,
        },
        {
            key: 13,
            title: 'Leaf',
            parent: 1,
            type: null,
        },
        {
            key: 2,
            title: 'Node 2',
            parent: null,
            type: true,
            hasChild: true,
        },
        {
            key: 21,
            title: 'Leaf 21',
            parent: 2,
            type: null,
        },
        {
            key: 3,
            title: 'Node 3',
            parent: null,
            type: true,
            hasChild: false,
        },
    ];
}

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree/node/expander/#expander-size
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _expandedItems: CrudEntityKey[] = [null];

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
                },
            },
        };
    }
}
