/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import { Logger } from 'UI/Utils';
import { TIconStyle, TItemActionsSize } from 'Controls/interface';
import { TButtonStyle } from 'Controls/buttons';
import { IShownItemAction } from './interface/IItemActionsObject';
import { DEFAULT_BUTTON_STYLE, DEFAULT_ICON_STYLE, TItemActionShowType } from './constants';
import rk = require('i18n!Controls');

const deprecatedStyles = {
    error: 'danger',
    done: 'success',
    attention: 'warning',
    default: 'secondary',
};

/**
 * Идентификатор кнопки открытия меню
 */
export const MENU_BUTTON_KEY = 'controls-default-menu-action';

export class Utils {
    static getMenuButton(
        iconSize?: TItemActionsSize,
        isSwipeActions: boolean = false
    ): IShownItemAction {
        return {
            id: MENU_BUTTON_KEY,
            icon: isSwipeActions ? 'icon-SwipeMenu' : 'icon-SettingsNew',
            style: DEFAULT_BUTTON_STYLE,
            iconStyle: DEFAULT_ICON_STYLE,
            title: rk('Ещё'),
            showType: TItemActionShowType.TOOLBAR,
            iconSize,
            isMenu: true,
        };
    }

    /**
     * Позволяет сконвертировать старый стиль типа error, attention и тд в актуальный
     * И генерирует предупреждение в консоль, о том, что такой стиль устарел.
     * @param style
     * @param controlName
     * @param defaultStyle Значение по умолчанию
     */
    static getStyle(
        style: TIconStyle | TButtonStyle,
        defaultStyle: TIconStyle | TButtonStyle = 'secondary',
        controlName: string
    ): TIconStyle | TButtonStyle {
        if (!style) {
            return defaultStyle;
        }
        if (style in deprecatedStyles) {
            Logger.warn(
                controlName +
                    ': Используются устаревшие стили.' +
                    'Используйте ' +
                    deprecatedStyles[style] +
                    ' вместо ' +
                    style,
                this
            );
            return deprecatedStyles[style];
        }
        return style;
    }

    /**
     * Позволяет вытащить из icon старый стиль типа icon-error, icon-attention и т.д.
     * И генерирует предупреждение в консоль, о том, что стилизация иконок при помощи таких CSS-классов устарела.
     * @param style
     * @param icon
     * @param controlName
     */
    static getStyleFromIcon(
        style: TIconStyle | TButtonStyle,
        icon: string,
        controlName: string
    ): TIconStyle | TButtonStyle {
        const styleFromIcon =
            icon &&
            Object.keys(deprecatedStyles).find((key) => {
                return icon.indexOf(`icon-${key}`) !== -1;
            });
        if (styleFromIcon) {
            Logger.warn(
                controlName +
                    ': Используются устаревшие стили. ' +
                    'Используйте опцию iconStyle вместо устаревшего CSS класса icon-' +
                    styleFromIcon,
                this
            );
            return deprecatedStyles[styleFromIcon];
        }
        return style;
    }
}
