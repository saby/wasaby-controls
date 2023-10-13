import { View as BaseView } from 'Controls/list';
import { IAbstractListVirtualScrollControllerConstructor } from 'Controls/baseList';
import { default as AdaptiveTileView } from './render/AdaptiveTileView';
import AdaptiveTileControl from './AdaptiveTileControl';
import { HorizontalTileScrollController } from 'Controls/baseTile';

export default class View extends BaseView<AdaptiveTileControl> {
    protected _viewName: typeof AdaptiveTileView = AdaptiveTileView;
    protected _viewTemplate: typeof AdaptiveTileControl = AdaptiveTileControl;
    protected _viewModelConstructor: string | Function = null;
    protected _task1187242805: boolean = true;

    protected _getModelConstructor(): string | Function {
        return 'Controls/adaptiveTile:Collection';
    }

    protected _getListVirtualScrollConstructor(): IAbstractListVirtualScrollControllerConstructor {
        return HorizontalTileScrollController;
    }
}
