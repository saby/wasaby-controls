/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import { mixin } from 'Types/util';
import { NodeFooterMixin } from 'Controls/baseTreeDisplay';
import TreeGridNodeExtraRow from './TreeGridNodeExtraRow';
import type { IItemActionsHandler, IItemEventHandlers } from 'Controls/baseList';
import { IRowComponentProps } from 'Controls/_gridRender/row/interface/IRowComponent';

/**
 * Футер узла в иерархической таблице
 * @private
 */
export default class TreeGridNodeFooterRow extends mixin<TreeGridNodeExtraRow, NodeFooterMixin>(
    TreeGridNodeExtraRow,
    NodeFooterMixin
) {
    readonly $TNF: boolean = true;
    readonly listInstanceName: string = 'controls-TreeGrid__node-footer';

    protected _$nodeFooterTemplate: TemplateFunction;

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

    // Для nodeFooter есть опция getNodeFooterProps и getRowProps не должен для него применяться.
    // При вызове Controls/_gridDisplay/mixins/Grid.ts:448 getRowProps применяется к nodeFooter.
    // Чтобы не допустить вызова setGetRowPropsCallback здесь Controls/_gridDisplay/mixins/Row.ts:170,
    // для TreeGridNodeFooterRow переопределяем этот метод.
    // По ошибке: https://online.sbis.ru/opendoc.html?guid=8b906c4a-30ce-4921-acf9-a36297a85ee0&client=3
    setGetRowPropsCallback() {}

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
    ): IRowComponentProps {
        const superProps = super.getRowComponentProps(handlers, actionHandlers);
        return {
            ...superProps,
            nodeFooterTemplate: this.getNodeFooterTemplate(),
        };
    }

    isTopSeparatorEnabled(): boolean {
        return (
            super.isTopSeparatorEnabled() &&
            ['blocks', 'titledBlocks'].indexOf(this.getGroupViewMode()) === -1
        );
    }

    protected _isColspanColumns(): boolean {
        return (
            super._isColspanColumns() &&
            !this.getRowTemplate() &&
            !this.getOwner().hasNodeFooterColumns()
        );
    }

    protected _resolveExtraItemTemplate(): string {
        return 'Controls/treeGridRender:NodeFooterTemplate';
    }
}

Object.assign(TreeGridNodeFooterRow.prototype, {
    _cellModule: 'Controls/treeGrid:TreeGridNodeFooterCell',
    '[Controls/treeGrid:TreeGridNodeFooterRow]': true,
    $TNF: true, // TreeNodeFooter
    _moduleName: 'Controls/treeGrid:TreeGridNodeFooterRow',
    _instancePrefix: 'tree-grid-node-footer-row-',
    _$nodeFooterTemplate: null,
});
