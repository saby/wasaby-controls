/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Model } from 'Types/entity';
import { ITreeTileViewOptions, TreeTileCollectionItem, TreeTileView } from 'Controls/treeTile';
import { SyntheticEvent } from 'UICommon/Events';
import { TSearchNavigationMode } from 'Controls/interface';
import 'css!Controls/searchBreadcrumbsTile';
import { SearchTileCollection } from './display/SearchTileCollection';

export interface IOptions extends ITreeTileViewOptions {
    searchNavigationMode?: TSearchNavigationMode;
    containerWidth?: number;
}

export default class SearchView extends TreeTileView {
    protected _options: IOptions;
    protected _listModel: SearchTileCollection;

    protected _beforeMount(options: IOptions): void {
        super._beforeMount(options);

        this._onBreadcrumbItemClick = this._onBreadcrumbItemClick.bind(this);
    }
    protected _beforeUpdate(options: IOptions): void {
        super._beforeUpdate(options);
        if (this._options.containerWidth !== options.containerWidth) {
            this._listModel.setContainerWidth(options.containerWidth);
        }
    }

    protected _onBreadcrumbItemClick(event: SyntheticEvent, item: Model): void {
        if (this._options.searchNavigationMode === 'readonly') {
            event.stopPropagation();
            return;
        }
        this._notify('itemClick', [item, event], { bubbling: true });
    }

    protected _onItemClick(
        e: SyntheticEvent<MouseEvent>,
        item: TreeTileCollectionItem<Model>
    ): void {
        if (this._options.searchNavigationMode === 'readonly') {
            e.stopPropagation();
            return;
        }
        super._onItemClick(e, item);
    }
}
