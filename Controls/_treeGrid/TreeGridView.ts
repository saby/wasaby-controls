/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */

import { GridView, IGridOptions } from 'Controls/grid';
import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import 'css!Controls/grid';
import 'css!Controls/baseTree';

import TreeGridCollection from './display/TreeGridCollection';
import TreeGridDataRow from './display/TreeGridDataRow';
import TreeGridNodeFooterRow from './display/TreeGridNodeFooterRow';
import { ITreeControlOptions } from 'Controls/tree';
import { TGroupNodeVisibility } from './interface/ITreeGrid';

export interface ITreeGridOptions extends ITreeControlOptions, IGridOptions {
    nodeTypeProperty?: string;
    groupNodeVisibility?: TGroupNodeVisibility;
}

/**
 * Представление иерархической таблицы
 * @private
 */
export default class TreeGridView extends GridView {
    protected _listModel: TreeGridCollection;
    protected _options: ITreeGridOptions;

    protected _beforeUpdate(newOptions: ITreeGridOptions): void {
        super._beforeUpdate(newOptions);

        if (this._options.nodeTypeProperty !== newOptions.nodeTypeProperty) {
            this._listModel.setNodeTypeProperty(newOptions.nodeTypeProperty);
        }
        if (this._options.groupNodeVisibility !== newOptions.groupNodeVisibility) {
            this._listModel.setGroupNodeVisibility(newOptions.groupNodeVisibility);
        }
    }

    protected _resolveBaseItemTemplate(): TemplateFunction | string {
        return 'Controls/treeGrid:ItemTemplate';
    }
}
