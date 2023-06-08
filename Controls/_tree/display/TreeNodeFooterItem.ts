/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TemplateFunction } from 'UI/Base';
import TreeNodeExtraItem from './TreeNodeExtraItem';

export default class TreeNodeFooterItem extends TreeNodeExtraItem {
    readonly listInstanceName: string = 'controls-Tree__node-footer';

    protected _$nodeFooterTemplate: TemplateFunction;

    setNodeFooterTemplate(template: TemplateFunction): void {
        if (this._$nodeFooterTemplate !== template) {
            this._$nodeFooterTemplate = template;
            this._nextVersion();
        }
    }

    getTemplate(): TemplateFunction | string {
        return this._$nodeFooterTemplate || super.getTemplate();
    }

    getItemClasses(): string {
        return super.getItemClasses() + ' controls-Tree__nodeFooter';
    }

    getContentClasses(): string {
        return (
            super.getContentClasses() + ' controls-Tree__itemContentTreeWrapper'
        );
    }

    getMoreClasses(): string {
        return 'controls-Tree__nodeFooterLoadMore';
    }
}

Object.assign(TreeNodeFooterItem.prototype, {
    '[Controls/tree:TreeNodeFooterItem]': true,
    _moduleName: 'Controls/tree:TreeNodeFooterItem',
    _instancePrefix: 'tree-node-footer-item-',
    _$nodeFooterTemplate: null,
});
