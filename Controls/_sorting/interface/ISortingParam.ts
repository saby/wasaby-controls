/**
 * @kaizen_zone ed546588-e113-4fa9-a709-b37c7f5cc99c
 */
/**
 * Интерфейс опций для конфигурации параметров сортировки.
 * @public
 */
export interface ISortingParam {
    /**
     * @cfg {String|null} Имя поля элемента, по которому может осуществляться сортировка. Чтобы задать сброс сортировки, нужно указать значение null.
     * @remark Если не задан пункт, сбрасывающий сортировку, то необходимо указать непустую конфигурацию сортировки в опции value.
     */
    paramName: string | null;
    /**
     * @cfg {String} Подпись пункта меню, соответствующего данному полю.
     */
    title: string;
    /**
     * @cfg {String} Имя иконки, которая отображается в меню рядом с подписью (см. свойство title),
     * а также в заголовке выпадающего меню. Список иконок можно найти в демо-примере {@link Controls/sorting:SortingSelector}.
     * @default undefined
     * @see iconStyle
     * @see iconSize
     */
    icon: string;
    /**
     * @cfg {String} Стиль иконки.
     * @see icon
     * @see iconSize
     */
    iconStyle?: string;
    /**
     * @cfg {String} Размер иконки.
     * @variant s
     * @variant m
     * @variant l
     * @see icon
     * @see iconStyle
     */
    iconSize?: 's' | 'm' | 'l';
    /**
     * @cfg {String} Подсказка при наведении на стрелку сортировки по возрастанию.
     * @see titleDesc
     */
    titleAsc?: string;
    /**
     * @cfg {String} Подсказка при наведении на стрелку сортировки по убыванию.
     * @see titleAsc
     */
    titleDesc?: string;
}
