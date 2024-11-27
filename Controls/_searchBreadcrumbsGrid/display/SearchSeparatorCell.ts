/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { GridCell } from 'Controls/grid';
import SearchSeparatorRow from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorRow';

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
