/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { TemplateFunction } from 'UI/Base';
import { View as TreeTileView } from 'Controls/treeTile';
import SearchView from 'Controls/_searchBreadcrumbsTile/SearchView';

/**
 * Компонент отображающий плитку с узлами в виде хлебных крошек
 * @private
 */
export default class Search extends TreeTileView {
    protected _viewName: TemplateFunction = SearchView;

    protected _getModelConstructor(): string {
        return 'Controls/searchBreadcrumbsTile:SearchTileCollection';
    }
}
