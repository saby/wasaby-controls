/**
 * @kaizen_zone 98c7854f-02f3-4b6d-923e-ed20e6ecfaa0
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
