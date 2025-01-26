import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { IColumn, IHeaderCell } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/treeGridNew/EditArrow/BackgroundStyle/BackgroundStyle';
import ExpandedSource from '../../DemoHelpers/ExpandedSource';

import 'css!Controls-demo/treeGridNew/EditArrow/resources/EditArrow';
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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditArrowBackgroundStyle: {
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
                    expandedItems: [null],
                },
            },
        };
    }

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._columns = TreeColumns;
        this._header = TreeHeader;
    }

    protected _getHighlightOnHover(item: Model): boolean {
        return item.getKey() !== 1 && item.getKey() !== 2;
    }

    protected _getHoverBackgroundStyle(item: Model): string {
        switch (item.getKey()) {
            case 3:
                return 'danger';
            case 4:
                return 'success';
            case 5:
                return 'transparent';
            default:
                return;
        }
    }
}
