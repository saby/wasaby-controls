/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import TreeGridDataCell from './TreeGridDataCell';
import { TemplateFunction } from 'UI/Base';
import TreeGridNodeExtraRow from './TreeGridNodeExtraRow';
import * as React from 'react';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';
import ExtraItemCellRender from 'Controls/_baseTreeGrid/renderReact/ExtraItemCellRender';
import TreeGridNodeFooterRow from 'Controls/_baseTreeGrid/display/TreeGridNodeFooterRow';

/**
 * Ячейка дополнительного элемента узла в иерархической таблице
 * @private
 */
export default class TreeGridNodeExtraItemCell extends TreeGridDataCell<null> {
    readonly '[Controls/treeGrid:TreeGridNodeExtraItemCell]': boolean;

    readonly listInstanceName: string = 'controls-TreeGrid__node-extra-item';

    readonly listElementName: string = 'cell';

    getTemplate(): TemplateFunction | string {
        return this._$column.template || null;
    }

    isMoreButton(): boolean {
        return !!(this.getOwner() as TreeGridNodeExtraRow).shouldDisplayMoreButton();
    }

    shouldRenderHasMoreButton(): boolean {
        // Первая колонка учитывая застиканную лесенку и множественный выбор
        const isFirstColumn =
            this.getColumnIndex(false, false) === +this._$owner.hasMultiSelectColumn();
        return this.isMoreButton() && isFirstColumn;
    }

    isFirstColumn(): boolean {
        return this.getColumnIndex(false, false) === 0;
    }

    getWrapperClasses(): string {
        let classes = `controls-TreeGrid__node-extraItem__wrapper ${this._getColumnSeparatorClasses()}`;
        if (this._$owner.hasColumnScroll()) {
            classes += ` ${this._getColumnScrollWrapperClasses()} controls-TreeGrid__node-extraItem__fixed`;
        }
        return classes;
    }

    getContentClasses(params: { hasContent: boolean }): string {
        const rowSeparatorSize = this._$owner.getRowSeparatorSize() || 'null';

        let classes = `controls-TreeGrid__nodeExtraItemContent_rowSeparatorSize-${rowSeparatorSize}`;

        if (!(this._$owner.hasMultiSelectColumn() && this.isFirstColumn())) {
            classes +=
                ' controls-TreeGrid__nodeExtraItem-cell__content controls-TreeGrid__nodeExtraItemContent';
        } else {
            classes += ` controls-Grid__row-cell-checkbox-${this.getStyle()}`;
        }

        if (params.hasContent || this.isMoreButton()) {
            classes += ' controls-TreeGrid__nodeExtraItem-minHeight';

            if (this.getOwner().isFullGridSupport()) {
                classes += ' controls-TreeGrid__nodeExtraItemContent__baseline';
            }
        }

        if (!this._$owner.hasMultiSelectColumn() && this.isFirstColumn()) {
            if (!this._$owner.isReactView()) {
                classes += ` controls-TreeGrid__nodeExtraItemContent_spacingLeft-${this._$owner.getLeftPadding()}`;
            }
        }

        if (this.isLastColumn()) {
            if (!this._$owner.isReactView()) {
                classes += ` controls-TreeGrid__nodeExtraItemContent_spacingRight-${this._$owner.getRightPadding()}`;
            }
        }

        return classes;
    }

    getRelativeCellWrapperClasses(): string {
        let classes = super.getRelativeCellWrapperClasses();

        if (this.isMoreButton()) {
            classes += ' controls-TreeGrid__nodeExtraItemContent__baseline';
        }

        return classes;
    }

    getCellComponentProps(
        rowProps: IRowComponentProps,
        _render: React.ReactElement
    ): ICellComponentProps {
        const item = this.getOwner() as TreeGridNodeExtraRow;
        const shouldDisplay = item.shouldDisplayExtraItem(this.config?.render);
        let render = null;
        if (shouldDisplay) {
            // TODO должно уйти из модели, это в итоге нужно делать в tsx, нужно придумать решение как избавиться
            //  https://online.sbis.ru/opendoc.html?guid=5f5728d5-9fe3-46ee-86f1-c5b6d2073e0e&client=3
            // В будущем надо научиться прокидывать настройки кнопки "Ещё" прямо из настроек навигации.
            // Возможно, ExtraItemCellRender должен быть Connected и использовать слайс.
            render = React.createElement(ExtraItemCellRender, {
                linkFontColorStyle: item.getMoreFontColorStyle(),
                loadMoreCaption: item.getMoreCaption(),
                buttonView: item.getViewConfig?.()?.buttonView ?? 'link',
                buttonConfig: item.getViewConfig?.()?.buttonConfig ?? null,
                renderHasMoreButton: this.shouldRenderHasMoreButton(),
                isMoreButton: this.isMoreButton(),
                customRender: this.config?.render,
                ...this._cellProps,
            });
        }

        const superProps = super.getCellComponentProps(rowProps, render);

        return {
            ...superProps,
            minHeightClassName:
                superProps.minHeight === 'null' ? '' : 'controls-TreeGrid__nodeExtraItem-minHeight',
            paddingTop: 'null',
            paddingBottom: 'null',
            hoverBackgroundStyle: 'none',
            nodeFooterTemplate: rowProps.nodeFooterTemplate,
            cursor: 'default',
        };
    }

    shouldDisplayEditArrow(): boolean {
        return false;
    }
}

Object.assign(TreeGridNodeExtraItemCell.prototype, {
    '[Controls/treeGrid:TreeGridNodeExtraItemCell]': true,
    _moduleName: 'Controls/treeGrid:TreeGridNodeExtraItemCell',
    _instancePrefix: 'tree-grid-node-extra-item-cell-',
});
