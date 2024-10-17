/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import * as React from 'react';
import { GridCell } from 'Controls/grid';
import SearchSeparatorRow from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorRow';
import { TBackgroundStyle } from 'Controls/interface';
import { COLUMN_SCROLL_JS_SELECTORS, DRAG_SCROLL_JS_SELECTORS } from 'Controls/columnScroll';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';
import SearchSeparatorComponent from '../render/SearchSeparatorComponent';

export default class SearchSeparatorCell extends GridCell<string, SearchSeparatorRow> {
    readonly listInstanceName: string = 'controls-TreeGrid__separator';

    readonly listElementName: string = 'cell';

    getIsFirstDataCell(): boolean {
        return this._$isFirstDataCell;
    }

    getTemplate(): string {
        if (this._$isFirstDataCell) {
            return 'Controls/searchBreadcrumbsGrid:SearchSeparatorComponent';
        } else {
            return this._defaultCellTemplate;
        }
    }

    getWrapperClasses(
        theme: string,
        backgroundColorStyle: TBackgroundStyle,
        style: string = 'default',
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: TBackgroundStyle
    ): string {
        let classes = this._getWrapperBaseClasses(templateHighlightOnHover);
        classes += this._getWrapperSeparatorClasses();
        const hasColumnScroll = this._$owner.hasColumnScroll();

        if (!hasColumnScroll) {
            classes += ' controls-Grid__cell_fit';
        }

        if (this.getColspan() > 1) {
            classes += ' js-controls-Grid__cell_colspaned';
        }

        if (this._$owner.hasColumnScroll()) {
            classes += ` ${this._getColumnScrollWrapperClasses()}`;
        }

        classes += ' js-controls-ListView__measurableContainer';

        if (!this._$owner.isFullGridSupport()) {
            classes += ' controls-Grid__row-cell__autoHeight';
        }

        if (!this._$owner.hasMultiSelectColumn() && this.isFirstColumn()) {
            classes += ` controls-Grid__cell_spacingFirstCol_${this._$owner.getLeftPadding()}`;
        }

        return classes;
    }

    getContentClasses(
        backgroundColorStyle: TBackgroundStyle = this._$column.backgroundColorStyle,
        cursor: string = 'default',
        templateHighlightOnHover: boolean,
        tmplIsEditable?: boolean,
        templateHoverBackgroundStyle?: TBackgroundStyle
    ): string {
        let contentClasses =
            'controls-Grid__row-cell__content controls-Grid__row-cell_cursor-default';
        contentClasses += ' controls-Grid__row-cell__content_baseline_default';
        contentClasses += ' controls-Grid__row-cell_withoutRowSeparator_size-null';
        contentClasses += ' controls-Grid__cell-content_full-height';
        if (backgroundColorStyle) {
            contentClasses += ` controls-background-${backgroundColorStyle}`;
        }
        contentClasses += this.getOwner().getFadedClass();

        if (this._$owner.hasColumnScroll()) {
            contentClasses += ` ${DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE}`;
        }

        return contentClasses;
    }

    hasCellContentRender(): boolean {
        return false;
    }

    getDefaultDisplayValue(): string {
        return '';
    }

    // region CellProps

    updateCellProps() {}

    // endregion CellProps
}

Object.assign(SearchSeparatorCell.prototype, {
    '[Controls/_searchBreadcrumbsGrid/SearchSeparatorCell]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:SearchSeparatorCell',
    _instancePrefix: 'search-separator-cell-',
});
