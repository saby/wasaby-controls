/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Sticky/Template/Sticky';
import { default as IPopupTemplateBase } from 'Controls/_popupTemplate/interface/IPopupTemplateBase';
import { IPopupTemplateOptions } from 'Controls/_popupTemplate/interface/IPopupTemplate';
import {
    IBackgroundStyle,
    IBackgroundStyleOptions,
    IBorderRadiusOptions,
} from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IDragObject } from 'Controls/dragnDrop';
import 'css!Controls/popupTemplate';
import { getRoundClass } from 'Controls/_popupTemplate/Util/PopupConfigUtil';
import { IResizeOptions } from '../../interface/IResize';
import {
    DEFAULT_MIN_OFFSET_HEIGHT,
    DEFAULT_MIN_OFFSET_WIDTH,
} from 'Controls/_popupTemplate/Util/PopupConstants';
import type { IStickyPopupPosition } from 'Controls/popup';
import { getAdaptiveDesktopMode } from 'Controls/popup';
import { getConfig } from 'Application/Env';

enum POSITION {
    RIGHT = 'right',
    LEFT = 'left',
    DEFAULT = 'default',
}

export interface IStickyTemplateOptions
    extends IControlOptions,
        IPopupTemplateOptions,
        IBackgroundStyleOptions,
        IBorderRadiusOptions,
        IResizeOptions {
    allowAdaptive?: boolean;
    shadowVisible?: boolean;
    stickyPosition?: IStickyPopupPosition;
    borderStyle?: string;
    borderSize?: string;
    roundBorder?: boolean;
    borderVisible: boolean;
    headingTextTransform?: string;
    headingFontWeight?: string;
}

/**
 * Базовый шаблон для {@link /doc/platform/developmentapl/interface-development/controls/openers/sticky/ прилипающих блоков}.
 * Имеет три контентные опции - для шапки, контента и подвала, а так же крестик закрытия, соответствующие стандарту выпадающих списков.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/sticky/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @class Controls/_popupTemplate/Sticky
 * @extends UI/Base:Control
 *
 * @public
 * @implements Controls/popupTemplate:IPopupTemplateBase
 * @implements Controls/popupTemplate:IPopupTemplate
 * @implements Controls/popupTemplate:IResizing
 * @implements Controls/interface:IBorderRadius
 * @demo Controls-demo/PopupTemplate/Sticky/FooterContentTemplate/Index
 * @demo Controls-demo/PopupTemplate/Sticky/CloseButtonVisible/Index
 * @demo Controls-demo/PopupTemplate/Sticky/HeaderContentTemplate/Index
 */

class StickyTemplate
    extends Control<IStickyTemplateOptions>
    implements IPopupTemplateBase, IBackgroundStyle
{
    readonly '[Controls/_popupTemplate/interface/IPopupTemplateBase]': boolean;
    readonly '[Controls/_interface/IBackgroundStyle]': boolean;

    protected _template: TemplateFunction = template;
    protected _closeBtnPosition: POSITION = POSITION.DEFAULT;
    protected _dragging: boolean = false;
    protected _maxWidthOffset: number;
    protected _minWidthOffset: number;
    protected _maxHeightOffset: number;
    protected _minHeightOffset: number;
    protected _slidingPanelOptions: {} = {
        position: 'bottom',
        desktopMode: 'dialog',
    };
    protected _isAdaptive: boolean = getConfig('isAdaptive');

    protected _beforeMount(options: IStickyTemplateOptions): void {
        this._isAdaptive =
            getConfig('isAdaptive') && options.allowAdaptive !== false;
        if (options.adaptiveOptions?.viewMode) {
            const desktopMode = getAdaptiveDesktopMode(
                options.adaptiveOptions?.viewMode,
                'stack'
            );
            this._slidingPanelOptions.desktopMode = desktopMode;
        }
        this._updateOffset(options);
        if (options.closeButtonViewMode === 'external') {
            this._closeBtnPosition = POSITION.RIGHT;
        }
    }

    protected _beforeUpdate(options: IStickyTemplateOptions): void {
        this._updateOffset(options);
        if (
            options.stickyPosition &&
            options.stickyPosition.direction &&
            this._options.stickyPosition.direction !==
                options.stickyPosition.direction
        ) {
            this._verticalDirection = options.stickyPosition.direction.vertical;
        }
    }

    protected _getRoundedClass(
        options: IStickyTemplateOptions,
        type: string
    ): string {
        return getRoundClass({
            options,
            type,
            hasRoundedBorder: options.roundBorder,
        });
    }

    protected _getCloseButtonWidth(): number {
        if (this._children.hasOwnProperty('closeButton')) {
            return this._children.closeButton._container?.offsetWidth;
        }
        return 0;
    }

    protected _onDragEnd(): void {
        this._notify('popupDragEnd', [], { bubbling: true });
    }

    protected _onDragMove(
        event: SyntheticEvent<Event>,
        dragObject: IDragObject
    ): void {
        this._dragging = true;
        this._notify('popupDragStart', [dragObject.offset], { bubbling: true });
    }

    protected _onMouseDown(event: SyntheticEvent<MouseEvent>): void {
        if (this._needStartDrag(event)) {
            this._startDragNDrop(event);
        }
    }

    protected _click(): void {
        this._dragging = false;
    }

    protected _mouseOut(): void {
        this._dragging = false;
    }

    private _needStartDrag(event: SyntheticEvent<MouseEvent>): boolean {
        const { target } = event;
        const isEventProcessed = event.nativeEvent.processed;
        return (
            this._options.draggable &&
            (target as HTMLElement).tagName !== 'INPUT' &&
            !isEventProcessed
        );
    }

    private _startDragNDrop(event: SyntheticEvent<Event>): void {
        this._children.dragNDrop.startDragNDrop(null, event);
    }

    private getWindowInnerWidth(): number {
        return window?.innerWidth;
    }

    protected close(): void {
        this._notify('close', [], { bubbling: true });
    }

    protected _proxyEvent(event: Event, eventName: string): void {
        this._notify(eventName, [event]);
    }

    protected _getBackgroundColor(): string {
        return this._options.backgroundStyle === 'default'
            ? 'controls-StickyTemplate-backgroundColor'
            : 'controls-background-' + this._options.backgroundStyle;
    }

    protected _onResizingOffset(
        event: Event,
        offset: object,
        position: string
    ): void {
        this._notify('popupMovingSize', [offset, position], { bubbling: true });
    }

    private _updateOffset(options: IStickyTemplateOptions): void {
        if (options.stickyPosition) {
            this._maxWidthOffset = Math.max(
                (options.stickyPosition.position?.maxWidth ||
                    DEFAULT_MIN_OFFSET_WIDTH) -
                    (options.stickyPosition.sizes?.width ||
                        DEFAULT_MIN_OFFSET_WIDTH),
                0
            );
            this._minWidthOffset = Math.max(
                (options.stickyPosition.sizes?.width ||
                    DEFAULT_MIN_OFFSET_WIDTH) -
                    (options.stickyPosition.position?.minWidth ||
                        DEFAULT_MIN_OFFSET_WIDTH),
                0
            );
            this._maxHeightOffset = Math.max(
                (options.stickyPosition.position?.maxHeight ||
                    DEFAULT_MIN_OFFSET_HEIGHT) -
                    (options.stickyPosition.sizes?.height ||
                        DEFAULT_MIN_OFFSET_HEIGHT),
                0
            );
            this._minHeightOffset = Math.max(
                (options.stickyPosition.sizes?.height ||
                    DEFAULT_MIN_OFFSET_HEIGHT) -
                    (options.stickyPosition.position?.minHeight ||
                        DEFAULT_MIN_OFFSET_HEIGHT),
                0
            );
        }
    }

    static getDefaultOptions(): IStickyTemplateOptions {
        return {
            headingFontSize: 'l',
            headingFontColorStyle: 'secondary',
            closeButtonVisible: true,
            shadowVisible: false,
            backgroundStyle: 'default',
            headerBackgroundStyle: 'default',
            closeButtonViewMode: 'link',
            borderStyle: 'default',
            borderSize: 'default',
            roundBorder: true,
            borderRadius: 's',
            borderVisible: true,
            resizable: false,
            resizingOptions: {
                step: 1,
                position: 'right-bottom',
            },
        };
    }
}

/**
 * @name Controls/_popupTemplate/Sticky#draggable
 * @cfg {Boolean} Определяет, может ли окно перемещаться с помощью {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ d'n'd}.
 * @default false
 */

/**
 * @name Controls/_popupTemplate/Sticky#shadowVisible
 * @cfg {Boolean} Определяет, будет ли отображаться тень у прилипающего блока
 * @default false
 */

/**
 * @name Controls/_popupTemplate/Sticky#headingFontColorStyle
 * @cfg {String}
 * @demo Controls-demo/PopupTemplate/Sticky/HeaderCaption/Index
 */

/**
 * @name Controls/_popupTemplate/Sticky#headingFontSize
 * @cfg {String}
 * @demo Controls-demo/PopupTemplate/Sticky/HeaderCaption/Index
 */

/**
 * @name Controls/_popupTemplate/Sticky#roundBorder
 * @cfg {Boolean} Определяет будут ли скруглены углы окна.
 * @default true
 */

/**
 * @name Controls/_popupTemplate/Sticky#backgroundStyle
 * @cfg {String} Цвет фона окна.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant info
 * @variant success
 * @default default
 * @demo Controls-demo/PopupTemplate/Sticky/backgroundStyle/Index
 */

/**
 * @name Controls/_popupTemplate/Sticky#headerBackgroundStyle
 * @cfg {String} Цвет фона шапки.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant info
 * @variant success
 * @default default
 * @demo Controls-demo/PopupTemplate/Sticky/backgroundStyle/Index
 */

/**
 * @name Controls/_popupTemplate/Sticky#headingFontWeight
 * @cfg {TFontWeight} Насыщенность шрифта заголовка.
 * @default default
 */

/**
 * @name Controls/_popupTemplate/Sticky#headingTextTransform
 * @cfg {Controls/interface:ITextTransform/TTextTransform.typedef} Управляет преобразованием заголовка элемента в заглавные или прописные символы
 * @default none
 */

/**
 * @name Controls/_popupTemplate/Sticky#borderVisible
 * @cfg {Boolean} Определяет видимость бордера
 */
export default StickyTemplate;
