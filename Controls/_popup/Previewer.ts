/**
 * @kaizen_zone 69fe1fdb-6718-4f49-a543-3ddd8385ec17
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popup/Previewer/Previewer';
import { IPreviewerPopupOptions } from 'Controls/_popup/interface/IPreviewerOpener';
import { IPreviewer, IPreviewerOptions } from 'Controls/_popup/interface/IPreviewer';
import { debounce } from 'Types/function';
import { SyntheticEvent } from 'Vdom/Vdom';
import PreviewerOpener from './Opener/Previewer';
import { CalmTimer } from 'Controls/_popup/utils/FastOpen';
import { UnregisterUtil, RegisterUtil } from 'Controls/event';
import { detection } from 'Env/Env';
import { TouchDetect } from 'EnvTouch/EnvTouch';

const CALM_DELAY: number = 300; // During what time should not move the mouse to start opening the popup.
/**
 * Контрол, отображающий всплывающее окно - превьювер, относительно указанного элемента. Открытие превьювера вызывает событие, указанное в опции trigger. В один момент времени на странице может отображаться только один превьювер.
 * @class Controls/_popup/Previewer
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 *
 * @mixes Controls/popup:IPreviewer
 * @public
 */
class PreviewerTarget extends Control<IPreviewerOptions> implements IPreviewer {
    readonly '[Controls/_popup/interface/IPreviewer]': boolean;

    _template: TemplateFunction = template;
    _previewerId: IPreviewerPopupOptions;
    _calmTimer: CalmTimer;
    _isOpened: boolean = false;
    private _wasMouseEnter: boolean;
    private _stopPreviewer: boolean = false;

    protected _beforeMount(options: IPreviewerOptions): void {
        this._resultHandler = this._resultHandler.bind(this);
        this._closeHandler = this._closeHandler.bind(this);
        this._openHandler = this._openHandler.bind(this);
        this._debouncedAction = debounce(this._debouncedAction, 10);
        this._calmTimer = new CalmTimer((delay, event) => {
            if (!this._isPopupOpened()) {
                this._debouncedAction('_open', [event]);
            }
        });
    }

    protected _afterMount(options?: IPreviewerOptions): void {
        RegisterUtil(this, 'customscroll', this._scrollHandler.bind(this), {
            listenAll: true,
        });
    }

    protected _beforeUnmount(): void {
        UnregisterUtil(this, 'customscroll', {listenAll: true});
        this._calmTimer.stop();
        if (this._isPopupOpened()) {
            this.close();
        }
    }

    /**
     * @param type
     * @variant hover
     * @variant click
     */
    open(type: string): Promise<void> {
        if (!this._isPopupOpened()) {
            const newConfig: IPreviewerPopupOptions = this._getConfig();
            this._isOpened = true;
            return PreviewerOpener.openPopup(newConfig, type).then((id: IPreviewerPopupOptions) => {
                this._previewerId = id;
            });
        }
    }

    /**
     * @param type
     * @variant hover
     * @variant click
     */
    close(type: string = 'click'): void {
        PreviewerOpener.closePopup(this._previewerId, type);

        // Если в режиме по ховеру отменили открытие, то повторное открытие будет только после того,
        // как пользователь уведет курсор с таргета и наведен заново. Иначе по mousemove окно все равно откроется.
        if (this._options.trigger === 'hover') {
            if (!this._isOpened) {
                this._wasMouseEnter = false;
                this._calmTimer.stop();
            }
        }
    }

    private _getConfig(): IPreviewerPopupOptions {
        const opener = typeof this._options.opener === 'undefined' ? this : this._options.opener;
        const config: IPreviewerPopupOptions = {
            fittingMode: {
                vertical: 'adaptive',
                horizontal: 'overflow',
            },
            autofocus: false,
            // При закрытии превьювера, опенер заберет фокус на себя, не везде нужна подобная логика
            opener,
            target: this._container,
            template: 'Controls/popup:PreviewerTemplate',
            // При открытии превьюера не должен блокироваться интерфейс индикатором загрузки.
            showIndicator: false,
            targetPoint: {
                vertical: 'bottom',
                horizontal: 'right',
            },
            isCompoundTemplate: this._options.isCompoundTemplate,
            eventHandlers: {
                onOpen: this._openHandler,
                onResult: this._resultHandler,
                onClose: this._closeHandler,
            },
            templateOptions: {
                template: this._options.template,
                templateOptions: this._options.templateOptions,
            },
        };

        if (this._options.targetPoint) {
            config.targetPoint = this._options.targetPoint;
        }
        if (this._options.width) {
            config.width = this._options.width;
        }
        if (this._options.height) {
            config.height = this._options.height;
        }
        if (this._options.direction) {
            config.direction = this._options.direction;
        }
        if (this._options.offset) {
            config.offset = this._options.offset;
        }
        if (this._options.delay) {
            config.delay = this._options.delay;
        }
        return config;
    }

    protected _open(event: SyntheticEvent<MouseEvent>): void {
        const type: string = this._getType(event.type);
        this.open(type);
    }

    private _close(event: SyntheticEvent<MouseEvent>): void {
        const type: string = this._getType(event.type);
        this.close(type);
    }

    private _isPopupOpened(): boolean {
        return PreviewerOpener.isOpenedPopup(this._previewerId);
    }

    private _getType(eventType: string): string {
        if (eventType === 'mousemove' || eventType === 'mouseleave') {
            return 'hover';
        }
        return 'click';
    }

    // Pointer action on hover with content and popup are executed sequentially.
    // Collect in package and process the latest challenge
    private _debouncedAction(method: string, args: any): void {
        this[method].apply(this, args);
    }

    private _cancel(event: SyntheticEvent<MouseEvent>, action: string): void {
        PreviewerOpener.cancelPopup(this._previewerId, action);
    }

    protected _scrollHandler(event: SyntheticEvent<MouseEvent>): void {
        if (this._isOpened) {
            if (this._options.actionOnScroll === 'close') {
                this._close(event);
            }
        }
    }

    protected _contentMouseenterHandler(event: SyntheticEvent<MouseEvent>): void {
        this._wasMouseEnter = true;
        if (this._options.trigger === 'hover' || this._options.trigger === 'hoverAndClick') {
            // We will cancel closing of the popup, if it is already open
            if (this._isOpened) {
                this._cancel(event, 'closing');
            }
        }
    }

    protected _contentMouseleaveHandler(event: SyntheticEvent<MouseEvent>): void {
        if (
            !this._options.readOnly &&
            (this._options.trigger === 'hover' || this._options.trigger === 'hoverAndClick')
        ) {
            this._calmTimer.stop();
            if (this._isPopupOpened()) {
                this._debouncedAction('_close', [event]);
            } else {
                this._cancel(event, 'opening');
            }
        }
    }

    protected _contentMousemoveHandler(event: SyntheticEvent<MouseEvent>): void {
        // На ios устройствах при клике почему-то стреляет событие mousemove, которого по идее быть не должно
        if (
            !this._stopPreviewer &&
            !this._options.readOnly &&
            (this._options.trigger === 'hover' || this._options.trigger === 'hoverAndClick') &&
            !(detection.isMobileSafari && TouchDetect.getInstance().isTouch())
        ) {
            // Устанавливаем старое значение таймера, так при небольших значениях,
            // окно может открыться когда этого не нужно
            // https://online.sbis.ru/opendoc.html?guid=55ca4037-ae40-44f4-a10f-ac93ddf990b1
            if (this._wasMouseEnter) {
                this._calmTimer.start(this._options.task1187231972, event);
            }
        }
    }

    protected _contentMouseDownHandler(event: SyntheticEvent<MouseEvent>): void {
        if (this._options.stopPreviewerOnClick) {
            this._stopPreviewer = true;
            this._calmTimer.stop();
            setTimeout(() => {
                this._stopPreviewer = false;
            }, 1000);
        }
        const isLeftMouseButton = event.nativeEvent.which === 1;
        if (
            !this._options.readOnly &&
            (this._options.trigger === 'click' || this._options.trigger === 'hoverAndClick') &&
            isLeftMouseButton
        ) {
            /*
             * When trigger is set to 'hover', preview shouldn't be shown when user clicks on content.
             */
            if (!this._isPopupOpened()) {
                this._debouncedAction('_open', [event]);
            }
            event.preventDefault();
            event.stopPropagation();
            // preventDefault stopped the focus => active elements don't deactivated.
            // activate control manually
            this.activate();
        }
    }

    protected _contentClickHandler(event: SyntheticEvent<MouseEvent>): void {
        // Stopping mousedown event doesn't stop click event
        if (this._options.trigger === 'click' || this._options.trigger === 'hoverAndClick') {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private _resultHandler(event: SyntheticEvent<MouseEvent>): void {
        switch (event.type) {
            case 'mouseenter':
                this._debouncedAction('_cancel', [event, 'closing']);
                break;
            case 'mouseleave':
                const isHoverType =
                    this._options.trigger === 'hover' || this._options.trigger === 'hoverAndClick';
                if (isHoverType) {
                    this._debouncedAction('_close', [event]);
                }
                break;
        }
    }

    private _closeHandler(): void {
        this._isOpened = false;
        this._notify('close', []);
    }

    private _openHandler(): void {
        this._notify('open', []);
    }

    static getDefaultOptions(): IPreviewerOptions {
        return {
            trigger: 'hoverAndClick',
            actionOnScroll: 'close',
            task1187231972: CALM_DELAY,
        };
    }
}

export default PreviewerTarget;
