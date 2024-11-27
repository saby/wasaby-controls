/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { GridDataCell, IGridDataCellOptions } from 'Controls/grid';
import { Model } from 'Types/entity';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';
import * as React from 'react';

export interface IOptions<T> extends IGridDataCellOptions<T> {
    breadCrumbsMode?: 'row' | 'cell';
}

export default class BreadcrumbsItemCell<
    S extends Model = Model,
    TOwner extends BreadcrumbsItemRow<S> = BreadcrumbsItemRow<S>,
> extends GridDataCell<any, any> {
    readonly '[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemCell]': boolean = true;

    protected _$breadCrumbsMode: 'row' | 'cell';

    readonly listInstanceName: string = 'controls-SearchBreadcrumbsGrid';

    readonly listElementName: string = 'cell';

    // TODO Можно будет убрать и переместить в clean когда ячейка данных тоже будет clean.
    //  Это используется в случае когда ячейка строки хлебных крошек является скроллируемой
    //  и рендерится через обычный CellComponent.
    //  Вариант альтернативы - конкатенировать по типу ячейки ? listInstanceName ?
    calculationMinHeightClass(): string {
        return ' controls-GridReact__minHeight-breadcrumbs';
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
}

Object.assign(BreadcrumbsItemCell.prototype, {
    '[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemCell]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:BreadcrumbsItemCell',
    _instancePrefix: 'search-breadcrumbs-grid-cell-',
    _$breadCrumbsMode: 'row',
});
