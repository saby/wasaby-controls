export type TIcon = string;

/**
 * Интерфейс для метки с иконкой
 * @public
 */
export type TOuterIconLabel = {
    /**
     * Определяет иконку для метки
     */
    icon: TIcon;
};

/**
 * Интерфейс для метки с текстом
 * @public
 */
export type TOuterTextLabel = {
    /**
     * Определяет текст для метки
     */
    label: string;
    /**
     * Определяет расположение метки
     */
    labelPosition: 'top' | 'start';
};

/**
 * Интерфейс для прыгабщей метки
 * @public
 */
export type TInnerLabel = {
    /**
     * Определяет будет ли метка прыгающей
     */
    jumping: boolean;
};

/**
 * Интерфейс для метки, которая располагается справа/слева от компонента
 * @public
 */
export type TCaptionLabel = {
    /**
     * Определяет расположение метки
     */
    labelPosition: 'captionStart' | 'captionEnd';
    /**
     * Определяет текст для метки
     */
    label: string;
};
