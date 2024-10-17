import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';

import { IColumn, IHeaderCell } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/treeGridNew/EditArrow/WithColumnTemplate/WithColumnTemplate';
import ExpandedSource from '../../DemoHelpers/ExpandedSource';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import {
    TreeColumnsWithTemplate,
    TreeData,
    TreeHeader,
} from 'Controls-demo/treeGridNew/EditArrow/resources/resources';

function getData() {
    return TreeData;
}

export default class WithColumnTemplate extends Control<IControlOptions> {
    _template: TemplateFunction = Template;
    _columns: IColumn[];
    _header: IHeaderCell[];

    _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._columns = TreeColumnsWithTemplate;
        this._header = TreeHeader;
    }

    protected _editArrowVisibilityCallback(item: Model): boolean {
        // У третьей не должно быть стрелки редактирования.
        if (item.get('parent@') && item.getKey() !== 2) {
            return true;
        }
    }

    protected _getHighlightOnHover(item: Model): boolean {
        return item.getKey() !== 2;
    }

    static _styles: string[] = ['Controls-demo/treeGridNew/EditArrow/resources/EditArrow'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditArrowWithColumnTemplate: {
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
