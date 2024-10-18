/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import { mixin } from 'Types/util';
import { NodeFooterMixin } from 'Controls/baseTree';
import TreeGridNodeExtraRow from './TreeGridNodeExtraRow';
import { IItemEventHandlers } from 'Controls/_baseList/ItemComponent';
import { IItemActionsHandler } from 'Controls/_baseList/Render/ItemActions';
import type { ITreeRowComponentProps, ITreeRowProps } from '../renderReact/CellRenderWithExpander';

/**
 * Футер узла в иерархической таблице
 * @private
 */
export default class TreeGridNodeFooterRow extends mixin<TreeGridNodeExtraRow, NodeFooterMixin>(
    TreeGridNodeExtraRow,
    NodeFooterMixin
) {
    readonly listInstanceName: string = 'controls-TreeGrid__node-footer';

    protected _$nodeFooterTemplate: TemplateFunction;

    getItemClasses(): string {
        return super.getItemClasses() + ' controls-TreeGrid__nodeFooter';
    }

    // Возможна ситуация, когда nodeFooterTemplate задали только для настройки опций,
    // а отображаться он будет при hasMoreStorage
    // То есть в этой случае мы не должны отображать футер, если нет данных еще, т.к. content не задан
    // При создании футера(в стратегии) это не определить
    shouldDisplayExtraItem(content: TemplateFunction): boolean {
        // Нужно рисовать футер если:
        //  * есть данные для загрузки и нужно показывать нашу кнопку "Ещё"
        //  * нет данных для загрузки и есть пользовательский контент
        return this.hasMoreStorage('forward') ? this.shouldDisplayMoreButton() : !!content;
    }

    getMoreClasses(): string {
        return 'controls-Tree__nodeFooterLoadMore controls-TreeGrid__nodeFooterLoadMore';
    }

    setNodeFooterTemplate(template: TemplateFunction): void {
        if (this._$nodeFooterTemplate !== template) {
            this._$nodeFooterTemplate = template;
            this._nextVersion();
        }
    }

    getRowTemplate(): TemplateFunction {
        return this._$nodeFooterTemplate;
    }

    getRowComponentProps(
        handlers?: IItemEventHandlers,
        actionHandlers?: IItemActionsHandler
    ): ITreeRowComponentProps {
        const superProps = super.getRowComponentProps(handlers, actionHandlers);
        return {
            ...superProps,
            nodeFooterTemplate: this.getNodeFooterTemplate(),
        };
    }

    protected _isColspanColumns(): boolean {
        return (
            super._isColspanColumns() &&
            !this.getRowTemplate() &&
            !this.getOwner().hasNodeFooterColumns()
        );
    }

    protected _resolveExtraItemTemplate(): string {
        return 'Controls/treeGrid:NodeFooterTemplate';
    }
}

Object.assign(TreeGridNodeFooterRow.prototype, {
    _cellModule: 'Controls/treeGrid:TreeGridNodeFooterCell',
    '[Controls/treeGrid:TreeGridNodeFooterRow]': true,
    '[Controls/tree:TreeNodeFooterItem]': true,
    _moduleName: 'Controls/treeGrid:TreeGridNodeFooterRow',
    _instancePrefix: 'tree-grid-node-footer-row-',
    _$nodeFooterTemplate: null,
});
