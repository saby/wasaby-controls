/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import { mixin } from 'Types/util';
import { NodeFooterMixin } from 'Controls/baseTree';
import TreeNodeExtraItem from './TreeNodeExtraItem';

export default class TreeNodeFooterItem extends mixin<TreeNodeExtraItem, NodeFooterMixin>(
    TreeNodeExtraItem,
    NodeFooterMixin
) {
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
        return super.getContentClasses() + ' controls-Tree__itemContentTreeWrapper';
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
