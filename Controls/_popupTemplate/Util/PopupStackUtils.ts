import { Controller, IPopupOptions, IPopupItem } from 'Controls/popup';
import { getSettings } from 'Controls/Application/SettingsController';
import initConstants from './getThemeConstants';
import { constants } from 'Env/Env';

interface IStackSavedConfig {
    width: number;
    minSavedWidth?: number;
    maxSavedWidth?: number;
}

interface IStackItem extends IPopupItem {
    containerWidth: number;
    popupOptions: IPopupOptions;
    minSavedWidth: number;
    maxSavedWidth: number;
}

const RIGHT_PANEL_WIDTH = 54;

const ACCORDION_WIDTH = 54;
const MIN_MAXIMIZED_WIDTH = 899;
const BASE_WIDTH_SIZES: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

function getPopupWidth(propStorageId: string | undefined): Promise<IStackSavedConfig | undefined> {
    return new Promise((resolve) => {
        if (propStorageId) {
            getSettings([propStorageId]).then((storage) => {
                resolve(storage && storage[propStorageId]);
            });
        } else {
            resolve();
        }
    });
}

function getRightPanelWidth() {
    // Вычисляем значение при вызове. Если делать при загрузке модуля,
    // то тема в контроллеры проставиться не успеет и результат будет неверный
    return Controller.hasRightPanel() ? RIGHT_PANEL_WIDTH : 0; // --width_stack-right_panel + borders
}

function initializationConstants(): Promise<void | object> {
    const initConstantsConfig = {
        a: 'margin-right',
        b: 'margin-left',
        c: 'margin-bottom',
        d: 'margin-top',
        e: 'padding-top',
        f: 'padding-right',
        g: 'padding-bottom',
    };
    const constansClassName = `controls-StackTemplate__themeConstants controls_popupTemplate_theme-${Controller.getTheme()}`;
    return initConstants(constansClassName, initConstantsConfig).then((result) => {
        return result;
    });
}

const BASE_WIDTHS_POPUP = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];

function initializationPopupConstants(): Promise<void | object> {
    const initConstantsConfig = {};
    BASE_WIDTHS_POPUP.forEach((item) => {
        initConstantsConfig[item] = `--content_width_${item}_dialog`;
    });
    const constansClassName = `controls_popupTemplate_theme-${Controller.getTheme()}`;
    return initConstants(constansClassName, initConstantsConfig).then((result) => {
        return result;
    });
}

function _getMaximizedState(item: IStackItem, maxPanelWidth: number): boolean {
    if (
        !item.popupOptions.minimizedWidth &&
        item.popupOptions.minWidth &&
        item.popupOptions.maxWidth
    ) {
        const middle = getMiddleWidth(item, maxPanelWidth);
        let width = item.popupOptions.width;
        if (
            maxPanelWidth &&
            width > maxPanelWidth &&
            item.popupOptions.minWidth <= MIN_MAXIMIZED_WIDTH
        ) {
            width = maxPanelWidth;
        }
        return width - middle > 0;
    }
    return item.popupOptions.templateOptions.maximized;
}

function getMiddleWidth(item: IStackItem, maxPanelWidth: number): number {
    if (item.popupOptions.minWidth && item.popupOptions.maxWidth) {
        if (
            item.popupOptions.minWidth > MIN_MAXIMIZED_WIDTH ||
            item.popupOptions.maxWidth < MIN_MAXIMIZED_WIDTH
        ) {
            // Если максимально возможная ширина окна меньше, чем выставлена через опцию, то нужно ориентироваться
            // на неё. Иначе кнопка разворота будет всегда пытаться развернуть окно,
            // которое уже итак максимально широкое.
            let maxWidth = item.popupOptions.maxWidth;
            if (maxPanelWidth) {
                maxWidth = Math.min(item.popupOptions.maxWidth, maxPanelWidth);
            }
            return (item.popupOptions.minWidth + maxWidth) / 2;
        }
        return MIN_MAXIMIZED_WIDTH;
    }
    return 0;
}

function _getMaxPanelWidth(item: IStackItem, isPopup: boolean = true): number {
    // При расчете maximized используем right родительского элемента, чтобы определить состояние относительно
    // ширины рабочей области, а не ширины страницы.
    // Карточка, которая строится в отдельном окне, не имеет зафиксированной позиции, при растяжении постоянно
    // будет менятся right и расчет максимальной ширины будет все время меняться.
    // Поэтому берем минимальное значение из width всей страницы и maxHeight заданный в конфиге.
    if (!isPopup) {
        return document.body.clientWidth - getRightPanelWidth();
    }
}

function getMaximizedState(item: IStackItem, isPopup: boolean = true): boolean {
    if (constants.isServerSide) {
        const { width } = item.popupOptions;
        return width - getMiddleWidth(item, item.popupOptions.maxWidth) > 0;
    }

    return _getMaximizedState(item, _getMaxPanelWidth(item, isPopup));
}

export {
    getRightPanelWidth,
    getPopupWidth,
    IStackSavedConfig,
    IStackItem,
    initializationConstants,
    initializationPopupConstants,
    BASE_WIDTH_SIZES,
    BASE_WIDTHS_POPUP,
    ACCORDION_WIDTH,
    RIGHT_PANEL_WIDTH,
    MIN_MAXIMIZED_WIDTH,
    getMaximizedState,
    getMiddleWidth,
};
