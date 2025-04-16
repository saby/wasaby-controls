/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { Logger } from 'UI/Utils';
import {
    DEFAULT_BUTTON_STYLE,
    DEFAULT_ICON_STYLE,
    DEFAULT_FUNCTIONAL_BUTTON_STYLE,
} from '../constants';

import type { IAction, TIconStyle } from 'Controls/interface';
import type { TButtonStyle } from 'Controls/buttons';

const deprecatedStyles = {
    error: 'danger',
    done: 'success',
    attention: 'warning',
    default: 'secondary',
};

/**
 * Позволяет сконвертировать старый стиль типа error, attention и тд в актуальный
 * И генерирует предупреждение в консоль, о том, что такой стиль устарел.
 * @param style
 * @param controlName
 * @param defaultStyle Значение по умолчанию
 */
function getStyle(
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
function getStyleFromIcon(
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
                styleFromIcon +
                '. В 24.3100 соместимость будет удалена.',
            this
        );
        return deprecatedStyles[styleFromIcon];
    }
    return style;
}

/**
 * Стиль цвета иконки на кнопке
 * @param action
 * @private
 */
function getIconStyle(action: IAction): TIconStyle {
    const iconStyle = getStyleFromIcon(
        action.iconStyle,
        action.icon,
        'itemActions/Controller'
    ) as TIconStyle;
    return getStyle(iconStyle, DEFAULT_ICON_STYLE, 'itemActions/Controller') as TIconStyle;
}

/**
 * Если кнопка операции отображается в меню или по свайпу, она рендерится не через шаблон кнопки.
 * Ожидается, что цвет иконки будет контрастным по отношению к стандартному статичному фону свайпа или меню.
 * Т.к. иконка в filled может быть светлая на тёмном фоне, принудительно нужно выставить стандартный цвет.
 * Остальным иконкам задаём стиль согласно их настройкам.
 * @param action
 * @private
 */
function getIconStyleForStaticBackground(action: IAction): TIconStyle {
    return action.viewMode === 'filled' ? DEFAULT_ICON_STYLE : getIconStyle(action);
}

/**
 * Стиль цвета кнопки
 * @param action
 * @private
 */
function getButtonStyle(action: IAction): TButtonStyle {
    const defaultStyle =
        action.viewMode === 'filled' ? DEFAULT_FUNCTIONAL_BUTTON_STYLE : DEFAULT_BUTTON_STYLE;
    return getStyle(action.style, defaultStyle, 'itemActions/Controller') as TButtonStyle;
}

export const ActionsStyleUtils = {
    getButtonStyle,
    getIconStyleForStaticBackground,
    getIconStyle,
    getStyle,
};
