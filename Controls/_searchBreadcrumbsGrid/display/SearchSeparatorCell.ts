/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { GridCell } from 'Controls/grid';
import SearchSeparatorRow from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorRow';
import { TBackgroundStyle } from 'Controls/interface';

export default class SearchSeparatorCell extends GridCell<
    string,
    SearchSeparatorRow
> {
    readonly listInstanceName: string = 'controls-TreeGrid__separator';

    readonly listElementName: string = 'cell';

    getTemplate(): string {
        if (this._$isFirstDataCell) {
            return 'Controls/searchBreadcrumbsGrid:SearchSeparatorTemplate';
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
        let classes = super.getWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover,
            templateHoverBackgroundStyle
        );

        if (!this._$owner.isFullGridSupport()) {
            classes += ' controls-Grid__row-cell__autoHeight';
        }

        if (!this._$owner.hasMultiSelectColumn()) {
            classes += ` controls-Grid__cell_spacingFirstCol_${this._$owner.getLeftPadding()}`;
        }

        return classes;
    }

    hasCellContentRender(): boolean {
        return false;
    }

    getDefaultDisplayValue(): string {
        return '';
    }
}

Object.assign(SearchSeparatorCell.prototype, {
    '[Controls/_searchBreadcrumbsGrid/SearchSeparatorCell]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:SearchSeparatorCell',
    _instancePrefix: 'search-separator-cell-',
});
