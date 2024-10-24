/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls/_propertyGrid/GridRender/Render';
import * as groupTemplate from 'wml!Controls/_propertyGrid/Render/resources/groupTemplate';
import * as itemTemplate from 'wml!Controls/_propertyGrid/Render/resources/itemTemplate';
import * as toggleEditorsTemplate from 'wml!Controls/_propertyGrid/Render/resources/toggleEditorsGroupTemplate';
import PropertyGridCollectionItem, {
    default as PropertyGridItem,
} from './PropertyGridCollectionItem';
import PropertyGridCollection from './PropertyGridCollection';
import { CollectionItem, isFullGridSupport } from 'Controls/display';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'css!Controls/baseTree';

interface IColumnOptions {
    width: string;
    compatibleWidth: string;
}
interface IPropertyGridGridRenderOptions extends IControlOptions {
    listModel?: PropertyGridCollection<PropertyGridItem<Model>>;
    groupTemplate: TemplateFunction;
    itemTemplate: TemplateFunction;
}

export default class IPropertyGridRender extends Control<IPropertyGridGridRenderOptions> {
    protected _template: TemplateFunction = template;
    protected _toggleEditorsTemplate: TemplateFunction = toggleEditorsTemplate;

    protected _beforeMount(): void {
        this._getCaptionStyles = this._getCaptionStyles.bind(this);
        this._getEditorStyles = this._getEditorStyles.bind(this);
        this._getCheckboxStyles = this._getCheckboxStyles.bind(this);
    }

    protected _getColumnsWidth(
        captionTemplateOptions: IColumnOptions,
        editorTemplateOptions: IColumnOptions,
        multiSelectVisibility: string = 'hidden'
    ): string {
        const width = {
            compatibleCaption: captionTemplateOptions?.compatibleWidth || '1fr',
            compatibleEditor: editorTemplateOptions?.compatibleWidth || '1fr',
            caption: captionTemplateOptions?.width || '1fr',
            editor: editorTemplateOptions?.width || '1fr',
        };
        const captionColumnWidth = isFullGridSupport() ? width.caption : width.compatibleCaption;
        const editorColumn = isFullGridSupport() ? width.editor : width.compatibleEditor;
        const multiSelectColumnsWidth = multiSelectVisibility !== 'hidden' ? 'max-content' : '';
        return `-ms-grid-columns: ${multiSelectColumnsWidth} ${width.compatibleCaption} ${width.compatibleEditor};
                 grid-template-columns: ${multiSelectColumnsWidth} ${captionColumnWidth} ${editorColumn};`;
    }

    protected _getCheckboxStyles(
        item: PropertyGridItem<Model>,
        captionPosition: string,
        isEmptyCell: boolean
    ): string {
        const rowIndex = this._getRowIndex(
            item,
            captionPosition,
            item.getEditorTemplateName() && !isEmptyCell ? 2 : 1
        );
        const columnIndex = 1;
        return this._getGridStyles(rowIndex, columnIndex);
    }

    protected _getCaptionStyles(
        item: PropertyGridItem<Model>,
        captionPosition?: string,
        colspan: boolean
    ): string {
        const rowIndex = this._getRowIndex(
            item,
            captionPosition,
            captionPosition === 'top' ? 1 : 2
        );
        const columnIndex = this._isMultiSelect() ? 2 : 1;
        let colspanIndex;
        if (colspan || captionPosition === 'top') {
            colspanIndex = columnIndex + 1;
        }
        return this._getGridStyles(rowIndex, columnIndex, colspanIndex);
    }

    protected _getEditorStyles(
        item: PropertyGridItem<Model>,
        captionPosition: string,
        colspan?: boolean
    ): string {
        const needColspan =
            captionPosition === 'top' ||
            captionPosition === 'none' ||
            !(item.getContents().get('caption') || item.getContents().get('isEditable'));
        const rowIndex = this._getRowIndex(item, captionPosition, 2);
        const columnIndex = (this._isMultiSelect() ? 2 : 1) + (needColspan ? 0 : 1);
        let colspanIndex;
        if (colspan || needColspan) {
            colspanIndex = columnIndex + (needColspan ? 1 : 0);
        }
        return this._getGridStyles(rowIndex, columnIndex, colspanIndex);
    }

    private _getRowIndex(
        item: PropertyGridItem<Model>,
        captionPosition: string,
        rowOffset: number
    ): number {
        const itemIndex = this._getItemIndex(item);
        const rowIndexByItemIndex = itemIndex + 1; // индекс строки грида не может начинаться с 0
        return rowIndexByItemIndex + this._getPreviousItemIndex(item) + rowOffset;
    }

    private _getGridStyles(rowIndex: number, columnIndex: number, colspanIndex?: number): string {
        return (
            this._getGridRowStyles(rowIndex) +
            this._getGridColumnStyles(columnIndex) +
            (colspanIndex !== undefined ? this._getColspanStyles(colspanIndex) : '')
        );
    }

    private _getGridRowStyles(rowIndex: number): string {
        return `grid-row: ${rowIndex};
               -ms-grid-row: ${rowIndex};`;
    }

    private _getGridColumnStyles(columnIndex: number): string {
        return `grid-column: ${columnIndex};
               -ms-grid-column: ${columnIndex};`;
    }

    private _getColspanStyles(columnIndex: number): string {
        return `-ms-grid-column-span: 2;
               grid-column-end: ${columnIndex + 1};`;
    }

    private _isMultiSelect(): boolean {
        const multiSelectVisibility = this._options.listModel.getMultiSelectVisibility();
        return multiSelectVisibility && multiSelectVisibility !== 'hidden';
    }

    private _getItemIndex(item: PropertyGridItem<Model>): number {
        return this._options.listModel.getIndex(item);
    }

    private _getPreviousItemIndex(item: PropertyGridItem<Model>): number {
        return this._getItemIndex(item) - 1;
    }

    protected _propertyValueChanged(
        e: SyntheticEvent<Event>,
        item: Model,
        value: Record<string, unknown>
    ): void {
        e.stopPropagation();
        this._notify('propertyValueChanged', [item, value]);
    }

    protected _mouseEnterHandler(e: SyntheticEvent<Event>, item: PropertyGridItem<Model>): void {
        this._notify('itemMouseEnter', [item, e]);
    }

    protected _mouseMoveHandler(e: SyntheticEvent<Event>, item: PropertyGridItem<Model>): void {
        this._notify('itemMouseMove', [item, e]);
    }

    protected _mouseLeaveHandler(e: SyntheticEvent<Event>, item: PropertyGridItem<Model>): void {
        this._notify('itemMouseLeave', [item, e]);
    }

    protected _toggleEditor(event: SyntheticEvent, item: Model, value: boolean): void {
        this._notify('toggleEditor', [item, value]);
    }

    protected _onItemActionMouseEnter(): void {
        /**/
    }
    protected _onItemActionMouseLeave(): void {
        /**/
    }
    protected _onItemActionsMouseEnter(): void {
        /**/
    }

    protected _onItemActionMouseDown(
        e: SyntheticEvent<MouseEvent>,
        action: unknown,
        item: PropertyGridItem<Model>
    ): void {
        e.stopPropagation();
        this._notify('itemActionMouseDown', [item, action, e]);
    }

    protected _onItemActionMouseUp(e: SyntheticEvent<MouseEvent>): void {
        e.stopPropagation();
    }

    protected _onItemActionClick(e: SyntheticEvent<MouseEvent>): void {
        e.stopPropagation();
    }

    protected _itemContextMenu(e: SyntheticEvent<MouseEvent>, item: CollectionItem<Model>): void {
        if (!item['[Controls/_display/GroupItem]']) {
            this._notify('itemContextMenu', [item, e]);
        }
    }

    _commitEditActionHandler(e: SyntheticEvent<MouseEvent>, item: PropertyGridItem<Model>): void {
        this._notify('commitEdit', [item, e]);
    }

    _cancelEditActionHandler(e: SyntheticEvent<MouseEvent>, item: PropertyGridItem<Model>): void {
        this._notify('cancelEdit', [item, e]);
    }

    protected _itemClick(e: SyntheticEvent<MouseEvent>, item: PropertyGridItem<Model>): void {
        if (e.target.closest('.js-controls-ListView__checkbox')) {
            this._notify('checkBoxClick', [item, e]);
        } else if (item['[Controls/_display/GroupItem]']) {
            this._notify('groupClick', [item, e]);
        } else if (!item.isEditing()) {
            this._notify('propertyItemClick', [item.getContents(), e]);
        }
    }

    protected _itemMouseDown(
        e: SyntheticEvent<MouseEvent>,
        item: PropertyGridCollectionItem<Model>
    ): void {
        if (!item['[Controls/_display/GroupItem]']) {
            this._notify('itemMouseDown', [item, e]);
        }
    }

    protected _itemMouseUp(
        e: SyntheticEvent<MouseEvent>,
        item: PropertyGridCollectionItem<Model>
    ): void {
        if (!item['[Controls/_display/GroupItem]']) {
            this._notify('itemMouseUp', [item, e]);
        }
    }

    protected _validateFinished(e: SyntheticEvent, name: string, validationResult: any): void {
        this._notify('validateFinished', [name, validationResult]);
    }

    static getDefaultOptions = (): IPropertyGridGridRenderOptions => {
        return {
            groupTemplate,
            itemTemplate,
        };
    };
}
