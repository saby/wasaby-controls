/**
 * @kaizen_zone 26dca2da-6261-4215-a9df-c822621bceb3
 */
/**
 * Интерфейс для доступа к источнику данных, который возвращает данные в формате, необходимом для контрола Controls.Tumbler.
 * @interface Controls/_Tumbler/Interfaces/ITumblerItem
 *
 * @public
 */
export interface ITumblerItem {
    [key: string]: unknown;

    /**
     * Текст кнопки элемента. См. {@link Controls/interface:ICaption#caption подробнее}.
     */
    caption?: string;
    /**
     * Данные для счетчика.
     */
    mainCounter?: string;
    /**
     * Определяет стиль счетчика.
     */
    mainCounterStyle?: string;
    /**
     * Текст всплывающей подсказки, отображаемой при наведении на кнопку элемента
     */
    tooltip?: string;
    /**
     * Определяет иконку кнопки элемента.
     */
    icon?: string;
    /**
     * Определяет размер иконки элемента.
     */
    iconSize?: string;
    /**
     * Определяет стиль иконки элемента.
     */
    iconStyle?: string;
}
