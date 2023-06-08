/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { getRoundClass } from 'Controls/_popupTemplate/Util/PopupConfigUtil';
import {
    default as IPopupTemplate,
    IPopupTemplateOptions,
} from 'Controls/_popupTemplate/interface/IPopupTemplate';
import 'css!Controls/popupTemplate';
import { getAdaptiveDesktopMode } from 'Controls/popup';
import { IBorderRadiusOptions } from 'Controls/interface';
import { IResizeOptions } from '../../interface/IResize';
import {
    DEFAULT_MIN_OFFSET_HEIGHT,
    DEFAULT_MIN_OFFSET_WIDTH,
} from 'Controls/_popupTemplate/Util/PopupConstants';
import template = require('wml!Controls/_popupTemplate/Dialog/Template/Dialog');
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';

export interface IDialogTemplateOptions
    extends IControlOptions,
        IPopupTemplateOptions,
        IBorderRadiusOptions,
        IResizeOptions {
    draggable?: boolean;
    allowAdaptive?: boolean;
    headerBackgroundStyle?: string;
    headerBorderVisible?: boolean;
    headerSize?: 'm' | 'l';
    footerBorderVisible?: boolean;
    backgroundStyle?: string;
    dialogPosition: object;
    closeButtonSize?: 'm' | 'l';
}

interface IDragObject {
    offset: number;
}

/**
 * Базовый шаблон {@link /doc/platform/developmentapl/interface-development/controls/openers/dialog/#template диалогового окна}.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/dialog/#template руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 *
 * @public
 * @implements Controls/interface:IBorderRadius
 * @implements Controls/popupTemplate:IPopupTemplate
 * @implements Controls/popupTemplate:IPopupTemplateBase
 * @implements Controls/popupTemplate:IResize
 * @demo Controls-demo/PopupTemplate/Dialog/Index
 */

class DialogTemplate extends Control<IDialogTemplateOptions> implements IPopupTemplate {
    '[Controls/_popupTemplate/interface/IPopupTemplate]': boolean = true;
    protected _template: TemplateFunction = template;
    protected _dragState: string;
    protected _maxWidthOffset: number;
    protected _minWidthOffset: number;
    protected _maxHeightOffset: number;
    protected _minHeightOffset: number;
    protected _slidingPanelOptions: {} = {
        position: 'bottom',
        desktopMode: 'dialog',
    };
    protected _isAdaptive: boolean;

    protected _beforeMount(options: IDialogTemplateOptions): void {
        this._isAdaptive =
            unsafe_getRootAdaptiveMode().device.isPhone() && options.allowAdaptive !== false;
        if (options.adaptiveOptions?.viewMode) {
            const desktopMode = getAdaptiveDesktopMode(options.adaptiveOptions?.viewMode, 'stack');
            this._slidingPanelOptions.desktopMode = desktopMode;
        }
        this._updateOffset(options);
        this._setDragStateByOptions(options);
    }

    protected _onResizingOffset(event: Event, offset: object, position: string): void {
        this._notify('popupMovingSize', [offset, position], { bubbling: true });
    }

    protected _beforeUpdate(options: IDialogTemplateOptions): void {
        this._updateOffset(options);
        if (options.draggable !== this._options.draggable) {
            this._setDragStateByOptions(options);
        }
    }

    protected _getRoundedClass(options: IDialogTemplateOptions, type: string): string {
        return getRoundClass({
            options,
            type,
            hasRoundedBorder: !options.maximize,
        });
    }

    protected _onDragEnd(): void {
        this._setDragStateByOptions(this._options);
        this._notify('popupDragEnd', [], { bubbling: true });
    }

    protected _onDragMove(event: SyntheticEvent<Event>, dragObject: IDragObject): void {
        this._dragState = 'dragging';
        this._notify('popupDragStart', [dragObject.offset], { bubbling: true });
    }

    /**
     * Закрыть диалоговое окно
     * @function Controls/_popupTemplate/Dialog/Template/DialogTemplate#close
     */
    protected close(): void {
        this._notify('close', [], { bubbling: true });
    }

    private _setDragStateByOptions(options: IDialogTemplateOptions): void {
        this._dragState = options.draggable ? 'draggable' : 'not-draggable';
    }

    protected _onMouseDown(event: SyntheticEvent<MouseEvent>): void {
        if (this._needStartDrag(event)) {
            this._dragState = 'drag-start';
            this._startDragNDrop(event);
        }
    }

    protected _onMouseUp(): void {
        this._setDragStateByOptions(this._options);
    }

    protected _getBackgroundColor(): string {
        return !this._options.backgroundStyle
            ? 'controls-DialogTemplate_backgroundStyle-default'
            : 'controls-background-' + this._options.backgroundStyle;
    }

    private _needStartDrag(event: SyntheticEvent<MouseEvent>): boolean {
        const { target } = event;
        const isEventProcessed = event.nativeEvent.processed;
        return (
            this._options.draggable &&
            (target as HTMLElement).tagName !== 'INPUT' &&
            !(target as HTMLElement).closest('.controls-DialogTemplate__close_button') &&
            !isEventProcessed
        );
    }

    private _startDragNDrop(event: SyntheticEvent<Event>): void {
        this._children.dragNDrop.startDragNDrop({ shouldNotUpdateBodyClass: true }, event);
    }

    private _updateOffset(options: IDialogTemplateOptions): void {
        if (options.dialogPosition) {
            this._maxWidthOffset = Math.max(
                (options.dialogPosition.maxWidth || DEFAULT_MIN_OFFSET_WIDTH) -
                    (options.dialogPosition.width || DEFAULT_MIN_OFFSET_WIDTH),
                0
            );
            this._minWidthOffset = Math.max(
                (options.dialogPosition.width || DEFAULT_MIN_OFFSET_WIDTH) -
                    (options.dialogPosition.minWidth || DEFAULT_MIN_OFFSET_WIDTH),
                0
            );
            this._maxHeightOffset = Math.max(
                (options.dialogPosition.maxHeight || DEFAULT_MIN_OFFSET_HEIGHT) -
                    (options.dialogPosition.height || DEFAULT_MIN_OFFSET_HEIGHT),
                0
            );
            this._minHeightOffset = Math.max(
                (options.dialogPosition.height || DEFAULT_MIN_OFFSET_HEIGHT) -
                    (options.dialogPosition.minHeight || DEFAULT_MIN_OFFSET_HEIGHT),
                0
            );
        }
    }

    static getDefaultOptions(): IDialogTemplateOptions {
        return {
            headingFontColorStyle: 'default',
            headerBackgroundStyle: 'default',
            closeButtonSize: 'm',
            headerBorderVisible: false,
            headerSize: 'm',
            footerBorderVisible: true,
            headingFontSize: '3xl',
            closeButtonVisible: true,
            closeButtonViewMode: 'linkButton',
            borderRadius: 's',
            resizable: false,
            resizingOptions: {
                step: 1,
                position: 'right-bottom',
            },
        };
    }
}

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#close
 * @event Происходит при закрытии диалогового окна.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#draggable
 * @cfg {Boolean} Определяет, может ли окно перемещаться с помощью {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ d'n'd}.
 * @default false
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#headerSize
 * @cfg {string} Определяет минимальную высоту шапки.
 * @variant m
 * @variant l
 * @default m
 * @demo Controls-demo/PopupTemplate/Dialog/headerSize/Index
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#headerBorderVisible
 * @cfg {Boolean} Видимость границы шапки панели.
 * @default false
 * @demo Controls-demo/PopupTemplate/Dialog/headerBorderVisible/Index
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#footerBorderVisible
 * @cfg {Boolean} Видимость границы подвала панели.
 * @default true
 * @demo Controls-demo/PopupTemplate/Dialog/footerBorderVisible/Index
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#headerBackgroundStyle
 * @cfg {String} Цвет фона шапки диалогового окна.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant info
 * @variant success
 * @default undefined
 * @demo Controls-demo/PopupTemplate/Dialog/backgroundStyle/Index
 * @see backgroundStyle
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#backgroundStyle
 * @cfg {String} Цвет фона диалогового окна.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant info
 * @variant success
 * @default default
 * @demo Controls-demo/PopupTemplate/Dialog/backgroundStyle/Index
 * @see headerBackgroundStyle
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#maximize
 * @cfg {Boolean} Режим отображения окна во весь экран. Влияет на видимость границы и тени диалогового окна.
 * @see headerBorderVisible
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#borderRadius
 * @cfg {BorderRadius}
 * @default s
 * @demo Controls-demo/PopupTemplate/Dialog/borderRadius/Index
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#resizable
 * @cfg {boolean} Определяет возможность изменения размера окна
 * @default false
 * @demo Controls-demo/Popup/Dialog/Resizable/Index
 */

/**
 * @name Controls/_popupTemplate/Dialog/Template/DialogTemplate#closeButtonSize
 * @cfg {String} Определяет размер кнопки закрытия
 * @variant m
 * @variant l
 * @default m
 */

export default DialogTemplate;
