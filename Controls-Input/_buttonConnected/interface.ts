export interface IButtonStyle {
    viewMode?: string;
    buttonStyle: string;
    inlineHeight: string;
    fontColorStyle?: string;
    iconStyle?: string;
    fontSize?: string;
    iconSize?: string;
}

/**
 * Интерфейс для настройки иконки
 * @public
 */
export interface IIcon {
    /**
     * Путь до иконки
     */
    uri?: string;
    /**
     * Расположение иконки относительно текста
     */
    captionPosition?: 'start' | 'end';
}

/**
 * Интерфейс для стилевого оформления кнопки, работающей со слайсом формы
 * @public
 */
export interface IBaseButtonProps {
    /**
     * Определяет текст заголовка контрола
     */
    caption?: string;
    tooltip?: string;
    /**
     * Определяет настройку для иконки
     */
    icon?: IIcon;
}

export interface IStyle {
    '.style'?: {
        reference: string;
    };
}
