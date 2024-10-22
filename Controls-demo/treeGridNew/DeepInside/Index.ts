import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/DeepInside/DeepInside';
import { CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../DemoHelpers/ExpandedSource';

function getData() {
    return [
        { key: 1, title: 'Узел 1', parent: null, nodeType: true },
        { key: 11, title: 'Узел 1-1', parent: 1, nodeType: true },
        { key: 111, title: 'Узел 1-1-1', parent: 11, nodeType: true },
        { key: 1111, title: 'Лист 1-1-1-1', parent: 111, nodeType: null },
        { key: 1112, title: 'Лист 1-1-1-2', parent: 111, nodeType: null },
        { key: 1113, title: 'Лист 1-1-1-3', parent: 111, nodeType: null },
        { key: 112, title: 'Узел 1-1-2', parent: 11, nodeType: true },
        { key: 113, title: 'Узел 1-1-3', parent: 11, nodeType: true },

        { key: 12, title: 'Узел 1-2', parent: 1, nodeType: true },
        { key: 121, title: 'Узел 1-2-1', parent: 12, nodeType: true },
        { key: 1211, title: 'Лист 1-2-1-1', parent: 121, nodeType: null },
        {
            key: 12111,
            title: 'Лист 1-2-1-1-1',
            parent: 1211,
            nodeType: null,
        },
        {
            key: 121111,
            title: 'Лист 1-2-1-1-1-1',
            parent: 12111,
            nodeType: null,
        },
        {
            key: 1211111,
            title: 'Лист 1-2-1-1-1-1-1',
            parent: 121111,
            nodeType: null,
        },
        { key: 2, title: 'Узел 2', parent: null, nodeType: true },
        { key: 3, title: 'Скрытый узел 3', parent: null, nodeType: false },
        { key: 4, title: 'Скрытый узел 4', parent: null, nodeType: false },
        { key: 5, title: 'Лист 5', parent: null, nodeType: null },
        { key: 6, title: 'Лист 6', parent: null, nodeType: null },
        { key: 7, title: 'Лист 7', parent: null, nodeType: null },
        { key: 8, title: 'Лист 8', parent: null, nodeType: null },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [{ displayProperty: 'title' }];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            DeepInside: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'nodeType',
                    expandedItems: [null],
                    collapsedItems: [6],
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: { pageSize: 21, page: 0, hasMore: false },
                    },
                },
            },
        };
    }
}
