/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { GridDataCell } from 'Controls/grid';
import { Model } from 'Types/entity';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';
import { TemplateFunction } from 'UI/Base';
import { IOptions as IDataCellOptions } from 'Controls/_grid/display/DataCell';
import * as React from 'react';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';
import PathComponent, { IPathComponentProps } from '../render/PathComponent';

export interface IOptions<T> extends IDataCellOptions<T> {
    breadCrumbsMode?: 'row' | 'cell';
    onBreadcrumbItemClick?: (event: Event, item: Record) => void;
}

export default class BreadcrumbsItemCell<
    S extends Model = Model,
    TOwner extends BreadcrumbsItemRow<S> = BreadcrumbsItemRow<S>
> extends GridDataCell<any, any> {
    protected _$onBreadcrumbItemClick: (event: Event, item: Record) => void;

    protected _$breadCrumbsMode: 'row' | 'cell';

    readonly listInstanceName: string = 'controls-SearchBreadcrumbsGrid';

    readonly listElementName: string = 'cell';

    getTemplate(): TemplateFunction | string {
        // Только в первой ячейке отображаем хлебную крошку
        if (this._shouldRenderBreadcrumbs()) {
            return this.getOwner().getCellTemplate();
        } else {
            if (this._$breadCrumbsMode === 'cell') {
                return super.getTemplate();
            } else {
                return this._defaultCellTemplate;
            }
        }
    }

    getDefaultDisplayValue(): string {
        return '';
    }

    getDisplayValue(): string {
        return this.getDefaultDisplayValue();
    }

    getSearchValue(): string {
        return this.getOwner().getSearchValue();
    }

    getContents(): S[] {
        return this.getOwner().getContents();
    }

    getOriginalContents(): S[] {
        return this.getOwner().getOriginalContents();
    }

    getKeyProperty(): string {
        return this.getOwner().getKeyProperty();
    }

    getMinHeightClasses(): string {
        return ' controls-Grid__row-cell_breadCrumbsSearch_min_height';
    }

    getWrapperClasses(
        theme: string,
        backgroundColorStyle: string,
        style: string = 'default',
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: string
    ): string {
        let classes = super.getWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover,
            templateHoverBackgroundStyle
        );
        classes += ' controls-TreeGrid__row__searchBreadCrumbs js-controls-ListView__notEditable';
        classes += this._getHoverBackgroundClasses(templateHoverBackgroundStyle);
        return classes;
    }

    getContentClasses(): string {
        // Только в первой ячейке выводятся хлебные крошки
        let classes: string;
        if (
            this.isFirstColumn() ||
            (this.getOwner().hasMultiSelectColumn() && this.getColumnIndex() === 1)
        ) {
            classes =
                'controls-Grid__row-cell__content controls-Grid__row-cell__content_colspaned ';

            if (!this.getOwner().hasMultiSelectColumn()) {
                classes += `controls-Grid__cell_spacingFirstCol_${this.getOwner().getLeftPadding()} `;
            }

            classes += `controls-Grid__row-cell_${this.getStyle()}_rowSpacingTop_${this.getOwner().getTopPadding()} `;
            classes += `controls-Grid__row-cell_${this.getStyle()}_rowSpacingBottom_${this.getOwner().getBottomPadding()} `;

            if (this.isLastColumn()) {
                classes += `controls-Grid__cell_spacingLastCol_${this.getOwner().getRightPadding()} `;
            } else {
                classes += ' controls-Grid__cell_spacingRight';
            }
        } else {
            classes = super.getContentClasses();
        }
        classes += this._getHoverBackgroundClasses();
        return classes;
    }

    shouldDisplayEditArrow(contentTemplate?: React.Component | React.FunctionComponent): boolean {
        if (!!contentTemplate || this.getColumnIndex() > 0) {
            return false;
        }
        const contents = this._$owner.getLast().getContents();
        return this._$owner.editArrowIsVisible(contents);
    }

    getDisplayProperty(): string {
        return this._$owner.getDisplayProperty();
    }

    getBreadCrumbsMode(): 'row' | 'cell' {
        return this._$breadCrumbsMode;
    }

    private _shouldRenderBreadcrumbs() {
        return (
            this.isFirstColumn() ||
            (this.getOwner().hasMultiSelectColumn() && this.getColumnIndex() === 1)
        );
    }

    // region CellProps

    getBreadcrumbsPathProps(): IPathComponentProps {
        return {
            keyProperty: this.getKeyProperty(),
            displayProperty: this.getDisplayProperty(),
            readOnly: this._$owner.isReadonly(),
            items: this.getContents(),

            backgroundStyle: this._$owner.getBackgroundStyle(),
            containerWidth: this._$owner.getContainerWidth(),
            onBreadCrumbsItemClick: this._$onBreadcrumbItemClick,
            searchValue: this.getSearchValue(),
        };
    }

    getCellComponentProps(
        rowProps: IRowComponentProps,
        render: React.ReactElement
    ): ICellComponentProps {
        const superResult = super.getCellComponentProps(rowProps, render);

        const getRender = () => {
            if (this._shouldRenderBreadcrumbs()) {
                return React.createElement(PathComponent, this.getBreadcrumbsPathProps());
            } else {
                return this._$breadCrumbsMode === 'cell' ? superResult.render : null;
            }
        };

        return {
            ...superResult,
            render: getRender(),
        };
    }

    updateCellProps() {}

    // endregion CellProps
}

Object.assign(BreadcrumbsItemCell.prototype, {
    '[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemCell]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:BreadcrumbsItemCell',
    _instancePrefix: 'search-breadcrumbs-grid-cell-',
    _$breadCrumbsMode: 'row',
    _$onBreadcrumbItemClick: null,
});
