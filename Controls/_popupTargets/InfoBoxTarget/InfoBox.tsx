/**
 * @kaizen_zone 9d34dedd-48d0-4181-bbcf-6dc5fd6d9b10
 */
import { cloneElement, Component, ReactElement, RefObject, createRef } from 'react';
import {
    IInfoBoxOptions,
    IInfoBoxPopupOptions,
    IEventHandlers,
    CalmTimer,
    Infobox as InfoboxOpener,
} from 'Controls/popup';
import { detection } from 'Env/Env';
import { SyntheticEvent } from 'UICommon/Events';
import { Control } from 'UICore/Base';
import { goUpByControlTree } from 'UI/Focus';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import { __notifyFromReact } from 'UI/Events';
import { BubblingEventContext } from 'UI/Events';
import * as getZIndex from 'Controls/Utils/getZIndex';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { isReactComponentType, isReactElement } from 'UICore/Executor';

interface IInfoboxState {
    opened: boolean;
}

let counter = 0;

/**
 * Контрол, отображающий всплывающую подсказку относительно указанного элемента.
 * Всплывающую подсказку вызывает событие, указанное в опции trigger.
 * В один момент времени на странице может отображаться только одна всплывающая подсказка.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FInfoBox%2FOpener%2FInfoBox демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/infobox/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @mixes Controls/popup:IInfoBox
 * @implements Controls/interface:IBackgroundStyle
 * @implements Controls/popup:ILoadConfigOptions
 * @public
 * @demo Controls-demo/InfoBox/InfoBox
 */
class InfoBox extends Component<IInfoBoxOptions, IInfoboxState> {
    protected _contentRef: RefObject<HTMLElement> = createRef();

    get _container(): HTMLElement {
        return this._contentRef.current;
    }

    protected _updating: boolean = false;
    private _destroyed: boolean = false;
    private _openCalmTimer: CalmTimer;
    private _closeCalmTimer: CalmTimer;
    private _infoboxOpener: InfoboxOpener;
    private _instanceId: string = 'infoboxReactId-' + counter++;

    constructor(props: IInfoBoxOptions) {
        super(props);
        this._resultHandler = this._resultHandler.bind(this);
        this._closeHandler = this._closeHandler.bind(this);
        this._openHandler = this._openHandler.bind(this);
        this._infoboxOpener = new InfoboxOpener();
        this._openCalmTimer = new CalmTimer(() => {
            if (!this.state.opened && !TouchDetect.getInstance().isTouch()) {
                this._startOpeningPopup();
            }
        });
        this._closeCalmTimer = new CalmTimer(() => {
            this.close();
        });
        this.state = {
            opened: false,
        };
    }

    shouldComponentUpdate(nextProps: IInfoBoxOptions): boolean {
        // При обновлении templateOptions вызываем open у уже открытого окна, для того чтобы новые значения
        // дошли до шаблона
        if (this.props.templateOptions !== nextProps.templateOptions && this.state.opened) {
            this.open(nextProps);
            this._updating = true;
        }
        return true;
    }

    componentWillUnmount() {
        this._destroyed = true;
        if (this.state.opened) {
            this.close();
        }
        this._openCalmTimer.stop();
        this._closeCalmTimer.stop();
    }

    getInstanceId() {
        return this._instanceId;
    }

    private _notify(eventName: string, args: unknown[]) {
        __notifyFromReact(this._contentRef.current, eventName, args, true);
    }

    open(options?: IInfoBoxOptions): void {
        const config: IInfoBoxPopupOptions = this._getConfig(options);

        if (isNewEnvironment()) {
            const event = new SyntheticEvent(null, {
                target: this._contentRef.current,
                type: 'openInfoBox',
            });
            this.context.onOpenInfoBox(event, config, false);
            this.props.onOpenInfoBox?.(event, config, false);
        } else {
            // To place zIndex in the old environment
            config.zIndex = getZIndex(this._contentRef.current);
            this._infoboxOpener.open(config);
        }

        this._openCalmTimer.stop();
        this._closeCalmTimer.stop();
    }

    private _getConfig(options?: IInfoBoxOptions): IInfoBoxPopupOptions {
        const closeOnOutsideClick =
            this.props.trigger === 'click' ||
            this.props.trigger === 'demand' ||
            ((this.props.trigger === 'hover|touch' || this.props.trigger === 'hover') &&
                detection.isMobilePlatform);

        const eventHandlers: IEventHandlers = {
            onResult: this._resultHandler,
            onClose: this._closeHandler,
            onOpen: this._openHandler,
        };

        return {
            opener: this,
            target: this._contentRef.current,
            showDelay: this.props.showDelay,
            template: this.props.template,
            position: this.props.position,
            targetSide: this.props.targetSide,
            alignment: this.props.alignment,
            borderStyle: this.props.style || this.props.borderStyle,
            backgroundStyle: this.props.backgroundStyle,
            validationStatus: 'valid',
            horizontalPadding: this.props.horizontalPadding,
            // InfoBox close by outside click only if trigger is set to 'demand' or 'click'.
            closeOnOutsideClick,
            floatCloseButton: this.props.floatCloseButton,
            closeButtonVisible: this.props.closeButtonVisible,
            eventHandlers,
            templateOptions: options?.templateOptions || this.props.templateOptions,
            indicatorConfig: this.props.indicatorConfig,
            verticalPadding: this.props.verticalPadding,
            loadConfig: this.props.loadConfig,
            loadConfigGetter: this.props.loadConfigGetter,
        };
    }

    close(withDelay: boolean = true): void {
        if (isNewEnvironment()) {
            const event = new SyntheticEvent(null, {
                target: this._contentRef.current,
                type: 'closeInfoBox',
            });
            this.context.onCloseInfoBox(event, !!withDelay);
            this.props.onCloseInfoBox?.(event, !!withDelay);
        } else {
            if (!this._destroyed) {
                this._infoboxOpener.close();
            }
        }
        this._openCalmTimer.stop();
        this.setState({
            opened: false,
        });
    }

    private _startOpeningPopup(): void {
        this.open();
    }

    protected _contentMousedownHandler(event: SyntheticEvent<MouseEvent>): void {
        if (this.props.trigger === 'click') {
            if (!this.state.opened) {
                this.open();
            }
            event.stopPropagation();
        } else {
            this.props.onMouseDown?.(event);
        }
    }

    protected _contentMousemoveHandler(event): void {
        if (this.props.trigger === 'hover' || this.props.trigger === 'hover|touch') {
            this._openCalmTimer.start();
        }
        this.props.onMouseMove?.(event);
    }

    protected _contentTouchStartHandler(event: Event): void {
        if (this.props.trigger === 'hover|touch' || this.props.trigger === 'hover') {
            this._startOpeningPopup();
            const { target } = event;
            const isInput = target?.tagName === 'INPUT';
            const isTextArea = target?.tagName === 'TEXTAREA';
            const isContentEditable = target?.getAttribute('contenteditable') === 'true';

            // Если тачнули в поле ввода, то не останавливаем событие, иначе не покажется клавиатура
            // eslint-disable-next-line max-len
            // https://www.uriports.com/blog/easy-fix-for-intervention-ignored-attempt-to-cancel-a-touchmove-event-with-cancelable-false/
            const needPrevent =
                !isInput && !isTextArea && !isContentEditable && event.nativeEvent.cancelable;
            if (needPrevent) {
                event.stopPropagation();
            } else {
                this.props.onTouchStart?.(event);
            }
        } else {
            this.props.onTouchStart?.(event);
        }
    }

    protected _contentClickHandler(event: Event): void {
        // Остановка события тача не остановит событие клика.
        // Будем останавливать сами событие клика в случае если инфобокс:
        // 1. Открывается по клику
        // 2. Открывается по тачу. Делаем проверку на isMobilePlatform, т.к. иначе мы бы так же останавливали событие
        // по ховеру на десктопе.
        if (
            (this.props.trigger === 'hover|touch' && detection.isMobilePlatform) ||
            this.props.trigger === 'click'
        ) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            this.props.onClick?.(event);
        }
    }

    protected _contentMouseleaveHandler(event): void {
        // Есть проблема на ios устройствах, связанная с тем,
        // что стреляется событие mouseleave, которого на тач устройствах по идее нет.
        // Поэтому игнорируем это события
        if (!detection.isMobileIOS) {
            if (this.props.trigger === 'hover' || this.props.trigger === 'hover|touch') {
                this._openCalmTimer.stop();
                this._mouseLeaveHandler();
            }
        }
        this.props.onMouseLeave?.(event);
    }

    private _mouseLeaveHandler(relatedTarget?: EventTarget, infoboxTemplate?: Control): void {
        const upTree = relatedTarget ? goUpByControlTree(relatedTarget) : [];
        if (!relatedTarget || !upTree.includes(infoboxTemplate)) {
            this._closeCalmTimer.start(80);
        }
    }

    private _resultHandler(event: SyntheticEvent<MouseEvent>, infoboxTemplate: Control): void {
        switch (event.type) {
            case 'mouseenter':
                this._openCalmTimer.stop();
                this._closeCalmTimer.stop();
                break;
            case 'mouseleave':
                if (this.props.trigger === 'hover' || this.props.trigger === 'hover|touch') {
                    this._openCalmTimer.stop();
                    const { relatedTarget } = event.nativeEvent;
                    this._mouseLeaveHandler(relatedTarget, infoboxTemplate);
                }
                break;
            case 'mousedown':
                event.stopPropagation();
                break;
            case 'close':
                // todo Для совместимости. Удалить, как будет сделана задача
                // https://online.sbis.ru/opendoc.html?guid=dedf534a-3498-4b93-b09c-0f36f7c91ab5
                this.setState({
                    opened: false,
                });
        }

        if (this.props.eventHandlers?.onResult) {
            this.props.eventHandlers.onResult();
        }
    }

    private _closeHandler(): void {
        if (!this._updating && !this._destroyed) {
            this.setState({
                opened: false,
            });
        } else {
            this._updating = false;
        }
        if (this.props.eventHandlers?.onClose) {
            this.props.eventHandlers.onClose();
        }
    }

    private _openHandler(): void {
        if (this.props.eventHandlers?.onOpen) {
            this.props.eventHandlers.onOpen();
        }
        this.setState({
            opened: true,
        });
    }

    protected _scrollHandler(): void {
        this.close(false);
    }

    protected _setRef(ref: RefObject<HTMLElement>) {
        this._contentRef.current = ref;
        if (this.props.forwardedRef) {
            if (typeof this.props.forwardedRef === 'function') {
                this.props.forwardedRef(ref);
            } else {
                this.props.forwardedRef.current = ref;
            }
        }
    }

    render(): ReactElement {
        let className = '';

        if (this.props.trigger?.includes('hover')) {
            className = 'tw-cursor-help ';
        }

        const Content = this.props.children || this.props.content;
        if (Content.props?.className) {
            className += `${Content.props.className}`;
        }

        if (this.props.className) {
            className += ` ${this.props.className}`;
        } else if (this.props.attrs?.className) {
            className += ` ${this.props.attrs?.className}`;
        }
        const contentProps = {
            ...(Content.props || {}),
            ref: this._setRef.bind(this),
            className,
            'data-qa':
                Content.props?.['data-qa'] ||
                this.props.attrs?.['data-qa'] ||
                this.props['data-qa'] ||
                this.props.dataQa,
            onMouseDown: this._contentMousedownHandler.bind(this),
            onMouseLeave: this._contentMouseleaveHandler.bind(this),
            onMouseMove: this._contentMousemoveHandler.bind(this),
            onTouchStart: this._contentTouchStartHandler.bind(this),
            onClick: this._contentClickHandler.bind(this),
            onDoubleClick: () => {
                this.props.onDoubleClick?.();
            },
        };
        delete contentProps.content;
        delete contentProps.children;

        if (typeof Content.type === 'string') {
            return cloneElement(Content, contentProps);
        }

        contentProps.forwardedRef = this._setRef.bind(this);
        if (isReactComponentType(Content)) {
            return <Content {...contentProps} />;
        }
        return cloneElement(Content, contentProps);
    }

    static defaultProps = {
        targetSide: 'top',
        alignment: 'start',
        borderStyle: 'secondary',
        trigger: 'hover',
        closeButtonVisible: true,
    };

    static contextType = BubblingEventContext;
}

export default InfoBox;
