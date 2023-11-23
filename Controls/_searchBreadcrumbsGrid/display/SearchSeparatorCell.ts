/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { GridCell } from 'Controls/grid';
import SearchSeparatorRow from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorRow';
import { TBackgroundStyle } from 'Controls/interface';
import * as React from 'react';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';
import SearchSeparatorComponent from '../render/SearchSeparatorComponent';

export default class SearchSeparatorCell extends GridCell<string, SearchSeparatorRow> {
    readonly listInstanceName: string = 'controls-TreeGrid__separator';

    readonly listElementName: string = 'cell';

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
        let contentClasses = 'controls-Grid__row-cell__content';
        contentClasses += ' controls-Grid__row-cell__content_baseline_default';
        contentClasses += ' controls-Grid__row-cell_withoutRowSeparator_size-null';
        contentClasses += ' controls-Grid__cell-content_full-height';
        if (backgroundColorStyle) {
            contentClasses += ` controls-background-${backgroundColorStyle}`;
        }
        contentClasses += this.getOwner().getFadedClass();
        return contentClasses;
    }

    hasCellContentRender(): boolean {
        return false;
    }

    getDefaultDisplayValue(): string {
        return '';
    }

    // region CellProps

    getCellComponentProps(
        rowProps: IRowComponentProps,
        render: React.ReactElement
    ): ICellComponentProps {
        const superResult = super.getCellComponentProps(rowProps, render);

        return {
            ...superResult,
            render: this._$isFirstDataCell
                ? React.createElement(SearchSeparatorComponent, {})
                : null,
        };
    }

    updateCellProps() {}

    // endregion CellProps
}

Object.assign(SearchSeparatorCell.prototype, {
    '[Controls/_searchBreadcrumbsGrid/SearchSeparatorCell]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:SearchSeparatorCell',
    _instancePrefix: 'search-separator-cell-',
});
