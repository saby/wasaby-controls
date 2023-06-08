import {
    ListControl,
    IScrollParams as IBaseScrollParams,
    IBaseControlOptions,
    IAbstractListVirtualScrollControllerOptions,
} from 'Controls/baseList';
import Collection from './display/Collection';
import { HORIZONTAL_LOADING_TRIGGER_SELECTOR } from 'Controls/baseTile';
import { SyntheticEvent } from 'UI/Events';

interface IOptions extends IBaseControlOptions {
    minItemHeight: number;
    maxItemHeight: number;
    minItemWidth: number;
    maxItemWidth: number;
    availableHeight: number;
}

interface IScrollParams extends IBaseScrollParams {
    clientWidth: number;
    scrollLeft: number;
    scrollWidth: number;
}

export default class AdaptiveTileControl extends ListControl {
    protected _listViewModel: Collection;
    protected _options: IOptions;

    protected _startBeforeUpdate(newOptions: IOptions): void {
        super._startBeforeUpdate(newOptions);
        if (this._options.minItemHeight !== newOptions.minItemHeight) {
            this._listViewModel.setMinItemHeight(newOptions.minItemHeight);
        }
        if (this._options.maxItemHeight !== newOptions.maxItemHeight) {
            this._listViewModel.setMaxItemHeight(newOptions.maxItemHeight);
        }
        if (this._options.minItemWidth !== newOptions.minItemWidth) {
            this._listViewModel.setMinItemWidth(newOptions.minItemWidth);
        }
        if (this._options.maxItemWidth !== newOptions.maxItemWidth) {
            this._listViewModel.setMaxItemWidth(newOptions.maxItemWidth);
        }
        if (this._options.availableHeight !== newOptions.availableHeight) {
            this._listViewModel.setAvailableHeight(newOptions.availableHeight);
        }
    }
    protected _afterMount(): void {
        super._afterMount();

        // Из-за марджинов триггер без отступа может быть не виден. Поэтому надо пересчитать.
        this._indicatorsController.recountIndicators('down');
    }
    protected _getListVirtualScrollControllerOptions(
        options: IOptions
    ): IAbstractListVirtualScrollControllerOptions {
        const controllerOptions = super._getListVirtualScrollControllerOptions(options);
        controllerOptions.triggersQuerySelector = HORIZONTAL_LOADING_TRIGGER_SELECTOR;
        controllerOptions.doScrollUtil = (position) => {
            this._notify('doHorizontalScroll', [position, true], {
                bubbling: true,
            });
            return false;
        };
        controllerOptions.scrollToElementUtil = (container, position, force): Promise<void> => {
            let convertedPosition = '';
            if (position === 'top') {
                convertedPosition = 'left';
            } else if (position === 'bottom') {
                convertedPosition = 'right';
            }
            return this._notify(
                'horizontalScrollToElement',
                [
                    {
                        itemContainer: container,
                        convertedPosition,
                        force,
                        onlyFirstScrollableParent: true,
                    },
                ],
                { bubbling: true }
            ) as Promise<void>;
        };
        return controllerOptions;
    }

    _observeScrollHandler(
        _: SyntheticEvent<Event>,
        eventName: string,
        params: IScrollParams
    ): void {
        switch (eventName) {
            case 'horizontalScrollMoveSync':
                this._listVirtualScrollController.scrollPositionChange(params.scrollLeft);
                this._scrollLeft = params.scrollLeft;
                break;
            case 'viewportResize':
                // размеры вью порта нужно знать всегда, независимо от navigation,
                // т.к. по ним рисуется глобальная ромашка
                this._viewportResizeHandler(params);
                break;
            default:
                super._observeScrollHandler.apply(this, arguments);
        }
    }

    // TODO: Надо выправлять, не должно быть такого. Должно быть что то вроде стратегии.
    protected _viewportResizeHandler(params: IScrollParams): void {
        this._viewportHeight = params.clientWidth;
        this._scrollLeft = params.scrollLeft;
        this._listVirtualScrollController.viewportResized(params.clientWidth);
    }
}
