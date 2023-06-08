/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import {
    AbstractListVirtualScrollController,
    IAbstractObserversControllerConstructor,
    IAbstractItemsSizesControllerConstructor,
    IAbstractListVirtualScrollControllerOptions,
    IDirectionNew as IDirection,
} from 'Controls/baseList';

import type { TItemKey } from 'Controls/display';

import { executeSyncOrAsync } from 'UICommon/Deps';
import { getScrollLeftToEdgeElement } from 'Controls/_baseTile/utils/scrollUtils';

// TODO: не должно быть так много контроллеров скролла. Нужно свести контроллеры скролла для грида, канбана и плитки
// https://online.sbis.ru/opendoc.html?guid=35e0dafc-7ef5-4687-b551-e795de4cea72

export default class HorizontalTileScrollController extends AbstractListVirtualScrollController {
    private _listContainer: HTMLElement;
    private _triggerSelector: string;
    private _itemsSizeControllerModule: IAbstractItemsSizesControllerConstructor;
    private _observersControllerModule: IAbstractObserversControllerConstructor;

    constructor(options: IAbstractListVirtualScrollControllerOptions) {
        executeSyncOrAsync(
            ['Controls/horizontalScroll'],
            (horizontalScroll) => {
                this._triggerSelector =
                    horizontalScroll.HORIZONTAL_LOADING_TRIGGER_SELECTOR;
                this._itemsSizeControllerModule =
                    horizontalScroll.ItemsSizeController;
                this._observersControllerModule =
                    horizontalScroll.ObserversController;
            }
        );
        super({
            ...options,
            triggersOffsetMode: 'translate',
            triggersQuerySelector: this._triggerSelector,
            scrollToElementUtil: (
                container: HTMLElement,
                position: string,
                force: boolean
            ): Promise<void> | void => {
                // Из абстрактного контроллера прилетает не универсальная позиция before/after, а top/bottom.
                // Утилита из библиотеки Controls/scroll для горизонтального скроллирования такого не понимает.
                // https://online.sbis.ru/opendoc.html?guid=446ff727-5c70-4a47-be83-c6eec6cf4593
                let convertedPosition = position;
                if (position === 'top') {
                    convertedPosition = 'left';
                } else if (position === 'bottom') {
                    convertedPosition = 'right';
                }
                if (options.scrollToElementUtil) {
                    options.scrollToElementUtil(
                        container,
                        convertedPosition,
                        force
                    );
                }
            },
        });
    }

    // TODO: убрать после https://online.sbis.ru/opendoc.html?guid=4ceef343-abd3-4cba-9a90-a55c387195f2&client=3
    // отсюда
    setListContainer(listContainer: HTMLElement): void {
        super.setListContainer(listContainer);
        this._listContainer = listContainer;
    }

    protected _handleScheduledScroll(): void {
        if (this._scheduledScrollParams?.type === 'restoreScroll') {
            this._scheduledScrollParams = null;
        }
        super._handleScheduledScroll();
    }
    // досюда

    scrollToPage(direction: IDirection): Promise<TItemKey> {
        const scrollLeft = getScrollLeftToEdgeElement(
            this._listContainer,
            direction
        );
        if (scrollLeft !== null) {
            this._doScrollUtil(scrollLeft);
        }
        return Promise.resolve(null);
    }

    protected _getObserversControllerConstructor(): IAbstractObserversControllerConstructor {
        return this._observersControllerModule;
    }

    protected _getItemsSizeControllerConstructor(): IAbstractItemsSizesControllerConstructor {
        return this._itemsSizeControllerModule;
    }

    protected _applyIndexes(
        startIndex: number,
        endIndex: number,
        direction: IDirection
    ): void {
        this._collection?.setIndexes(startIndex, endIndex, direction);
    }

    protected _getIndexByKey<T extends TItemKey = TItemKey>(key: T): number {
        return this._collection ? this._collection.getIndexByKey(key) : -1;
    }

    protected _getCollectionItemsCount(): number {
        return this._collection ? this._collection.getCount() : 0;
    }
}
