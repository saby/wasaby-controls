/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
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
