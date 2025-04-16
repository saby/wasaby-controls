import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/VirtualScroll/WithPseudoParent/Default';
import { IColumn, TColspanCallbackResult } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData, getColumns } from './DataCatalog';
import PseudoParentSourceMock from './PseudoParentSourceMock';

function getData() {
    return generateData();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = getColumns();
    protected _initialScrollPosition = {
        vertical: 'end',
        horizontal: 'start',
    };

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollDefault0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PseudoParentSourceMock({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [null],
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        viewConfig: {
                            pagingMode: 'edge',
                        },
                        sourceConfig: {
                            field: 'key',
                            position: 104,
                            direction: 'backward',
                            limit: 20,
                        },
                    },
                },
            },
        };
    }

    protected _colspanCallback(): TColspanCallbackResult {
        return 'end';
    }
}
