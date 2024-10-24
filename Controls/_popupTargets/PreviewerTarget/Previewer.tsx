import { cloneElement, Component, RefObject, createRef, ReactElement } from 'react';
import { IPreviewer, IPreviewerOptions, PreviewerOpener, Opener, Controller } from 'Controls/popup';
import { CalmTimer } from 'Controls/popup';
import { SyntheticEvent } from 'Vdom/Vdom';
import { __notifyFromReact } from 'UI/Events';
import { detection } from 'Env/Env';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { activate } from 'UI/Focus';
import { debounce } from 'Types/function';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';

const CALM_DELAY: number = 300; // During what time should not move the mouse to start opening the popup.

let counter = 0;
/**
 * Контрол, отображающий всплывающее окно - превьювер, относительно указанного элемента. Открытие превьювера вызывает событие, указанное в опции trigger. В один момент времени на странице может отображаться только один превьювер.
 * @class Controls/_popup/Previewer
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @demo Controls-demo/Previewer/Previewer
 * @mixes Controls/popup:IPreviewer
 * @public
 */
export default class Previewer extends Component<IPreviewerOptions> {
    private _calmTimer: CalmTimer;
    private _wasMouseEnter: boolean;

    private _previewerItem: IPreviewerOptions;
    private _isOpened: boolean;
    private _closeOnMouseLeave: boolean;
    private _stopPreviewer: boolean;
    private _ref: RefObject<HTMLElement> = createRef();
    private _instanceId: string = 'previewerReactId-' + counter++;

    private _openerRef: RefObject<Opener> = createRef();

    constructor(props: IPreviewerOptions) {
        super(props);
        this._debouncedAction = debounce(this._debouncedAction, 10);
        this._calmTimer = new CalmTimer((delay, event) => {
            if (!this._isPopupOpened()) {
                this._debouncedAction('_open', [event]);
            }
        });
        this._closeOnMouseLeave = this._isHoverType(props);
    }

    getInstanceId() {
        return this._instanceId;
    }

    protected _notify(eventName: string, args: unknown[]) {
        __notifyFromReact(this._ref.current, eventName, args, true);
    }

    shouldComponentUpdate(nextProps: IPreviewerOptions): boolean {
        if (this.props.trigger !== nextProps.trigger) {
            this._closeOnMouseLeave = this._isHoverType(nextProps);
        }
        return nextProps !== this.props;
    }

    componentDidMount() {
        RegisterUtil(this, 'customscroll', this._scrollHandler.bind(this), {
            listenAll: true,
        });
    }

    componentWillUnmount() {
        UnregisterUtil(this, 'customscroll', { listenAll: true });
        this._calmTimer.stop();
        if (this._isPopupOpened()) {
            this.close();
        }
    }

    open(type: string): Promise<void> {
        if (!this._isPopupOpened()) {
            const newConfig: IPreviewerOptions = this._getConfig();
            this._isOpened = true;
            if (this.props.isPortal) {
                return this._openerRef.current.open({
                    ...newConfig,
                    type,
                });
            } else {
                return new PreviewerOpener()
                    .open(newConfig, type)
                    .then((config: IPreviewerOptions) => {
                        this._previewerItem = config;
                    });
            }
        }
    }

    /**
     * @param type
     * @variant hover
     * @variant click
     */
    close(type: string = 'click'): void {
        if (this.props.isPortal) {
            this._openerRef.current.close(this._openerRef.current.getPopupItem(), type);
        } else {
            new PreviewerOpener().close(this._previewerItem, type);
        }

        // Если в режиме по ховеру отменили открытие, то повторное открытие будет только после того,
        // как пользователь уведет курсор с таргета и наведен заново. Иначе по mousemove окно все равно откроется.
        if (this.props.trigger === 'hover') {
            if (!this._isOpened) {
                this._wasMouseEnter = false;
                this._calmTimer.stop();
            }
        }
    }

    activate(): void {
        activate(this._ref.current);
    }

    private _getConfig(): IPreviewerOptions {
        const opener =
            typeof this.props.opener === 'undefined' ? this._ref.current : this.props.opener;
        const config: IPreviewerOptions = {
            allowAdaptive: this.props.allowAdaptive,
            slidingPanelOptions: this.props.slidingPanelOptions,
            fittingMode: {
                vertical: this.props.fittingMode?.vertical || 'adaptive',
                horizontal: this.props.fittingMode?.horizontal || 'overflow',
            },
            autofocus: false,
            // При закрытии превьювера, опенер заберет фокус на себя, не везде нужна подобная логика
            opener,
            target: this._ref.current,
            template: 'Controls/popupTargets:PreviewerTemplate',
            // При открытии превьюера не должен блокироваться интерфейс индикатором загрузки.
            showIndicator: false,
            targetPoint: {
                vertical: 'bottom',
                horizontal: 'right',
            },
            isCompoundTemplate: this.props.isCompoundTemplate,
            eventHandlers: {
                onOpen: this._openHandler.bind(this),
                onResult: this._resultHandler.bind(this),
                onClose: this._closeHandler.bind(this),
                onStartClosing: this._startClosing.bind(this),
                onStartOpening: this._startOpening.bind(this),
            },
            templateOptions: {
                template: this.props.template,
                templateOptions: this.props.templateOptions,
            },
            loadConfig: this.props.loadConfig,
            loadConfigGetter: this.props.loadConfigGetter,
        };

        if (this.props.targetPoint) {
            config.targetPoint = this.props.targetPoint;
        }
        if (this.props.width) {
            config.width = this.props.width;
        }
        if (this.props.height) {
            config.height = this.props.height;
        }
        if (this.props.direction) {
            config.direction = this.props.direction;
        }
        if (this.props.offset) {
            config.offset = this.props.offset;
        }
        if (this.props.delay) {
            config.delay = this.props.delay;
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
        return !!Controller.getController()?.find(this._previewerItem?.id);
    }

    private _getType(eventType: string): string {
        if (eventType === 'mousemove' || eventType === 'mouseleave' || eventType === 'mouseenter') {
            return 'hover';
        }
        return 'click';
    }

    // Pointer action on hover with content and popup are executed sequentially.
    // Collect in package and process the latest challenge
    private _debouncedAction(method: string, args: any): void {
        this[method].apply(this, args);
    }

    private _cancel(_: SyntheticEvent<MouseEvent>, action: string): void {
        PreviewerOpener.cancel(
            action,
            this._openerRef?.current?.getPopupItem() || this._previewerItem
        );
    }

    protected _scrollHandler(event: SyntheticEvent<MouseEvent>): void {
        if (this._isOpened) {
            if (this.props.actionOnScroll === 'close') {
                this._close(event);
            }
        }
    }

    protected _startCalmTimer(delay: number = CALM_DELAY, event: SyntheticEvent<MouseEvent>) {
        // Устанавливаем старое значение таймера, так при небольших значениях,
        // окно может открыться когда этого не нужно
        // https://online.sbis.ru/opendoc.html?guid=55ca4037-ae40-44f4-a10f-ac93ddf990b1
        if (this._wasMouseEnter) {
            this._calmTimer.start(delay, event);
        }
    }

    protected _contentMouseEnterHandler(event: SyntheticEvent<MouseEvent>): void {
        this._wasMouseEnter = true;
        if (this.props.trigger === 'hover' || this.props.trigger === 'hoverAndClick') {
            // We will cancel closing of the popup, if it is already open
            if (this._isOpened) {
                this._cancel(event, 'closing');
            }
            if (!this.props.shouldWaitCursorToStop) {
                this._startCalmTimer(1, event);
            }
        }
        this.props.onMouseEnter?.(event);
    }

    protected _contentMouseleaveHandler(event: SyntheticEvent<MouseEvent>): void {
        if (!this.props.readOnly && this._closeOnMouseLeave) {
            this._calmTimer.stop();
            if (this._isPopupOpened()) {
                this._debouncedAction('_close', [event]);
            } else {
                this._cancel(event, 'opening');
            }
        }
        this.props.onMouseLeave?.(event);
    }

    protected _contentMousemoveHandler(event: SyntheticEvent<MouseEvent>): void {
        // На ios устройствах при клике почему-то стреляет событие mousemove, которого по идее быть не должно
        if (
            !this._stopPreviewer &&
            !this.props.readOnly &&
            (this.props.trigger === 'hover' || this.props.trigger === 'hoverAndClick') &&
            !(detection.isMobileSafari && TouchDetect.getInstance().isTouch())
        ) {
            if (this.props.shouldWaitCursorToStop) {
                this._startCalmTimer(undefined, event);
            }
        }
        this.props.onMouseMove?.(event);
    }

    protected _contentMouseDownHandler(event: SyntheticEvent<MouseEvent>): void {
        if (this.props.stopPreviewerOnClick) {
            this._stopPreviewer = true;
            this._calmTimer.stop();
            setTimeout(() => {
                this._stopPreviewer = false;
            }, 1000);
        }
        const isLeftMouseButton = event.nativeEvent.which === 1;
        if (!this.props.readOnly && this._isClickType(this.props) && isLeftMouseButton) {
            /*
             * When trigger is set to 'hover', preview shouldn't be shown when user clicks on content.
             */
            if (!this._isPopupOpened()) {
                this._debouncedAction('_open', [event]);
            } else if (this.props.closePreviewOnClick) {
                this.close();
            }

            event.preventDefault();
            event.stopPropagation();
            // preventDefault stopped the focus => active elements don't deactivated.
            // activate control manually
            this.activate();
        } else {
            this.props.onMouseDown?.(event);
        }
    }

    protected _contentClickHandler(event: SyntheticEvent<MouseEvent>): void {
        // Stopping mousedown event doesn't stop click event
        if (this._isClickType(this.props)) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            this.props.onClick?.(event);
        }
    }

    private _resultHandler(event: SyntheticEvent<MouseEvent>, ...args: unknown[]): void {
        switch (event.type) {
            case 'mouseover':
            case 'mouseenter':
                this._debouncedAction('_cancel', [event, 'closing']);
                break;
            case 'mouseleave':
                if (this._closeOnMouseLeave) {
                    this._debouncedAction('_close', [event]);
                }
                break;
            case 'enableCloseOnMouseLeave':
                this._closeOnMouseLeave = true;
                break;
            case 'disableCloseOnMouseLeave':
                this._closeOnMouseLeave = false;
                const popupConfig = this._openerRef?.current?.getPopupItem() || this._previewerItem;
                if (popupConfig.closingTimerId) {
                    clearTimeout(popupConfig.closingTimerId);
                    popupConfig.closingTimerId = null;
                }
                if (popupConfig.childClosingIntervalId) {
                    clearInterval(popupConfig.childClosingIntervalId);
                    popupConfig.childClosingIntervalId = null;
                }
                break;
            default:
                if (this.props.onResult) {
                    this.props.onResult(event, ...args);
                }
        }
    }

    private _isHoverType(options: IPreviewerOptions) {
        return options.trigger === 'hover' || options.trigger === 'hoverAndClick';
    }

    private _isClickType(options: IPreviewerOptions) {
        return options.trigger === 'click' || options.trigger === 'hoverAndClick';
    }

    private _closeHandler(): void {
        this._isOpened = false;
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    private _startClosing(): void {
        if (this.props.onStartClosing) {
            this.props.onStartClosing();
        }
    }

    private _startOpening(previewerItem: IPreviewerOptions): void {
        this._previewerItem = previewerItem;
    }

    private _openHandler(): void {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }

    protected _setRef(ref: RefObject<HTMLElement>) {
        this._ref.current = ref;
        if (this.props.forwardedRef) {
            if (typeof this.props.forwardedRef === 'function') {
                this.props.forwardedRef(ref);
            } else {
                this.props.forwardedRef.current = ref;
            }
        }
    }

    render(): ReactElement {
        const Content = (this.props.children || this.props.content) as ReactElement;
        let className = 'controls-PopupPreviewer';
        if (this.props.className) {
            className += ` ${this.props.className}`;
        } else if (this.props.attrs?.className) {
            className += ` ${this.props.attrs?.className}`;
        }
        if (Content.props?.className) {
            className += ` ${Content.props.className}`;
        }
        const contentProps = {
            ...(Content.props || {}),
            ...(typeof Content.type !== 'string'
                ? { forwardedRef: this._setRef.bind(this) }
                : undefined),
            ref: this._setRef.bind(this),
            className,
            'data-qa':
                Content.props?.['data-qa'] ||
                this.props.attrs?.['data-qa'] ||
                this.props['data-qa'] ||
                this.props.dataQa,
            onMouseDown: this._contentMouseDownHandler.bind(this),
            onMouseEnter: this._contentMouseEnterHandler.bind(this),
            onMouseLeave: this._contentMouseleaveHandler.bind(this),
            onMouseMove: this._contentMousemoveHandler.bind(this),
            onClick: this._contentClickHandler.bind(this),
            onDoubleClick: () => {
                this.props.onDoubleClick?.();
            },
        };
        return (
            <>
                {Content.props ? (
                    cloneElement(Content, contentProps)
                ) : (
                    <Content {...contentProps} />
                )}
                {this.props.isPortal ? (
                    <Opener ref={this._openerRef} popupType={'previewer'} />
                ) : null}
            </>
        );
    }

    static defaultProps = {
        trigger: 'hoverAndClick',
        actionOnScroll: 'close',
        shouldWaitCursorToStop: true,
    };
}
