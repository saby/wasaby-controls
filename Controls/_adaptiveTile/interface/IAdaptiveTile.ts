/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */

/**
 * Интерфейс для списков, в которых элементы отображаются в виде горизонтальной адаптивной плитки .
 *
 * @interface Controls/_adaptiveTile/interface/IAdaptiveTile
 * @public
 */

interface IOptions {
    minItemHeight: number;
    maxItemHeight: number;
    minItemWidth: number;
    maxItemWidth: number;
    availableHeight: number;
    availableWidth: number;
}

/**
 * @name Controls/_adaptiveTile/interface/IAdaptiveTile#minItemHeight
 * @cfg {Number} Минимальная высота элемента.
 * @remark
 * Меньше данного значения элементы адаптивной плитки не будут сжиматья по высоте. От этого зависит максимальное количество строк.
 * @see maxItemHeight
 * @see minItemWidth
 * @see maxItemWidth
 * @see availableHeight
 * @see availableWidth
 */

/**
 * @name Controls/_adaptiveTile/interface/IAdaptiveTile#maxItemHeight
 * @cfg {Number} Максимальная высота элемента.
 * @remark
 * Больше данного значения элементы адаптивной плитки не будут расширяться по высоте, даже при избытке места.
 * @see minItemHeight
 * @see minItemWidth
 * @see maxItemWidth
 * @see availableHeight
 * @see availableWidth
 */

/**
 * @name Controls/_adaptiveTile/interface/IAdaptiveTile#minItemWidth
 * @cfg {Number} Минимальная ширина элемента.
 * @remark
 * Меньше данного значения элементы адаптивной плитки не будут сжиматья по ширине.
 * @see minItemHeight
 * @see maxItemHeight
 * @see maxItemWidth
 * @see availableHeight
 * @see availableWidth
 */

/**
 * @name Controls/_adaptiveTile/interface/IAdaptiveTile#maxItemWidth
 * @cfg {Number} Максимальная ширина элемента.
 * @remark
 * Больше данного значения элементы адаптивной плитки не будут расширяться по ширине, даже при избытке места.
 * @see minItemHeight
 * @see maxItemHeight
 * @see minItemWidth
 * @see availableHeight
 * @see availableWidth
 */

/**
 * @name Controls/_adaptiveTile/interface/IAdaptiveTile#availableHeight
 * @cfg {Number} Высота контейнера, в котором отображается адаптивная плитка. Элементы располагаются внутри этой высоты с учетом минимальных и максимальных ограничений.
 * @see minItemHeight
 * @see maxItemHeight
 * @see minItemWidth
 * @see maxItemWidth
 * @see availableWidth
 */

/**
 * @name Controls/_adaptiveTile/interface/IAdaptiveTile#availableWidth
 * @cfg {Number} Ширина контейнера, в котором отображается адаптивная плитка. Элементы располагаются внутри этой ширины с учетом минимальных и максимальных ограничений.
 * @see minItemHeight
 * @see maxItemHeight
 * @see minItemWidth
 * @see maxItemWidth
 * @see availableHeight
 */

/**
 * @name Controls/_adaptiveTile/interface/IAdaptiveTile#imageProperty
 * @cfg {String} Имя свойства, содержащего ссылку на изображение для плитки.
 * @default image
 */
