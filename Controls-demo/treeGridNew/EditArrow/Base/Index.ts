import { Control, IControlOptions, TemplateFunction } from 'UI/Base';

import { IColumn, IHeaderCell } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/treeGridNew/EditArrow/Base/Base';
import ExpandedSource from '../../DemoHelpers/ExpandedSource';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import {
    TreeColumns,
    TreeData,
    TreeHeader,
} from 'Controls-demo/treeGridNew/EditArrow/resources/resources';

function getData() {
    return TreeData;
}

export default class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];
    protected _header: IHeaderCell[];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._columns = TreeColumns;
        this._header = TreeHeader;
    }

    static _styles: string[] = ['Controls-demo/treeGridNew/EditArrow/resources/EditArrow'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditArrowBase: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                        useMemoryFilter: true,
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
}
