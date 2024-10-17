import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { Guid, Model } from 'Types/entity';

import { IColumn, TColspanCallbackResult } from 'Controls/grid';

import { generateData, getColumns } from './DataCatalog';
import * as Template from 'wml!Controls-demo/treeGridNew/VirtualScroll/LastNodeExpanded/LastNodeExpanded';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return generateData();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollLastNodeExpanded: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 5,
                            page: 0,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }

    protected _colspanCallback(): TColspanCallbackResult {
        return 'end';
    }

    protected _beginAdd(): void {
        const guid = Guid.create();
        this._children.list
            .beginAdd({
                item: new Model({
                    keyProperty: 'key',
                    rawData: {
                        key: guid,
                        title: `Запись первого уровня с key = ${guid}. Отменяет поведение скролла вместо кнопки "Ещё".`,
                        parent: null,
                        type: null,
                    },
                }),
            })
            .then(() => {
                this._children.list.commitEdit();
            });
    }
}
