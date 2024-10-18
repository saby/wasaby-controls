/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';
import openPopup from '../utils/openPopup';
import GlobalController from 'Controls/_popup/Popup/GlobalController';
import getAdaptiveDesktopMode from 'Controls/_popup/utils/getAdaptiveDesktopMode';
import BaseOpenerUtil from 'Controls/_popup/WasabyOpeners/BaseOpenerUtil';
import { IndicatorOpener } from 'Controls/LoadingIndicator';
import * as randomId from 'Core/helpers/Number/randomId';
import { constants } from 'Env/Env';
import { Logger } from 'UI/Utils';

/**
 * Базовый класс, от которого наследуются все опенеры окон
 * @private
 */
export default class Base<IPopupOptions> {
    protected _controller: string;
    protected _options: IBasePopupOptions;
    protected _type: string;

    protected _adaptiveOptions: {
        slidingPanelOptions: {};
        defaultMode: string;
    };
    protected _slidingPanelOpener;
    protected _popupId: string;
    private _indicatorId: string;
    private _openPromise: Promise<string>[] = [];

    constructor(config: IBasePopupOptions = {}) {
        this._options = config;
    }

    /**
     * Метод открытия окна.
     * @param {object} popupOptions
     */
    open(popupOptions: IPopupOptions = {}): Promise<string | void | Error> {
        if (constants.isServerSide) {
            const template = { ...popupOptions, ...this._options }.template;
            Logger.error(
                `Controls/popup: запрещено вызывать метод open на СП. Попытка открыть окно с шаблоном ${template}`
            );
            return;
        }
        if (this._isAdaptive({ ...popupOptions, ...this._options })) {
            return this._openAdaptivePopup({ ...popupOptions, ...this._options });
        }

        const callback = () => {
            return new Promise((resolve, reject) => {
                // Объединяем конфигурацию, пришедшую в конструктор и в аргумент метода.
                const config: IBasePopupOptions = BaseOpenerUtil.getConfig(
                    this._options,
                    popupOptions
                );
                if (config.opener === window) {
                    Logger.error(
                        `Controls/popup (${config.template}): в опцию opener запрещено передавать объект window.` +
                            'Такое происходит, если передан this, непривязанный к контексту компонента'
                    );
                    delete config.opener;
                }
                const openPopup = () => {
                    config._type = this._type;

                    // Защита от множественного вызова. Хэлпер сам генерирует id.
                    if (GlobalController.getController()?.isDestroying(this._popupId)) {
                        this._popupId = null;
                    }
                    this._setPopupId(config.id);
                    config.id = this._popupId;

                    if (!this._indicatorId && config.showIndicator) {
                        this._showIndicator(config);
                    }

                    // Записываем обработчики в конфиг, возможно можно сделать это через сеттеры? Подумать
                    config._events = {
                        onOpen: (eventName: string, args: unknown[]) => {
                            this._openHandler();
                            popupOptions._events?.onOpen?.(eventName, args);
                            resolve(this._popupId);
                        },
                        onResult: (eventName: string, args: unknown[]) => {
                            popupOptions._events?.onResult?.(eventName, args);
                        },
                        onClose: (eventName: string, args: unknown[]) => {
                            this._closeHandler();
                            popupOptions._events?.onClose?.(eventName, args);
                        },
                    };
                    this._openPopup(config).then((result: string | Error) => {
                        if (result instanceof Error) {
                            reject(result);
                        }
                        if (config.isPortal) {
                            resolve(this._popupId);
                        }
                    });
                    if (this.isShowing()) {
                        resolve(this._popupId);
                    }
                };
                if (config.isCompoundTemplate) {
                    BaseOpenerUtil.loadCompatibleLayer(() => {
                        openPopup();
                    });
                } else {
                    openPopup();
                }
            });
        };

        if (GlobalController.getController()) {
            return callback();
        }

        return this._loadController().then(() => {
            return callback();
        });
    }

    /**
     * Метод закрытия окна.
     * @param {String} popupId
     * @remark
     * В случае, если в аргументы ничего не передали, закроет окно, открытой из текущего экземлпяра.
     */
    close(popupId?: string): void {
        GlobalController.getController()?.remove(popupId || this._popupId);
        this._popupId = null;
    }

    /**
     * Проверка, открыто ли окно.
     */
    isOpened(): boolean {
        return !!GlobalController.getController()?.find(this._popupId);
    }

    /**
     * Проверка, отображается ли окно.
     * @remark
     * Отличие от метода isOpener в том, что isShowing так же проверит состояние жизненного цикла окна.
     * Окна которые еще не успели отобразиться или уже уничтожились, не пройдут фильтрацию.
     */
    isShowing(): boolean {
        const popup = GlobalController.getController()?.find(this._popupId);
        if (popup) {
            return [
                popup.controller.POPUP_STATE_CREATED,
                popup.controller.POPUP_STATE_UPDATED,
                popup.controller.POPUP_STATE_UPDATING,
                popup.controller.POPUP_STATE_START_DESTROYING,
            ].includes(popup.popupState);
        }
        return false;
    }

    /**
     * Метод уничтожения экземлпяра класса.
     * @remark
     * Используется во время уничтожения компонента, в котором был инициализирован.
     */
    destroy(): void {
        if (this.isOpened()) {
            this.close();
        }
        this._hideIndicator();
        this._popupId = null;
    }

    getPopupId(): string | null {
        return this._popupId;
    }

    protected _setPopupId(popupOptionsId: string): void {
        if (!this._popupId) {
            if (popupOptionsId) {
                this._popupId = popupOptionsId;
            } else {
                this._popupId = randomId('popup-');
            }
        }
    }

    private _loadController(): Promise<void> {
        // Инициализируем контроллер во время первого построения
        return import('Controls/popupTemplateStrategy').then(({ Controller }) => {
            if (!GlobalController.getController()) {
                new Controller().init();
            }
        });
    }

    private _openAdaptivePopup(popupOptions: IBasePopupOptions): Promise<string | void> {
        return import('Controls/popup').then((popup) => {
            const viewMode = popupOptions.adaptiveOptions?.viewMode;
            const desktopMode = getAdaptiveDesktopMode(viewMode, this._adaptiveOptions.defaultMode);
            return this._getSlidingPanelOpener(popup)
                .open({
                    template: this._options.template,
                    ...popupOptions,
                    ...popupOptions.adaptiveOptions,
                    templateOptions: {
                        ...this._options.templateOptions,
                        ...popupOptions.templateOptions,
                    },
                    slidingPanelOptions: {
                        desktopMode,
                        ...popupOptions,
                        ...this._adaptiveOptions.slidingPanelOptions,
                        ...popupOptions.slidingPanelOptions,
                    },
                })
                .then((id) => {
                    return (this._popupId = id);
                });
        });
    }

    protected _getSlidingPanelOpener(popup): {
        open: (unknown) => Promise<string>;
    } {
        if (!this._slidingPanelOpener) {
            this._slidingPanelOpener = new popup.SlidingPanelOpener();
        }
        return this._slidingPanelOpener;
    }

    protected _openPopup(config: IBasePopupOptions): Promise<string> {
        const openPromise = openPopup(config, this._controller);
        this._openPromise.push(openPromise);
        openPromise
            .then((result: string | Error) => {
                if (!(result instanceof Error)) {
                    const index = this._openPromise.indexOf(openPromise);
                    if (index > -1) {
                        this._openPromise.splice(index, 1);
                    }
                } else {
                    this._hideIndicator();
                }
            })
            .catch(() => {
                this._hideIndicator();
            });
        return openPromise;
    }

    protected _isAdaptive(popupOptions: IBasePopupOptions): boolean {
        return false;
    }

    protected _openHandler(): void {
        this._hideIndicator();
    }

    protected _closeHandler(): void {
        this._hideIndicator();
        // Защита. Могут позвать close и сразу open. В этом случае мы
        // инициируем закрытие окна, откроем новое и после стрельнет onCLose, который очистит id нового окна.
        // В итоге повторый вызов метода close ничего не сделает, т.к. popupId уже почищен.
        if (!this.isOpened()) {
            this._popupId = null;
        }
    }

    private _hideIndicator(): void {
        if (this._indicatorId) {
            IndicatorOpener.hide(this._indicatorId);
            this._indicatorId = null;
        }
    }

    private _showIndicator(config: IBasePopupOptions): void {
        // Если окно уже открыто или открывается, новые обработчики не создаем
        const popupItem = config.id && GlobalController.getController()?.find(config.id);
        if (popupItem) {
            config._events = popupItem.popupOptions._events;
        } else {
            const indicatorConfig = BaseOpenerUtil.getIndicatorConfig(null, config);
            this._indicatorId = IndicatorOpener.show(indicatorConfig);
        }
    }
}
