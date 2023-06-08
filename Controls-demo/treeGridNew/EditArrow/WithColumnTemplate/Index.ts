import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Model } from 'Types/entity';

import { IColumn, IHeaderCell } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/treeGridNew/EditArrow/WithColumnTemplate/WithColumnTemplate';
import * as TreeMemory from 'Controls-demo/List/Tree/TreeMemory';
import * as memorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import {
    TreeData,
    TreeColumnsWithTemplate,
    TreeHeader,
} from 'Controls-demo/treeGridNew/EditArrow/resources/resources';

export default class WithColumnTemplate extends Control<IControlOptions> {
    _template: TemplateFunction = Template;
    _source: typeof TreeMemory;
    _columns: IColumn[];
    _header: IHeaderCell[];

    _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._source = new TreeMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            filter: memorySourceFilter(),
            data: TreeData,
        });
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

    static _styles: string[] = [
        'Controls-demo/treeGridNew/EditArrow/resources/EditArrow',
    ];
}
