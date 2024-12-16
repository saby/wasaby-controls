/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_lookup/SelectedCollection/SelectedCollection');
import { default as ItemTemplate } from 'Controls/_lookup/SelectedCollection/ItemTemplate';
import { EventUtils } from 'UI/Events';
import selectedCollectionUtils = require('Controls/_lookup/SelectedCollection/Utils');
import { default as CounterTemplate } from './SelectedCollection/CounterTemplate';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { StickyOpener } from 'Controls/popup';
import { ILookupOptions } from 'Controls/_lookup/Lookup';
import 'css!Controls/lookup';

const JS_CLASS_CAPTION_ITEM = '.js-controls-SelectedCollection__item__caption';
const JS_CLASS_CROSS_ITEM = '.js-controls-SelectedCollection__item__cross';

export interface ISelectedCollectionOptions extends IControlOptions, ILookupOptions {
    displayProperty: string;
    items: RecordSet;
    itemsCount?: number;
    maxVisibleItems: number;
    itemTemplate: TemplateFunction;
    counterAlignment: string;
}

interface ISelectedCollectionChildren {
    infoBoxLink: HTMLElement;
}

interface IOpenInfoBoxResult {
    templateOptions: Partial<ISelectedCollectionOptions>;
}
/**
 * Контрол, отображающий коллекцию элементов.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_lookup.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 *
 * @public
 */
/*
 * Control, that display collection of items.
 *
 * @class Controls/_lookup/SelectedCollection
 * @extends UI/Base:Control
 *
 * @author Герасимов А.М.
 */
class SelectedCollection extends Control<ISelectedCollectionOptions, number> {
    protected _template: TemplateFunction = template;
    protected _visibleItems: Model[] = null;
    protected _notifyHandler: (event: SyntheticEvent, eventName: string) => void =
        EventUtils.tmplNotify;
    protected _getItemMaxWidth: Function = selectedCollectionUtils.getItemMaxWidth;
    protected _getItemOrder: Function = selectedCollectionUtils.getItemOrder;
    protected _getItemGridStyles: Function = selectedCollectionUtils.getItemGridStyles;
    protected _counterWidth: number = 0;
    protected _counterTemplate: TemplateFunction = CounterTemplate;
    protected _children: ISelectedCollectionChildren;
    protected _stickyOpener: StickyOpener = null;
    protected _needShowCounter: boolean = false;
    protected _currentCounterTopPosition = null;

    protected _beforeMount(options: ISelectedCollectionOptions): void {
        this._clickCallbackPopup = this._clickCallbackPopup.bind(this);
        this._itemClick = this._itemClick.bind(this);
        this._openInfoBox = this._openInfoBox.bind(this);
        this._visibleItems = selectedCollectionUtils.getVisibleItems(options);
        this._counterWidth = options._counterWidth || 0;
        const itemsCount: number = options.itemsCount || options.items.getCount();
        this._needShowCounter = this._isShowCounter(
            itemsCount,
            options.multiLine,
            options.maxVisibleItems
        );
    }

    protected _beforeUpdate(newOptions: ISelectedCollectionOptions): void {
        const currentItemsCount = this._options.items.getCount();
        const itemsCount = newOptions.itemsCount || newOptions.items.getCount();
        const currentVisibleItemsCount = this._visibleItems.length;
        this._visibleItems = selectedCollectionUtils.getVisibleItems(newOptions);

        if (
            itemsCount !== currentItemsCount ||
            currentVisibleItemsCount !== this._visibleItems.length ||
            this._options.multiLine !== newOptions.multiLine ||
            this._options.maxVisibleItems !== newOptions.maxVisibleItems
        ) {
            this._needShowCounter = this._isShowCounter(
                itemsCount,
                newOptions.multiLine,
                newOptions.maxVisibleItems
            );
        }
        if (this._needShowCounter) {
            this._counterWidth =
                newOptions._counterWidth || this._getCounterWidth(itemsCount, newOptions);
        } else {
            this._closeInfobox();
        }
    }

    protected _afterMount(): void {
        const itemsCount: number = this._options.itemsCount || this._options.items.getCount();
        if (this._needShowCounter && !this._counterWidth) {
            this._counterWidth =
                this._counterWidth || this._getCounterWidth(itemsCount, this._options);
            if (this._counterWidth) {
                this._forceUpdate();
            }
        }
    }

    protected _afterUpdate(oldOptions?: ISelectedCollectionOptions) {
        if (this._needToObserveCounterPosition() && this._getStickyOpener().isOpened()) {
            const counterTopPosition = this._getCounterTopPosition();

            if (counterTopPosition !== this._currentCounterTopPosition) {
                this._closeInfobox();
                this._currentCounterTopPosition = null;
            }
        }
    }

    protected _beforeUnmount(): void {
        this._closeInfobox();
    }

    protected _itemClick(event: SyntheticEvent, item: Model): void {
        let eventName: string;

        if (event.target.closest(JS_CLASS_CAPTION_ITEM)) {
            eventName = 'itemClick';
        } else if (event.target.closest(JS_CLASS_CROSS_ITEM)) {
            eventName = 'crossClick';
        }

        if (eventName) {
            event.stopPropagation();
            this._notify(eventName, [item, event.nativeEvent]);
        }
    }

    private _needToObserveCounterPosition(): boolean {
        return !this._options.multiLine && this._needShowCounter;
    }

    private _getCounterTopPosition(): number {
        return this._container
            .getElementsByClassName('controls-SelectedCollection__counterItems')[0]
            .getBoundingClientRect().top;
    }

    protected _clickCallbackPopup(eventType: string, item: Model): void {
        if (eventType === 'crossClick') {
            this._notify('crossClick', [item]);
        } else if (eventType === 'itemClick') {
            this._notify('itemClick', [item]);
        }
    }

    protected _openInfoBox(infoBox: HTMLElement): void {
        const result =
            (this._notify('openInfoBox', []) as Promise<void | IOpenInfoBoxResult>) ||
            Promise.resolve();
        result.then((popupOptions: IOpenInfoBoxResult) => {
            const config = {
                target: infoBox,
                opener: this,
                closeOnOutsideClick: true,
                actionOnScroll: 'close',
                template: 'Controls/lookupPopup:Collection',
                width: 'auto',
                allowAdaptive: false,
                direction: {
                    vertical: 'bottom',
                    horizontal: this._options.counterAlignment === 'right' ? 'left' : 'right',
                },
                targetPoint: {
                    vertical: 'bottom',
                    horizontal: this._options.counterAlignment,
                },
                templateOptions: {
                    items: popupOptions?.templateOptions?.items || this._options.items,
                    readOnly: this._options.readOnly,
                    displayProperty: this._options.displayProperty,
                    itemTemplate: this._options.itemTemplate,
                    clickCallback: this._clickCallbackPopup,
                },
                eventHandlers: {
                    onClose: () => {
                        if (!this._destroyed) {
                            this._notify('closeInfoBox', []);
                        }
                    },
                },
            };
            if (this._needToObserveCounterPosition()) {
                this._currentCounterTopPosition = this._getCounterTopPosition();
            }
            this._getStickyOpener().open(config);
        });
    }

    private _getStickyOpener(): StickyOpener {
        if (!this._stickyOpener) {
            this._stickyOpener = new StickyOpener();
        }
        return this._stickyOpener;
    }

    private _getCounterWidth(
        itemsCount: number,
        { readOnly, itemsLayout, fontSize, counterAlignment }: ISelectedCollectionOptions
    ): number {
        // in mode read only and single line, counter does not affect the collection
        if (readOnly && itemsLayout === 'oneRow') {
            return 0;
        }

        return selectedCollectionUtils.getCounterWidth(
            itemsCount,
            this._options.theme,
            fontSize,
            counterAlignment
        );
    }

    private _isShowCounter(
        itemsCount: number,
        multiline: boolean,
        maxVisibleItems?: number
    ): boolean {
        return multiline ? itemsCount > maxVisibleItems : itemsCount > 1;
    }

    private _closeInfobox(): void {
        const stickyOpener = this._getStickyOpener();
        if (stickyOpener.isOpened()) {
            this._notify('closeInfoBox');
            stickyOpener.close();
        }
    }

    static getDefaultOptions(): Object {
        return {
            itemTemplate: ItemTemplate,
            itemsLayout: 'default',
            backgroundStyle: 'default',
            counterAlignment: 'left',
        };
    }
}

export default SelectedCollection;
