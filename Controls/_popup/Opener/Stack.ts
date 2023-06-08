/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import {
    default as BaseOpener,
    IBaseOpenerOptions,
} from 'Controls/_popup/Opener/BaseOpener';
import {
    IStackOpener,
    IStackPopupOptions,
} from 'Controls/_popup/interface/IStack';
import openPopup from 'Controls/_popup/utils/openPopup';
import CancelablePromise from 'Controls/_popup/utils/CancelablePromise';
import { getConfig } from 'Application/Env';
import getAdaptiveDesktopMode from 'Controls/_popup/utils/getAdaptiveDesktopMode';

interface IStackOpenerOptions extends IStackPopupOptions, IBaseOpenerOptions {}

const getStackConfig = (
    stackOptions: IStackOpenerOptions = {},
    popupId?: string
) => {
    const config = { ...stackOptions };
    // The stack is isDefaultOpener by default.
    // For more information, see  {@link Controls/_interface/ICanBeDefaultOpener}
    config.isDefaultOpener =
        config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
    config._type = 'stack'; // TODO: Compatible for compoundArea
    config.id = config.id || popupId;

    return config;
};
const POPUP_CONTROLLER = 'Controls/popupTemplate:StackController';
const DEFAULT_MODE = 'stack';
/**
 * Контрол, открывающий всплывающее окно с пользовательским шаблоном внутри. Всплывающее окно располагается в правой части контентной области приложения и растянуто на всю высоту экрана.
 * @class Controls/_popup/Opener/Stack
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FPopup%2FOpener%2FStackDemo%2FStackDemo демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/stack/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 * Для открытия стековых окон из кода используйте {@link Controls/popup:StackOpener}.
 * @implements Controls/interface:IPropStorage
 * @implements Controls/popup:IBaseOpener
 * @demo Controls-demo/Popup/Stack/Index
 * @public
 */

/*
 * Component that opens the popup to the right of content area at the full height of the screen.
 * {@link /doc/platform/developmentapl/interface-development/controls/openers/stack/ See more}.
 * @implements Controls/interface:IPropStorage
 * @demo Controls-demo/Popup/Stack/Index
 * @author Ковалев Г.Д.
 * @mixes Controls/popup:IBaseOpener
 * @public
 */
class Stack extends BaseOpener<IStackOpenerOptions> implements IStackOpener {
    readonly '[Controls/_popup/interface/IStackOpener]': boolean;
    protected _slidingPanelOpener;

    protected _getSlidingPanelOpener(popup): unknown {
        if (!this._slidingPanelOpener) {
            this._slidingPanelOpener = new popup.SlidingPanelOpener();
        }
        return this._slidingPanelOpener;
    }

    open(popupOptions: IStackPopupOptions): Promise<string | undefined> {
        const templateOptions = {
            ...this._options?.templateOptions,
            ...popupOptions?.templateOptions,
        };
        const config = this._getStackConfig({
            ...this._options,
            ...popupOptions,
            templateOptions,
        });
        if (getConfig('isAdaptive') && config.allowAdaptive) {
            return import('Controls/popup').then((popup) => {
                return Stack._openSliding(
                    config,
                    this._getSlidingPanelOpener(popup)
                );
            });
        }
        return super.open(config, POPUP_CONTROLLER);
    }

    private _getStackConfig(
        popupOptions: IStackOpenerOptions
    ): IStackOpenerOptions {
        return getStackConfig(popupOptions, this._getCurrentPopupId());
    }

    protected _getIndicatorConfig(): void {
        const baseConfig = super._getIndicatorConfig();
        baseConfig.isGlobal = true;
        return baseConfig;
    }

    static _openSliding(
        popupOptions: IStackPopupOptions,
        opener
    ): Promise<string | undefined> {
        const viewMode = popupOptions.adaptiveOptions?.viewMode;
        const desktopMode = getAdaptiveDesktopMode(viewMode, DEFAULT_MODE);
        return opener.open({
            ...popupOptions,
            ...popupOptions.adaptiveOptions,
            slidingPanelOptions: {
                desktopMode,
                autoHeight: true,
            },
        });
    }

    static _openPopup(config: IStackPopupOptions): CancelablePromise<string> {
        const newCfg = getStackConfig(config);
        const moduleName = Stack.prototype._moduleName;
        if (getConfig('isAdaptive') && newCfg.allowAdaptive) {
            return import('Controls/popup').then((popup) => {
                const opener = new popup.SlidingPanelOpener();
                return Stack._openSliding(newCfg, opener);
            });
        }
        return openPopup(newCfg, POPUP_CONTROLLER, moduleName);
    }

    static openPopup(config: IStackPopupOptions): Promise<string> {
        const cancelablePromise = Stack._openPopup(config);
        return new Promise((resolve, reject) => {
            cancelablePromise.then(resolve);
            cancelablePromise.catch(reject);
        });
    }

    static closePopup(popupId: string): void {
        BaseOpener.closeDialog(popupId);
    }
}

export default Stack;

/**
 * Статический метод для открытия всплывающего окна. При использовании метода не требуется создавать {@link Controls/popup:Stack} в верстке.
 * @name Controls/_popup/Opener/Stack#openPopup
 * @function
 * @static
 * @deprecated Используйте методы класса {@link Controls/popup:StackOpener}.
 */

/**
 * Статический метод для закрытия всплывающего окна.
 * @name Controls/_popup/Opener/Stack#closePopup
 * @function
 * @static
 * @param {String} popupId Идентификатор окна. Такой идентификатор можно получить при открытии окна методом {@link openPopup}.
 * @deprecated Используйте методы класса {@link Controls/popup:StackOpener}.
 */
