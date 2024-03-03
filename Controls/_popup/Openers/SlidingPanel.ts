import Base from 'Controls/_popup/Openers/Base';
import StackOpener from 'Controls/_popup/Openers/Stack';
import DialogOpener from 'Controls/_popup/Openers/Dialog';
import StickyOpener from 'Controls/_popup/Openers/Sticky';
import {
    ISlidingPanelOptions,
    ISlidingPanelPopupOptions,
} from 'Controls/_popup/interface/ISlidingPanel';
import BaseOpenerUtil from 'Controls/_popup/WasabyOpeners/BaseOpenerUtil';
import { Logger } from 'UI/Utils';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';

const SLIDING_CONTROLLER = 'Controls/popupSliding:Controller';
const SLIDING_STACK_CONTROLLER = 'Controls/popupSliding:StackController';
const DEFAULT_DESKTOP_MODE = 'stack';
const OPENER_BY_DESKTOP_MODE = {
    stack: StackOpener,
    dialog: DialogOpener,
    sticky: StickyOpener,
};

type TDesktopOpener = StackOpener | DialogOpener | StickyOpener;

/**
 * Хелпер для открытия Шторки.
 * @remark Шторка встроена в стандартный набор окон, не нужно использовать компонент как инструмент адаптивности.
 * @implements Controls/popup:ISlidingPanel
 *
 * @demo Controls-demo/Popup/SlidingPanel/Index
 * @public
 */

export default class SlidingPanelOpener extends Base<ISlidingPanelOptions> {
    protected _type: string = 'sliding';

    private _desktopOpener: TDesktopOpener;

    open(popupOptions): Promise<string | void | Error> {
        const adaptivePopupOptions = this._getPopupOptionsWithSizes({...popupOptions, ...this._options});
        const desktopMode = this._getDesktopMode(adaptivePopupOptions);
        this._validateOptions(popupOptions);

        if (this._isMobileMode()) {
            this._controller =
                desktopMode === 'stack' ? SLIDING_STACK_CONTROLLER : SLIDING_CONTROLLER;
            return super.open(adaptivePopupOptions);
        } else {
            return this._getDesktopOpener(desktopMode)
                .open(adaptivePopupOptions)
                .then((id) => {
                    this._popupId = id;
                });
        }
    }

    private _getDesktopOpener(
        desktopMode?: ISlidingPanelPopupOptions['slidingPanelOptions']['desktopMode']
    ): TDesktopOpener {
        const mode = desktopMode || this._getDesktopMode(this._options);
        const OpenerConstructor = OPENER_BY_DESKTOP_MODE[mode];
        if (!this._desktopOpener) {
            this._desktopOpener = new OpenerConstructor();
        }
        return this._desktopOpener;
    }

    private _getDesktopMode(
        popupOptions: ISlidingPanelPopupOptions
    ): ISlidingPanelPopupOptions['slidingPanelOptions']['desktopMode'] {
        return popupOptions?.desktopMode || DEFAULT_DESKTOP_MODE;
    }

    private _isMobileMode(): boolean {
        return this._options?.isAdaptive === false || unsafe_getRootAdaptiveMode().device.isPhone();
    }

    private _getPopupOptionsWithSizes(
        popupOptions: ISlidingPanelPopupOptions
    ): ISlidingPanelPopupOptions {
        const isMobileMode = this._isMobileMode();
        const slidingPanelOptions = {
            position: 'bottom',
            desktopMode: popupOptions.desktopMode || DEFAULT_DESKTOP_MODE,
            ...popupOptions.slidingPanelOptions,
        };
        const options = isMobileMode ? slidingPanelOptions : popupOptions.dialogOptions;
        const mergedConfig = BaseOpenerUtil.getConfig(
            this._options,
            popupOptions
        ) as ISlidingPanelPopupOptions;
        const resultPopupOptions = {
            desktopMode: DEFAULT_DESKTOP_MODE,
            ...mergedConfig,
            ...(options || {}),
            slidingPanelOptions,
            popupOptions,
        };
        resultPopupOptions.templateOptions.adaptiveOptions = popupOptions.adaptiveOptions;

        /*
            Если открываемся на десктопе, то открываемся другим опенером и в контроллер SlidingPanel не попадаем,
            соответственно slidingPanelOptions никто не прокинет, прокидываем сами через templateOptions
         */
        if (!isMobileMode) {
            if (!resultPopupOptions.templateOptions) {
                resultPopupOptions.templateOptions = {};
            }
            resultPopupOptions.templateOptions.slidingPanelOptions = {
                desktopMode: resultPopupOptions.desktopMode,
            };
        }

        return resultPopupOptions;
    }

    private _validateOptions({ slidingPanelOptions }: ISlidingPanelPopupOptions): void {
        const heightList =
            slidingPanelOptions?.heightList || this._options?.slidingPanelOptions?.heightList;
        if (heightList) {
            this._validateHeightList(heightList);
        }
    }

    protected _validateHeightList(heightList: ISlidingPanelOptions['heightList']): void {
        const heightListLength = heightList.length;
        if (heightListLength) {
            if (heightListLength > 1) {
                for (let i = 1; i < heightListLength; i++) {
                    if (heightList[i] <= heightList[i - 1]) {
                        Logger.error(`Controls/popup:SlidingPanel:
                            опция heightList должна содержать список высот отсортированных по возрастанию`);
                        break;
                    }
                }
            }
        } else {
            Logger.error(
                'Controls/popup:SlidingPanel: опция heightList должна содержать хотя бы одно значение'
            );
        }
    }
}
