/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { View as TreeGrid } from 'Controls/treeGrid';
import { TemplateFunction } from 'UI/Base';
import SearchView from 'Controls/_searchBreadcrumbsGrid/SearchView';
import { isFullGridSupport } from 'Controls/display';
import SearchViewTable from 'Controls/_searchBreadcrumbsGrid/SearchViewTable';
import SearchGridControl from './SearchGridControl';

export default class Search extends TreeGrid {
    protected _viewName: TemplateFunction;

    protected _getWasabyView() {
        return isFullGridSupport() ? SearchView : SearchViewTable;
    }

    protected _getReactViewControl() {
        return SearchGridControl;
    }

    protected _getModelConstructor(): string {
        return 'Controls/searchBreadcrumbsGrid:SearchGridCollection';
    }
}
