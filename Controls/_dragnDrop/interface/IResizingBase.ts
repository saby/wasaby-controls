/**
 * @kaizen_zone b9a403ff-e006-4511-98de-c3f6c764b219
 */

/**
 * Базовый интерфейс для контроллов, позволяющих визуально отображать процесс изменения других контролов при помощи перемещения мыши.
 *
 * @interface Controls/_dragnDrop/interface/IResizingBase
 * @public
 */

export interface IResizingBase {
    maxOffset: number;
    minOffset: number;
    entity?: object;
    position?: string;
    areaStyle: string;
}

/**
 * @name Controls/_dragnDrop/interface/IResizingBase#areaStyle
 * @cfg {String} Определяет стиль области сдвига
 * @remark
 * При указании произвольного значения, необходимо определить класс controls-ResizingLine__area_style-{style}, указан нужный стиль отображения.
 * @default default
 */

/**
 * @name Controls/_dragnDrop/interface/IResizingBase#maxOffset
 * @cfg {Number} Максимальное значение сдвига при изменении значения размера
 * @default 1000
 * @remark
 * Сдвиг больше указанного визуально отображаться не будет. Для возможности сдвига вдоль направления оси maxOffset должен быть > 0
 */

/**
 * @name Controls/_dragnDrop/interface/IResizingBase#minOffset
 * @cfg {Number} Минимальное значение сдвига при изменении значения размера
 * @default 1000
 * @remark
 * Сдвиг меньше указанного визуально отображаться не будет. Для возможности сдвига против направления оси minOffset должен быть < 0
 */

/**
 * @typedef {Object} IEntity
 * @property {boolean} allowAutoscroll Определяет будет ли происходить подскролл, при наведении на верхнюю или нижнюю границу scroll:Container
 */

/**
 * @name Controls/_dragnDrop/interface/IResizingBase#entity
 * @cfg {IEntity} Дополнительные данные для объекта перемещения.
 */
