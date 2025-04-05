import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/searchBreadcrumbsGrid/VirtualScroll/VirtualScroll';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const COUNT_CHILD = 200;

function generateData(parentKey: number, countChild: number): unknown[] {
    const data = [];
    for (let i = 0; i < countChild; i++) {
        const key = Number(`${parentKey}${i}`);
        data.push({
            key,
            parent: parentKey,
            node: true,
            title: `Хлебная крошка ${key}`,
        });
    }
    return data;
}

function getData() {
    return [
        { key: 1, parent: null, node: true, title: 'Корневой узел' },
        ...generateData(1, COUNT_CHILD),
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: unknown[] = [{ displayProperty: 'title' }];

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
                    nodeProperty: 'node',
                },
            },
        };
    }
}
