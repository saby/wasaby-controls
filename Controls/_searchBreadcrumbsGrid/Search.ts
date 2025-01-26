/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { View as TreeGrid } from 'Controls/treeGrid';
import { TemplateFunction } from 'UI/Base';
import { ReactSearchBreadcrumbsTreeGridView } from 'Controls/_searchBreadcrumbsGrid/view/View';
import 'Controls/listDataOld';

export default class Search extends TreeGrid {
    protected _viewName: TemplateFunction;

    protected _getWasabyView() {
        // isFullGridSupport() ??
        return ReactSearchBreadcrumbsTreeGridView;
    }

    protected _getModelConstructor(): string {
        return 'Controls/searchBreadcrumbsGrid:SearchGridCollection';
    }
}
