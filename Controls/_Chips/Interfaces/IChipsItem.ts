/**
 * @kaizen_zone 2ef52292-ab33-4291-af7c-c7368f992ce2
 */
/**
 * Интерфейс для доступа к источнику данных, который возвращает данные в формате, необходимом для контрола Controls.Chips.
 *
 * @public
 */
export interface IChipsItem {
    /**
     * Определяет, может ли пользователь изменить значение контрола. См. {@link UICore/Base:Control#readOnly подробнее}.
     */
    readOnly?: boolean;
    /**
     * Текст кнопки элемента. См. {@link Controls/interface:ICaption#caption подробнее}.
     */
    caption?: string;
    /**
     * Счетчик на кнопке элемента.
     */
    counter?: string;
    /**
     * Иконка элемента
     * @demo Controls-demo/toggle/Chips/Icon/Index
     */
    icon?: string;
    /**
     * Размер иконки
     */
    iconSize?: string;
    /**
     * Стиль иконки
     */
    iconStyle?: string;
    /**
     * Шаблон иконки
     * @demo Controls-demo/toggle/Chips/IconTemplate/Index
     */
    iconTemplate?: Function;
    /**
     * Дополнительные опции, которые будут передены в шаблон, который был передан в iconTemplate
     * @see iconTemplate
     */
    iconOptions?: object;
    /**
     * Устанавливает подсказку при наведении на кнопку
     */
    tooltip?: string;
    /**
     * Расположение текста в кнопке
     */
    captionPosition?: string;
}
