/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { constants } from 'Env/Env';
import { debounce } from 'Types/function';
import { SyntheticEvent } from 'Vdom/Vdom';
import { detection } from 'Env/Env';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IPopupOptions } from 'Controls/_popup/interface/IPopup';
import { RegisterClass } from 'Controls/event';
import { ResizeObserverUtil } from 'Controls/sizeUtils';
import ManagerController from 'Controls/_popup/Manager/ManagerController';
import { delay as runDelayed } from 'Types/function';

import * as template from 'wml!Controls/_popup/Manager/Popup';
import * as PopupContent from 'wml!Controls/_popup/Manager/PopupContent';
import { IPrefetchData, waitPrefetchData } from 'Controls/_popup/utils/Preload';

const RESIZE_DELAY = 10;

interface IPopupControlOptions extends IPopupOptions, IControlOptions {
    _prefetchPromise?: Promise<IPrefetchPromises>; // TODO: Compatible предзагрузка
    prefetchData?: Record<string, unknown>; // TODO: Compatible предзагрузка
}
/**
 * Control Popup
 * @class Controls/_popup/Manager/Popup
 * @implements Controls/interface/IOpenerOwner
 * @implements Controls/interface:ICanBeDefaultOpener
 * @extends UI/Base:Control
 *
 * @private
 */
class Popup extends Control<IPopupControlOptions> {
    protected _template: TemplateFunction = template;
    protected _stringTemplate: boolean;
    protected _resizeObserver: ResizeObserverUtil;
    protected _isEscDown: boolean = false;
    protected waitForPopupCreated: boolean; // TODO: COMPATIBLE
    protected callbackCreated: Function | null; // TODO: COMPATIBLE
    protected _compatibleTemplateName: string; // TODO: COMPATIBLE
    protected _prefetchData: IPrefetchData; // TODO: COMPATIBLE предзагрузка
    protected _isPrefetchDataMode: boolean = false; // TODO: COMPATIBLE предзагрузка

    private _isPopupMounted: boolean = false;
    private _resizeRegister: RegisterClass;
    private _isDragStarted: boolean;

    private _closeByESC(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.keyCode === constants.key.esc) {
            this._close();
        }
    }

    protected _componentDidMount(): void {
        ManagerController.notifyToManager('popupBeforePaintOnMount', [
            this._options.id,
        ]);
    }

    protected _beforeMount(
        options: IPopupControlOptions
    ): void | Promise<void> {
        this._stringTemplate = typeof options.template === 'string';
        this._compatibleTemplateName = this._getCompatibleTemplateName(options);
        this._resizeRegister = new RegisterClass({ register: 'controlResize' });

        this._controlResizeHandler = debounce(
            this._controlResizeHandler.bind(this),
            RESIZE_DELAY,
            true
        );

        if (options._prefetchData) {
            this._prefetchData = options._prefetchData;
            this._isPrefetchDataMode = true;
        } else if (options._prefetchPromise) {
            this._isPrefetchDataMode = true;
            waitPrefetchData(options._prefetchPromise).then(
                (data: IPrefetchData) => {
                    this._prefetchData = data;
                }
            );
        } else if (options.prefetchData) {
            // Если с прикладной стороны сами получили предзагруженные данные
            this._isPrefetchDataMode = true;
        }
    }

    // TODO: https://online.sbis.ru/opendoc.html?guid=728a9f94-c360-40b1-848c-e2a0f8fd6d17
    private _getCompatibleTemplateName(options: IPopupOptions): string {
        if (options.isCompoundTemplate) {
            return options.templateOptions.template;
        } else if (typeof options.template === 'string') {
            return options.template;
        }
    }

    protected _afterMount(options: IPopupOptions): void {
        this._isPopupMounted = true;
        const openPopupCallbacks = ManagerController.getOpenPopupCallbacks();

        openPopupCallbacks.forEach((callback) => {
            callback(options, this._container);
        });

        /* TODO: COMPATIBLE. You can't just count on afterMount position and zooming on creation
         * inside can be compoundArea and we have to wait for it, and there is an asynchronous phase. Look at the flag waitForPopupCreated */
        if (this.waitForPopupCreated) {
            this.callbackCreated = () => {
                this.callbackCreated = null;
                ManagerController.notifyToManager('popupCreated', [
                    this._options.id,
                ]);
            };
        } else {
            // Если не реакт сборка, то сразу сообщаем что окно построено, иначе ждем onTemplateMounted
            if (!this.UNSAFE_isReact) {
                ManagerController.notifyToManager('popupCreated', [
                    this._options.id,
                ]);
                this.activatePopup();
            }
        }
        this._checkResizeObserver();
    }

    // Вызывает Container, когда замаунтится попап
    onTemplateMounted(): void {
        ManagerController.notifyToManager('popupCreated', [this._options.id]);
        // TODO: https://online.sbis.ru/opendoc.html?guid=77f074b4-9e4e-47b4-b56c-de9dfb9a3bef
        this.activatePopup();
    }

    protected _beforeUpdate(options: IPopupControlOptions): void {
        this._stringTemplate = typeof options.template === 'string';
        if (
            options._prefetchData !== this._options._prefetchData &&
            options._prefetchData
        ) {
            this._prefetchData = options._prefetchData;
            this._isPrefetchDataMode = true;
        } else if (
            options._prefetchPromise !== this._options._prefetchPromise
        ) {
            if (options._prefetchPromise) {
                waitPrefetchData(options._prefetchPromise).then(
                    (data: IPrefetchData) => {
                        this._prefetchData = data;
                        this._isPrefetchDataMode = true;
                    }
                );
            } else {
                this._prefetchData = null;
                this._isPrefetchDataMode = false;
            }
        } else if (
            !options._prefetchPromise &&
            options.prefetchData !== this._options.prefetchData
        ) {
            this._isPrefetchDataMode = !!options.prefetchData;
        }
    }

    protected _afterRender(oldOptions: IPopupOptions): void {
        ManagerController.notifyToManager('popupAfterUpdated', [
            this._options.id,
        ]);

        if (this._isResized(oldOptions, this._options)) {
            this._startResizeRegister();
            this._checkResizeObserver();
        }
    }

    private _startResizeRegister(event?: SyntheticEvent): void {
        const eventCfg = {
            type: 'controlResize',
            target: this,
            _bubbling: false,
        };
        const customEvent = new SyntheticEvent(null, eventCfg);
        this._resizeRegister.start(event || customEvent);
    }

    protected _beforeUnmount(): void {
        if (this._resizeRegister) {
            this._resizeRegister.destroy();
        }
        this._unregisterResizeObserver();
    }

    private _checkResizeObserver(): void {
        if (this._needListenResizeObserver()) {
            this._registerResizeObserver();
        } else {
            this._unregisterResizeObserver();
        }
    }

    private _registerResizeObserver(): void {
        if (!this._resizeObserver) {
            this._resizeObserver = new ResizeObserverUtil(
                this,
                this._resizeObserverCallback.bind(this)
            );
            this._resizeObserver.observe(this._container);
        }
    }

    private _unregisterResizeObserver(): void {
        if (this._resizeObserver) {
            this._resizeObserver.terminate();
            this._resizeObserver = null;
        }
    }

    protected _registerHandler(
        event,
        registerType,
        component,
        callback,
        config
    ): void {
        this._resizeRegister.register(
            event,
            registerType,
            component,
            callback,
            config
        );
    }

    protected _unregisterHandler(event, registerType, component, config): void {
        this._resizeRegister.unregister(event, registerType, component, config);
    }
    /**
     * Close popup
     * @function Controls/_popup/Manager/Popup#_close
     */
    protected _close(): void {
        if (!this._isDragStarted) {
            ManagerController.notifyToManager('popupClose', [this._options.id]);
        }
    }

    protected _maximized(event: SyntheticEvent<Event>, state: boolean): void {
        ManagerController.notifyToManager('popupMaximized', [
            this._options.id,
            state,
        ]);
    }

    protected _popupDragStart(
        event: SyntheticEvent<Event>,
        offset: number,
        sizes
    ): void {
        this._isDragStarted = true;
        ManagerController.notifyToManager('popupDragStart', [
            this._options.id,
            offset,
            sizes,
        ]);
    }

    protected _popupDragEnd(): void {
        this._isDragStarted = false;
        ManagerController.notifyToManager('popupDragEnd', [this._options.id]);
    }

    protected _popupMouseEnter(event: SyntheticEvent<MouseEvent>): void {
        ManagerController.notifyToManager('popupMouseEnter', [
            this._options.id,
        ]);
    }

    protected _popupMouseLeave(event: SyntheticEvent<MouseEvent>): void {
        ManagerController.notifyToManager('popupMouseLeave', [
            this._options.id,
        ]);
    }

    protected _popupMovingSize(
        event: SyntheticEvent<Event>,
        offset: object | number,
        position: string
    ): void {
        event.stopPropagation();
        ManagerController.notifyToManager('popupMovingSize', [
            this._options.id,
            offset,
            position,
        ]);
    }

    protected _animated(event: SyntheticEvent<AnimationEvent>): void {
        ManagerController.notifyToManager('popupAnimated', [this._options.id]);
    }

    protected _showIndicatorHandler(
        event: Event,
        config: object = {},
        promise?: Promise<any>
    ): string {
        // Вернул для индикаторов, вызванных из кода
        event.stopPropagation();
        if (typeof config === 'object') {
            config.popupId = this._options.id;
        }
        // catch showIndicator and add popupId property for Indicator.
        return this._notify('showIndicator', [config, promise], {
            bubbling: true,
        }) as string;
    }

    protected _registerPendingHandler(event: Event): string {
        const args = this._prepareEventArs(event, arguments);
        const config = args[1] || {};
        config.root = this._options.id;
        args[1] = config;
        // catch showIndicator and add popupId property for Indicator.
        return this._notify('registerPending', args, {
            bubbling: true,
        }) as string;
    }

    protected _finishPendingOperationsHandler(event: Event): string {
        const args = Array.prototype.slice.call(arguments, 1);
        args[1] = args[1] || this._options.id;
        // catch showIndicator and add popupId property for Indicator.
        return this._notify('finishPendingOperations', args, {
            bubbling: true,
        }) as string;
    }

    protected _cancelFinishingPendingHandler(event: Event): string {
        const args = this._prepareEventArs(event, arguments);
        args[0] = args[0] || this._options.id;
        // catch showIndicator and add popupId property for Indicator.
        return this._notify('cancelFinishingPending', args, {
            bubbling: true,
        }) as string;
    }

    private _prepareEventArs(event: Event, args: IArguments): unknown[] {
        event.stopPropagation();
        return Array.prototype.slice.call(args, 1);
    }

    protected _controlResizeHandler(): void {
        // Children controls can notify events while parent control isn't mounted
        // Because children's afterMount happens before parent afterMount

        if (this._isPopupMounted) {
            if (!this._needListenResizeObserver()) {
                this._notifyResizeInner();
            }
        }
    }

    private _resizeObserverCallback(): void {
        if (this._needListenResizeObserver()) {
            this._notifyResizeInner();
        }
    }

    private _needListenResizeObserver(): boolean {
        // Если размеров, ограничивающих контейнер, на окне нет, то
        // отслеживание изменение размеров окна осуществляется через resizeObserverUtil
        const hasSizes =
            this._options.position.width !== undefined ||
            this._options.position.height !== undefined;
        return !hasSizes && !detection.isIE;
    }

    private _notifyResizeInner(): void {
        ManagerController.notifyToManager('popupResizeInner', [
            this._options.id,
        ]);
    }

    /**
     * Proxy popup result
     * @function Controls/_popup/Manager/Popup#_sendResult
     */
    protected _sendResult(event: SyntheticEvent<Event>, ...args: any[]): void {
        // Если события вызвано коллбеком в реакте, первым аргументом может быть не Event
        const popupResultArgs = [this._options.id].concat(args);
        ManagerController.notifyToManager('popupResult', popupResultArgs);
    }

    /**
     * key up handler
     * @function Controls/_popup/Manager/Popup#_keyUp
     * @param event
     */
    protected _keyUp(event: SyntheticEvent<KeyboardEvent>): void {
        /*
         * Старая панель по событию keydown закрывается и блокирует всплытие события. Новая панель делает
         * то же самое, но по событию keyup. Из-за этого возникает следующая ошибка.
         * https://online.sbis.ru/opendoc.html?guid=0e4a5c02-f64c-4c7d-88b8-3ab200655c27
         *
         * Что бы не трогать старые окна, мы добавляем поведение на закрытие по esc. Закрываем только в том случае,
         * если новая панель поймала событие keydown клавиши esc.
         */
        if (this._isEscDown) {
            this._isEscDown = false;
            this._closeByESC(event);
        }
    }

    protected _keyDown(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.keyCode === constants.key.esc) {
            this._isEscDown = true;
            if (detection.isMac) {
                event.preventDefault();
            }
        }
    }

    activatePopup(): void {
        // TODO Compatible
        if (
            this._options.autofocus &&
            !this._options.isCompoundTemplate &&
            // На мобильных устройствах, при зуме, активацаия контрола приводит к подскроллу к этому контролу.
            // При открытии, попап позиционируется за пределами экрана, где-то слева сверху, из-за этого
            // страница прыгает в верхний левый угол.
            !detection.isMobileAndroid &&
            !detection.isMobileIOS
        ) {
            this.activate();
        }
    }

    getPopupId(): string {
        return this._options.id;
    }

    private _isResized(
        oldOptions: IPopupOptions,
        newOptions: IPopupOptions
    ): boolean {
        const { position: oldPosition }: IPopupOptions = oldOptions;
        const { position: newPosition }: IPopupOptions = newOptions;
        const hasWidthChanged: boolean =
            oldPosition.width !== newPosition.width;
        const hasHeightChanged: boolean =
            oldPosition.height !== newPosition.height;
        const hasMaxHeightChanged: boolean =
            oldPosition.maxHeight !== newPosition.maxHeight;
        const hasHiddenChanged: boolean =
            oldPosition.hidden !== newPosition.hidden;

        return (
            hasWidthChanged ||
            hasHeightChanged ||
            hasMaxHeightChanged ||
            (hasHiddenChanged && newPosition.hidden === false)
        );
    }

    // TODO Compatible
    // Для совместимости новых окон и старого индикатора:
    // Чтобы событие клавиатуры в окне не стопилось, нужно правильно
    // рассчитать индексы в методе getMaxZWindow WS.Core/core/WindowManager.js
    // В старых окнах есть метод getZIndex, а в новых нет. Поэтому, чтобы метод находил
    // правильный максимальный z-index, добавляю геттер

    getZIndex(): number {
        return this._options.zIndex;
    }

    static getDefaultOptions(): IPopupControlOptions {
        return {
            content: PopupContent,
            autofocus: true,
        };
    }
}

// _moduleName is assign in the callback of require.
// Private modules are not visible for this mechanism,
// _moduleName must be specified manually for them.
// It is necessary for checking relationship between popups.
// Значение теперь нужно присваивать до выполнения конструктора.
Object.assign(Popup.prototype, {
    _moduleName: 'Controls/_popup/Manager/Popup',
});

export default Popup;
/**
 * Template
 * @name Controls/_popup/Manager/Popup#template
 * @cfg {Content}
 */

/**
 * Template options
 * @name Controls/_popup/Manager/Popup#templateOptions
 * @cfg {Object}
 */
