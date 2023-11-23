import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/Application/Page';
import { Body as PageBody, Head as PageHead } from 'Application/Page';

import * as cBodyClasses from 'Core/BodyClasses';
import { getResourceUrl } from 'RequireJsLoader/conduct';
import { constants, detection, IoC } from 'Env/Env';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { Bus } from 'Env/Event';
import { SyntheticEvent } from 'Vdom/Vdom';
import { dispatcherHandler } from 'UI/HotKeys';
import { List } from 'Types/collection';

import {
    IPopupSettingsController,
    setController as setSettingsController,
} from 'Controls/Application/SettingsController';
import {
    GlobalController as PopupGlobalController,
    IPopupItem,
    ManagerClass as PopupManager,
} from 'Controls/popup';
import { IPendingConfig, PendingClass } from 'Controls/Pending';
import { RegisterClass } from 'Controls/event';
import { ControllerClass as DnDController, IDragObject } from 'Controls/dragnDrop';
import { getConfig } from 'Application/Env';

// Нужно чтобы oldCss прилетал первым на страницу. Есть контролы (например itemsActions), стили которыйх
// Завязаны на порядок css.
import 'css!Controls/Application/oldCss';
import 'css!Controls/application';
import 'css!Controls/dragnDrop';
import 'css!Controls/CommonClasses';
import { DimensionsMeasurer } from 'Controls/sizeUtils';

/**
 * Корневой контрол для Wasaby-приложений. Служит для создания базовых html-страниц.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/sbis-env-ui/ здесь}.
 *
 * @class Controls/Application
 * @extends UI/Base:Control
 * @implements Controls/interface:IApplication
 *
 * @public
 */

interface IBodyClassesField {
    scrollingClass: string;
    fromOptions: string;
    themeClass: string;
    bodyThemeClass: string;
}

/**
 * Отвечает за состояние некоторых классов для <body>.
 * @name Controls/Application/IBodyClassesStateField
 * @private
 * @variant {Boolean} touch регулирует класс ws-is-touch | ws-is-no-touch
 * @variant {Boolean} drag регулирует класс ws-is-drag | ws-is-no-drag
 * @variant {Boolean} hover регулирует класс ws-is-hover | ws-is-no-hover
 */
interface IBodyClassesStateField {
    touch: boolean;
    drag: boolean;
    hover: boolean;
}

interface IApplicationRegistrars {
    customscroll?: RegisterClass;
    scroll?: RegisterClass;
    controlResize?: RegisterClass;
    mousedown?: RegisterClass;
    mousemove?: RegisterClass;
    mouseup?: RegisterClass;
    touchmove?: RegisterClass;
    touchend?: RegisterClass;
}

interface IHeadLinkConfig {
    force?: boolean;
    preload?: boolean;
    prefetch?: boolean;
}

interface IApplication extends IControlOptions {
    bodyClass?: string;
    title?: string;
    RUMEnabled?: boolean;
    pageName?: string;
    resourceRoot?: string;
    loadDataProviders?: boolean;
    isAdaptive?: boolean;

    popupHeaderTheme?: string;
    settingsController?: IPopupSettingsController;

    pagingVisible?: boolean;
    compat?: boolean;
}

/** Динамические классы для body */
const BODY_CLASSES = {
    /* eslint-disable */
    /**
     * @type {String} Property controls whether or not touch devices use momentum-based scrolling for innerscrollable areas.
     * @private
     */
    /* eslint-enable */
    scrollingClass: detection.isMobileIOS ? 'controls-Scroll_webkitOverflowScrollingTouch' : '',
    fromOptions: '',
    themeClass: '',
    bodyThemeClass: '',
};

const BODY_CLASSES_STATE: IBodyClassesStateField = {
    touch: false,
    drag: false,
    hover: false,
};

export default class Application extends Control<IApplication> {
    RUMEnabled: boolean;
    pageName: string;
    resourceRoot: string;
    head: object;

    protected _template: TemplateFunction = template;
    protected _bodyClasses: IBodyClassesField = { ...BODY_CLASSES };
    protected _bodyClassesState: IBodyClassesStateField = {
        ...BODY_CLASSES_STATE,
    };
    protected _prevOrientationChangeState: number = 0;
    protected _prevInnerHeight: number;

    private _registers: IApplicationRegistrars;
    private _popupManager: PopupManager;
    private _globalPopup: PopupGlobalController;
    private _dragnDropController: DnDController;
    private _isPopupShow: boolean;
    private _isSuggestShow: boolean;
    private _touchController: TouchDetect;
    private _pendingController: PendingClass;
    private _shouldNotUpdateBodyClass: boolean;

    // start hooks
    protected _beforeMount(options: IApplication): void {
        this._checkDeprecatedOptions(options);

        this.RUMEnabled = getConfig('RUMEnabled') || false;
        this.pageName = options.pageName || '';
        this.resourceRoot = options.resourceRoot || constants.resourceRoot;

        // Чтобы при загрузке слоя совместимости, понять нужно ли грузить провайдеры(extensions, userInfo, rights),
        // положим опцию из Application в constants. Иначе придется использовать глобальную переменную.
        // TODO: Удалить этот код отсюда по задае:
        // https://online.sbis.ru/opendoc.html?guid=3ed5ebc1-0b55-41d5-a8fa-921ad24aeec3
        constants.loadDataProviders = options.loadDataProviders;

        if (constants.isBrowserPlatform) {
            /* eslint-disable */
            if (document.getElementsByClassName('head-custom-block').length > 0) {
                this.head = undefined;
            }
            /* eslint-enable */
        }
        this._initBodyClasses(options);
        this._updateTouchClass();
        this._updateThemeClass(options);
        this._updateFromOptionsClass(options);

        setSettingsController(options.settingsController);

        this._createDragnDropController();
        this._createGlobalPopup();
        this._createPopupManager(options);
        this._createRegisters();
        this._createTouchDetector();

        const pendingOptions = {
            notifyHandler: (eventName: string, args?: []) => {
                return this._notify(eventName, args, { bubbling: true });
            },
        };
        this._pendingController = new PendingClass(pendingOptions);
    }
    protected _afterMount(options: IApplication): void {
        // Подписка через viewPort дает полную информацию про ресайз страницы, на мобильных устройствах
        // сообщает так же про изменение экрана после показа клавиатуры и/или зуме страницы.
        // Подписка на body стреляет не всегда. в 2100 включаю только для 13ios, в перспективе можно включить
        // везде, где есть visualViewport

        if (Application._isIOS13()) {
            window.visualViewport.addEventListener('resize', this._resizePage.bind(this));

            // Хак актуален только для телефона с Ios и мета тегом viewport
            if (options.isAdaptive) {
                this._prevInnerHeight = window.innerHeight;
                window.addEventListener('orientationchange', this._orientationChange.bind(this));
            }
        }
        window.addEventListener('resize', this._resizePage.bind(this));
        window.document.addEventListener('scroll', this._scrollPage.bind(this));
        window.document.addEventListener('keydown', (event) => {
            this._keyDownHandler(new SyntheticEvent<KeyboardEvent>(event));
        });
        const channelPopupManager = Bus.channel('popupManager');
        channelPopupManager.subscribe('managerPopupCreated', this._popupCreatedHandler, this);
        channelPopupManager.subscribe('managerPopupDestroyed', this._popupDestroyedHandler, this);
        channelPopupManager.subscribe(
            'managerPopupBeforeDestroyed',
            this._popupBeforeDestroyedHandler,
            this
        );

        this._globalPopup.registerGlobalPopup();
        this._popupManager.init();
    }
    protected _beforeUpdate(options: IApplication): void {
        this._updateTouchClass();
        this._updateThemeClass(options);
        this._updateFromOptionsClass(options);
    }
    protected _afterUpdate(oldOptions: IApplication): void {
        /* eslint-disable */
        const elements = document.getElementsByClassName('head-title-tag');
        /* eslint-enable */
        if (elements.length === 1) {
            // Chrome на ios при вызове History.replaceState, устанавливает в title текущий http адрес.
            // Если после загрузки установить title, который уже был, то он не обновится, и в заголовке вкладки
            // останется http адрес. Поэтому сначала сбросим title, а затем положим туда нужное значение.
            if (
                detection.isMobileIOS &&
                detection.chrome &&
                oldOptions.title === this._options.title
            ) {
                elements[0].textContent = '';
            }
            elements[0].textContent = this._options.title;
        }
        this._popupManager.updateOptions(this._options.popupHeaderTheme);
    }
    protected _beforeUnmount(): void {
        for (const register in this._registers) {
            if (this._registers.hasOwnProperty(register)) {
                this._registers[register].destroy();
            }
        }
        const channelPopupManager = Bus.channel('popupManager');
        channelPopupManager.unsubscribe('managerPopupCreated', this._popupCreatedHandler, this);
        channelPopupManager.unsubscribe('managerPopupDestroyed', this._popupDestroyedHandler, this);
        channelPopupManager.unsubscribe(
            'managerPopupBeforeDestroyed',
            this._popupBeforeDestroyedHandler,
            this
        );

        this._globalPopup.registerGlobalPopupEmpty();
        this._popupManager.destroy();
        this._dragnDropController.destroy();
    }
    // end hooks

    // start Handlers
    protected _scrollPage(e: SyntheticEvent<Event>): void {
        this._registers.customscroll.start(e);
        this._popupManager.eventHandler('pageScrolled', []);
    }
    protected _resizeBody(e: SyntheticEvent<Event>): void {
        if (!Application._isIOS13()) {
            this._resizePage(e);
        }
    }
    protected _resizePage(e: SyntheticEvent<Event>): void {
        this._prevInnerHeight =
            (e.target as VisualViewport).height || (e.target as Window).innerHeight;
        this._registers.controlResize.start(e);
        this._popupManager.eventHandler('popupResizeOuter', []);
    }
    protected _mousedownPage(e: SyntheticEvent<Event>): void {
        this._registers.mousedown.start(e);
        if (!detection.isMobilePlatform) {
            this._popupManager.mouseDownHandler(e);
        }
    }
    protected _mousemovePage(e: SyntheticEvent<Event>): void {
        this._registers.mousemove.start(e);
        if (!this._shouldNotUpdateBodyClass) {
            this._updateTouchClass();
        }
    }
    protected _mouseupPage(e: SyntheticEvent<Event>): void {
        this._registers.mouseup.start(e);
    }
    protected _touchmovePage(e: SyntheticEvent<Event>): void {
        this._registers.touchmove.start(e);
    }
    protected _touchendPage(e: SyntheticEvent<Event>): void {
        this._registers.touchend.start(e);
    }
    protected _mouseleavePage(e: SyntheticEvent<Event>): void {
        /* eslint-disable */
        /**
         * Перемещение элементов на странице происходит по событию mousemove. Браузер генерирует его исходя из
         * доступных ресурсов, и с дополнительными оптимизациями, чтобы не перегружать систему. Поэтому событие не происходит
         * на каждое попиксельное смещение мыши. Между двумя соседними событиями, мышь проходит некоторое расстояние.
         * Чем быстрее перемещается мышь, тем больше оно будет.
         * Событие не происход, когда мышь покидает граници экрана. Из-за этого, элементы не могут быть перемещены в плотную к ней.
         * В качестве решения, генерируем событие mousemove, на момент ухода мыши за граници экрана.
         * Демо: https://jsfiddle.net/q7rez3v5/
         */
        /* eslint-enable */
        this._registers.mousemove.start(e);
    }
    protected _touchStartPage(event: SyntheticEvent<Event>): void {
        this._updateTouchClass();
        if (detection.isMobilePlatform) {
            this._popupManager.mouseDownHandler(event);
        }
    }
    protected _keyPressHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (this._isPopupShow) {
            if (constants.browser.safari) {
                // Need to prevent default behaviour if popup is opened
                // because safari escapes fullscreen mode on 'ESC' pressed
                // TODO https://online.sbis.ru/opendoc.html?guid=5d3fdab0-6a25-41a1-8018-a68a034e14d9
                if (event.nativeEvent && event.nativeEvent.keyCode === 27) {
                    event.preventDefault();
                }
            }
        }
    }
    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        dispatcherHandler(event);
    }
    protected _suggestStateChangedHandler(event: SyntheticEvent<Event>, state: boolean): void {
        this._isSuggestShow = state;
        this._updateScrollingClass();
    }
    private _dragStartHandler(dragObject?: IDragObject): void {
        this._bodyClassesState.drag = true;
        this._shouldNotUpdateBodyClass = dragObject?.entity?.shouldNotUpdateBodyClass;
        if (!this._shouldNotUpdateBodyClass) {
            this._updateTouchClass();
        }
    }
    private _dragEndHandler(dragObject?: IDragObject): void {
        this._bodyClassesState.drag = false;
        this._shouldNotUpdateBodyClass = false;
        if (!dragObject?.entity?.shouldNotUpdateBodyClass) {
            this._updateTouchClass();
        }
    }
    /* end Handlers */

    /**
     * Метод добавит к информации для Body API данные о классах типа ws-is-touch | ws-is-no-touch
     * Тоесть, о взаимоисключающих классах. Их наличие регулируется логическим флагом в объекте this._bodyClassesState
     * @param classesToDelete
     * @param classesToAdd
     * @private
     */
    private _prepareDataForBodyAPI(
        classesToDelete: string[] = [],
        classesToAdd: string[] = []
    ): void {
        let classToAdd: string;
        let classToDelete: string;

        Object.keys(this._bodyClassesState).forEach((key) => {
            classToAdd = `ws-is-${this._bodyClassesState[key] ? '' : 'no-'}${key}`;
            classToDelete = `ws-is-${!this._bodyClassesState[key] ? '' : 'no-'}${key}`;
            if (!classesToAdd.includes(classToAdd)) {
                classesToAdd.push(classToAdd);
            }
            if (!classesToDelete.includes(classToDelete)) {
                classesToDelete.push(classToDelete);
            }
        });
    }

    /** Задаем классы для body, которые не будут меняться */
    private _initBodyClasses(cfg: IApplication): void {
        this._initIsAdaptiveClass(cfg);
        const BodyAPI = PageBody.getInstance();
        const classesToDelete = [];
        // Эти классы вешаются в двух местах. Разница в том, что BodyClasses всегда возвращает один и тот же класс,
        // а TouchDetector реагирует на изменение состояния.
        // Поэтому в Application оставим только класс от TouchDetector
        const classesToAdd = cBodyClasses()
            .replace('ws-is-touch', '')
            .replace('ws-is-no-touch', '')
            .split(' ')
            .concat(['zIndex-context'])
            .filter(Application._isExist);
        for (const key in this._bodyClasses) {
            if (this._bodyClasses.hasOwnProperty(key)) {
                if (Application._isExist(this._bodyClasses[key])) {
                    this._bodyClasses[key].split(' ').forEach((_class) => {
                        return classesToAdd.push(_class);
                    });
                }
            }
        }
        this._prepareDataForBodyAPI(classesToDelete, classesToAdd);
        BodyAPI.replaceClasses(classesToDelete, classesToAdd);
    }
    private _initIsAdaptiveClass(cfg: IApplication): void {
        // TODO: toso
        if (cfg.isAdaptive) {
            let viewport = 'width=device-width, initial-scale=1.0, user-scalable=no';
            if (!!this.context.isScrollOnBody) {
                viewport += ', viewport-fit=cover';
            }
            PageHead.getInstance().createTag('meta', {
                name: 'viewport',
                content: viewport,
            });
            // Подписка на 'touchmove' необходима для отключения ресайза в адаптивном режиме.
            // https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari

            if (constants.isBrowserPlatform) {
                document.addEventListener(
                    'touchmove',
                    (event) => {
                        // event.scale === undefined в эмуляторе.
                        if (event.scale !== undefined && event.scale !== 1) {
                            event.preventDefault();
                        }
                    },
                    { passive: false }
                );
            }
        }
    }
    private _updateBodyClasses(updated?: Partial<IBodyClassesField>): void {
        const BodyAPI = PageBody.getInstance();
        const bodyClassesToUpdate = updated || this._bodyClasses;
        let classesToDelete = [];
        let classesToAdd = [];

        for (const key in bodyClassesToUpdate) {
            if (bodyClassesToUpdate.hasOwnProperty(key)) {
                if (bodyClassesToUpdate[key] === this._bodyClasses[key]) {
                    continue;
                }
                classesToAdd = classesToAdd.concat(
                    bodyClassesToUpdate[key].split(' ').filter(Application._isExist)
                );
                classesToDelete = classesToDelete.concat(
                    this._bodyClasses[key].split(' ').filter(Application._isExist)
                );
                this._bodyClasses[key] = bodyClassesToUpdate[key];
            }
        }

        classesToDelete = classesToDelete.filter((value: string) => {
            return !classesToAdd.includes(value);
        });

        this._prepareDataForBodyAPI(classesToDelete, classesToAdd);
        if (classesToAdd.length || classesToDelete.length) {
            BodyAPI.replaceClasses(classesToDelete, classesToAdd);
        }
    }
    private _updateFromOptionsClass(options: IApplication): void {
        this._updateBodyClasses({
            fromOptions: options.bodyClass || '',
        });
    }
    private _updateScrollingClass(): void {
        let scrollingClass;
        if (detection.isMobileIOS) {
            if (this._isPopupShow || this._isSuggestShow) {
                scrollingClass = 'controls-Scroll_webkitOverflowScrollingAuto';
            } else {
                scrollingClass = 'controls-Scroll_webkitOverflowScrollingTouch';
            }
        } else {
            scrollingClass = '';
        }

        this._updateBodyClasses({
            scrollingClass,
        });
    }
    private _updateTouchClass(updated: Partial<IBodyClassesField> = {}): void {
        // Данный метод вызывается до построения вёрстки, и при первой отрисовке еще нет _children (это нормально)
        // поэтому сами детектим touch с помощью compatibility
        if (this._touchController) {
            this._bodyClassesState.touch = this._touchController.isTouch();
        } else {
            this._bodyClassesState.touch = !!detection.isMultiTouch;
        }

        this._bodyClassesState.hover = this._isHover();

        this._updateBodyClasses(updated);
    }
    private _updateThemeClass(options: IApplication): void {
        this._updateBodyClasses({
            themeClass: 'Application-body',
            bodyThemeClass: `controls_theme-${options.theme}`,
        });
    }

    /** ************************************************** */

    private _checkDeprecatedOptions(opts: IApplication): void {
        /* eslint-disable */
        if (opts.compat) {
            IoC.resolve('ILogger').warn(
                'Опция compat является устаревшей. Для вставки старых контролов внутри VDOM-ного окружения ' +
                    'используйте один из способов, описанных в этой статье: https://wi.sbis.ru/doc/platform/developmentapl/ws3/compound-wasaby/'
            );
        }
        /* eslint-enable */
    }
    // start Registrars
    private _createRegisters(): void {
        const registers = [
            'customscroll',
            'controlResize',
            'mousemove',
            'mouseup',
            'touchmove',
            'touchend',
            'mousedown',
        ];
        this._registers = {};
        registers.forEach((register) => {
            this._registers[register] = new RegisterClass({ register });
        });
    }
    protected _registerHandler(
        event: Event,
        registerType: string,
        component: Control,
        callback: (...args: unknown[]) => void,
        config: object
    ): void | IDragObject {
        if (this._registers[registerType]) {
            this._registers[registerType].register(
                event,
                registerType,
                component,
                callback,
                config
            );
            return;
        }
        return this._dragnDropController.registerHandler(
            event,
            registerType,
            component,
            callback,
            config
        );
    }
    protected _unregisterHandler(
        event: Event,
        registerType: string,
        component: Control,
        config: object
    ): void {
        if (this._registers[registerType]) {
            this._registers[registerType].unregister(event, registerType, component, config);
            return;
        }
        this._dragnDropController.unregisterHandler(event, registerType, component, config);
    }
    // end Registrar

    // start create helpers
    private _createGlobalPopup(): void {
        this._globalPopup = new PopupGlobalController();
    }
    // попап не экспортирует свои опции, поэтому так некрасиво тип описывается
    private _createPopupManager(cfg: ConstructorParameters<typeof PopupManager>[0]): void {
        this._popupManager = new PopupManager(cfg);
    }
    private _createDragnDropController(): void {
        this._dragnDropController = new DnDController();
    }
    private _createTouchDetector(): void {
        this._touchController = TouchDetect.getInstance();
    }
    // end create helpers

    // start dragHandlers
    protected _documentDragStart(event: SyntheticEvent, dragObject: IDragObject): void {
        this._dragnDropController.documentDragStart(dragObject);
        this._dragStartHandler(dragObject);
    }
    protected _documentDragEnd(event: SyntheticEvent, dragObject: IDragObject): void {
        this._dragnDropController.documentDragEnd(dragObject);
        this._dragEndHandler(dragObject);
    }
    protected _updateDraggingTemplate(
        event: SyntheticEvent,
        draggingTemplateOptions: IDragObject,
        draggingTemplate: TemplateFunction
    ): void {
        this._dragnDropController.updateDraggingTemplate(draggingTemplateOptions, draggingTemplate);
    }
    protected _removeDraggingTemplate(): void {
        this._dragnDropController.removeDraggingTemplate();
    }
    // end dragHandlers

    // popupHandlers
    private _popupCreatedHandler(): void {
        this._isPopupShow = true;

        this._updateScrollingClass();
    }
    private _popupDestroyedHandler(
        event: SyntheticEvent<Event>,
        element: IPopupItem,
        popupItems: List<IPopupItem>
    ): void {
        if (popupItems.getCount() === 0) {
            this._isPopupShow = false;
        }
        this._updateScrollingClass();
    }
    private _popupBeforeDestroyedHandler(
        event: SyntheticEvent<Event>,
        popupCfg: IPopupItem,
        popupList: List<IPopupItem>,
        popupContainer: HTMLElement
    ): void {
        this._globalPopup.popupBeforeDestroyedHandler(event, popupCfg, popupList, popupContainer);
    }

    protected _openInfoBoxHandler(event: SyntheticEvent<Event>, config, withDelay?: boolean): void {
        this._globalPopup.openInfoBoxHandler(event, config, withDelay);
    }
    protected _openDialogHandler(
        event: SyntheticEvent<Event>,
        templ,
        templateOptions,
        opener
    ): Promise<unknown> {
        return this._globalPopup.openDialogHandler(event, templ, templateOptions, opener);
    }
    protected _closeInfoBoxHandler(event: SyntheticEvent<Event>, withDelay?: boolean): void {
        this._globalPopup.closeInfoBoxHandler(event, withDelay);
    }
    protected _forceCloseInfoBoxHandler(): void {
        this._globalPopup.forceCloseInfoBoxHandler();
    }
    protected _openPreviewerHandler(event, config, type): Promise<unknown> {
        return this._globalPopup.openPreviewerHandler(event, config, type);
    }
    protected _cancelPreviewerHandler(event, action): void {
        this._globalPopup.cancelPreviewerHandler(event, action);
    }
    protected _isPreviewerOpenedHandler(event): boolean {
        return this._globalPopup.isPreviewerOpenedHandler(event);
    }
    protected _closePreviewerHandler(event, type): void {
        this._globalPopup.closePreviewerHandler(event, type);
    }
    protected _popupEventHandler(event: string, action: unknown[]): void {
        const args = Array.prototype.slice.call(arguments, 2);
        this._popupManager.eventHandler.apply(this._popupManager, [action, args]);
    }

    protected _registerPendingHandler(
        event: Event,
        promise: Promise<void>,
        config: IPendingConfig
    ): void {
        event.stopPropagation();
        this._pendingController.registerPending(promise, config);
    }

    protected _finishPendingHandler(
        event: Event,
        forceFinishValue: boolean,
        root: string
    ): Promise<unknown> {
        event.stopPropagation();
        return this._pendingController.finishPendingOperations(forceFinishValue, root);
    }

    protected _cancelFinishingPendingHandler(event: Event, root: string): void {
        event.stopPropagation();
        this._pendingController.cancelFinishingPending(root);
    }

    protected _workspaceResizeHandler(event: SyntheticEvent): void {
        const args = Array.prototype.slice.call(arguments, 1);
        DimensionsMeasurer.resetCache(); // После изменения размеров страницы сбросим кэш, т.к. zoom мог поменяться
        this._popupEventHandler(event, 'workspaceResize', ...args);
    }

    /**
     * Решения взято отсюда
     * https://stackoverflow.com/questions/62717621/white-space-at-page-bottom-after-device-rotation-in-ios-safari
     * @protected
     */
    protected _orientationChange(event: Event): void {
        const currentOrientationState = event.target.orientation;
        // orientationChange на айпаде стреляет даже при сворачивании браузера, поэтому смотрим еще за размерами.
        if (
            event.target.innerHeight !== this._prevInnerHeight &&
            this._prevOrientationChangeState !== currentOrientationState
        ) {
            document.documentElement.style.height = 'initial';
            setTimeout(() => {
                document.documentElement.style.height = '100%';
            }, 500);
            this._prevOrientationChangeState = currentOrientationState;
            this._prevInnerHeight = event.target.innerHeight;
        }
    }

    private _getResourceUrl(str: string): string {
        return getResourceUrl(str);
    }

    private _isHover(): boolean {
        return !this._bodyClassesState.touch && !this._bodyClassesState.drag;
    }

    private static _isIOS13(): boolean {
        const oldIosVersion: number = 12;
        return detection.isMobileIOS && detection.IOSVersion > oldIosVersion;
    }

    private static _isExist(value: unknown): boolean {
        return !!value;
    }

    static getDefaultOptions(): object {
        return {
            title: '',
            pagingVisible: false,
        };
    }
}
