/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TemplateFunction } from 'UI/Base';
import { MoreButtonVisibility } from 'Controls/display';
import TreeGridNodeExtraRow from './TreeGridNodeExtraRow';

/**
 * Футер узла в иерархической таблице
 * @private
 */
export default class TreeGridNodeFooterRow extends TreeGridNodeExtraRow {
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
        return this.hasMoreStorage('forward') ? this.needMoreButton() : !!content;
    }

    getMoreClasses(): string {
        return 'controls-Tree__nodeFooterLoadMore controls-TreeGrid__nodeFooterLoadMore';
    }

    /**
     * Кнопка "Ещё" нужна всегда кроме следующих случаев:
     *  * Нет данных для загрузки
     *  ИЛИ
     *  * выставлен режим скрытия для последнего узла
     *  * текущий узел является последней записью в коллекции
     *  * не задан футер списка
     */
    needMoreButton(): boolean {
        const dataRow = this.getParent();
        const collection = this.getOwner();
        const dataRowIsLastCollectionItem = collection.getRoot().getLastChildItem() === dataRow;
        const hideForLastNode =
            collection.getMoreButtonVisibility() === MoreButtonVisibility.exceptLastNode;

        const needHide =
            !this.hasMoreStorage('forward') ||
            (hideForLastNode && dataRowIsLastCollectionItem && !collection.getFooter());

        return !needHide;
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
