/**
 * @kaizen_zone 26dca2da-6261-4215-a9df-c822621bceb3
 */
/**
 * Интерфейс для доступа к источнику данных, который возвращает данные в формате, необходимом для контрола Controls.Tumbler.
 *
 * @public
 */
export interface ITumblerItem {
    [key: string]: unknown;

    /**
     * Определяет, может ли пользователь изменить значение контрола. См. {@link UICore/Base:Control#readOnly подробнее}.
     */
    readonly?: boolean;
    /**
     * Текст кнопки элемента. См. {@link Controls/interface:ICaption#caption подробнее}.
     */
    caption?: string;
    /**
     * Определяет, имеет ли кнопка элемента фон. См. {@link Controls/buttons:IButton#contrastBackground подробнее}.
     */
    contrastBackground?: boolean;
    /**
     * Данные для счетчика.
     */
    mainCounter?: string;
    /**
     * Определяет стиль счетчика.
     */
    mainCounterStyle?: string;
}
