import { ForwardedRef } from 'react';
import { detection } from 'Env/Env';
import { RegisterClass } from 'Controls/event';
import * as React from 'react';

export interface IPopupSettingsController {
    getSettings: Function;
    setSettings: Function;
}

export interface IApplicationProps {
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

    builder?: boolean;
    children?: JSX.Element;
    content?: JSX.Element;
    loadingIndicator: Function;
    forwardedRef: ForwardedRef<HTMLDivElement>;
    theme: string;
    dataLoaderModule: string;
    className: string;
    style: React.CSSProperties;
}
export interface IBodyClassesField {
    scrollingClass: string;
    fromOptions: string;
    themeClass: string;
    bodyThemeClass: string;
}
/**
 * Динамические классы для body
 * */
export const BODY_CLASSES = {
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
/**
 * Отвечает за состояние некоторых классов для <body>.
 * @name Controls/Application/IBodyClassesStateField
 * @private
 * @variant {Boolean} touch регулирует класс ws-is-touch | ws-is-no-touch
 * @variant {Boolean} drag регулирует класс ws-is-drag | ws-is-no-drag
 * @variant {Boolean} hover регулирует класс ws-is-hover | ws-is-no-hover
 */
export interface IBodyClassesStateField {
    touch: boolean;
    drag: boolean;
    hover: boolean;
    verticalResize: boolean;
    horizontalResize: boolean;
    scroll: boolean;
}
export const BODY_CLASSES_STATE: IBodyClassesStateField = {
    touch: false,
    drag: false,
    hover: false,
    verticalResize: false,
    horizontalResize: false,
    scroll: false,
};

export interface IApplicationRegistrars {
    customscroll?: RegisterClass;
    scroll?: RegisterClass;
    controlResize?: RegisterClass;
    mousedown?: RegisterClass;
    mousemove?: RegisterClass;
    mouseup?: RegisterClass;
    touchmove?: RegisterClass;
    touchend?: RegisterClass;
}
