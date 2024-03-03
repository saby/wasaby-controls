/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import TreeGridNodeExtraRow from './TreeGridNodeExtraRow';
import { TemplateFunction } from 'UI/Base';

/**
 * Хедер узла в иерархической таблице
 * @private
 */
export default class TreeGridNodeHeaderRow extends TreeGridNodeExtraRow {
    readonly listInstanceName: string = 'controls-TreeGrid__node-header';

    protected _$nodeHeaderTemplate: TemplateFunction;

    setNodeHeaderTemplate(template: TemplateFunction): void {
        if (this._$nodeHeaderTemplate !== template) {
            this._$nodeHeaderTemplate = template;
            this._nextVersion();
        }
    }

    getRowTemplate(): TemplateFunction {
        return this._$nodeHeaderTemplate;
    }

    getItemClasses(): string {
        return super.getItemClasses() + ' controls-TreeGrid__nodeHeader';
    }

    getMoreClasses(): string {
        return 'controls-Tree__nodeHeaderLoadMore controls-TreeGrid__nodeHeaderLoadMore';
    }

    shouldDisplayMoreButton(): boolean {
        return this.hasMoreStorage('backward');
    }

    protected _resolveExtraItemTemplate(): string {
        return 'Controls/treeGrid:NodeHeaderTemplate';
    }
}

Object.assign(TreeGridNodeHeaderRow.prototype, {
    _cellModule: 'Controls/treeGrid:TreeGridNodeHeaderCell',
    '[Controls/treeGrid:TreeGridNodeHeaderRow]': true,
    '[Controls/tree:TreeNodeHeaderItem]': true,
    _moduleName: 'Controls/treeGrid:TreeGridNodeHeaderRow',
    _instancePrefix: 'tree-grid-node-header-row-',
    _$nodeHeaderTemplate: null,
});
