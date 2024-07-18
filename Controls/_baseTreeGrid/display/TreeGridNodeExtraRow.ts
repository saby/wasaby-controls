/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import { TreeItem } from 'Controls/baseTree';
import { Model } from 'Types/entity';
import TreeGridDataRow from './TreeGridDataRow';
import { IColumn, TColspanCallbackResult, TColumns } from 'Controls/baseGrid';

/**
 * Дополнительный элемент узла в иерархической таблице
 * @private
 */
export default abstract class TreeGridNodeExtraRow extends TreeGridDataRow<null> {
    readonly listElementName: string = 'row';

    get Markable(): boolean {
        return false;
    }
    readonly Fadable: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly SupportItemActions: boolean = false;

    protected _$moreFontColorStyle: string;
    protected _$moreCaption: string;

    getTemplate(): TemplateFunction | string {
        return 'Controls/treeGrid:ItemTemplate';
    }

    get node(): TreeItem<Model> {
        return this.getNode();
    }

    getNode(): TreeItem<Model> {
        return this.getParent();
    }

    // FIXME: Необходимость переопределения этого метода - следствие неправильного наследования.
    //  Подвал наследуется от строки данных дерева, хотя должен просто от абстрактной строки дерева.
    //  У строки данных наиболее специфичная логика колонок строки и колонок всего дерева(в данных это одно и то же).
    //  Для абстрактной строки в дереве это не так.
    //  Привело к ошибке, что при установке колонок всей таблицы, они устанавливались в подвал.
    setGridColumnsConfig(columns: TColumns): void {
        this._$gridColumnsConfig = columns;
        if (!this.isReactView() && this.getOwner().hasNodeFooterColumns()) {
            this.setColumnsConfig(columns);
        }
        if (this.isReactView()) {
            this.setColumnsConfig(this.getOwner().getNodeFooter());
        }
        this._reinitializeColumns(true);
    }

    getItemClasses(): string {
        return 'controls-ListView__itemV controls-Grid__row';
    }

    isSticked(): boolean {
        return false;
    }

    getMoreCaption(): string {
        return this._$moreCaption;
    }

    getMoreFontColorStyle(): string {
        return this._$moreFontColorStyle;
    }

    setMoreFontColorStyle(moreFontColorStyle: string): void {
        if (this._$moreFontColorStyle !== moreFontColorStyle) {
            this._$moreFontColorStyle = moreFontColorStyle;
            this._nextVersion();
        }
    }

    shouldDisplayExtraItem(content: TemplateFunction): boolean {
        return true;
    }

    protected _isColspanColumns(): boolean {
        return this.shouldDisplayMoreButton();
    }

    protected abstract _resolveExtraItemTemplate(): string;

    protected _initializeColumns(): void {
        if (this._isColspanColumns()) {
            this.setRowTemplate(this._resolveExtraItemTemplate());
        }

        super._initializeColumns({
            colspanStrategy: 'consistently',
            prepareStickyLadderCellsStrategy: !this._$rowTemplate
                ? 'add'
                : this.getStickyLadderCellsCount()
                ? 'offset'
                : 'colspan',
            shouldAddMultiSelectCell: true,
            extensionCellsConstructors: {
                multiSelectCell: this.getColumnsFactory({ column: {} }),
            },
        });
    }

    abstract getMoreClasses(): string;
    abstract shouldDisplayMoreButton(): boolean;
}

Object.assign(TreeGridNodeExtraRow.prototype, {
    _cellModule: 'Controls/treeGrid:TreeGridNodeExtraItemCell',
    _$supportLadder: false,
    _$moreFontColorStyle: null,
    _$moreCaption: null,
});
