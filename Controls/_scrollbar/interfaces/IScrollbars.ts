/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */

type TDirection = 'vertical' | 'horizontal';

/**
 * Опции для задания скроллбару отступа в начале и в конце.
 * @interface Controls/scrollbar:IScrollbarPadding
 * @public
 */
interface IScrollbarPadding {
    /**
     * @cfg {boolean} Отступ в начале скроллбара.
     * @default false
     * @see right
     */
    start?: boolean;
    /**
     * @cfg {boolean} Отступ в конце скроллбара.
     * @default false
     */
    end?: boolean;
}

/**
 * Интерфейс для контролов, реализующих скролбар.
 * @interface Controls/scrollbar:IScrollbar
 * @public
 */
export interface IScrollbars {
    /**
     * @name Controls/_scrollbar/Scrollbar#position
     * @cfg {Number} Позиция ползунка спроецированная на контент.
     */
    position?: number;

    /**
     * @name Controls/_scrollbar/Scrollbar#contentSize
     * @cfg {Number} Размер контента на который проецируется тонкий скролл.
     * @remark Не может быть меньше размера контейнера или 0
     */
    contentSize: number;

    /**
     * @name Controls/_scrollbar/Scrollbar#direction
     * @cfg {String} Направление скроллбара
     * @variant vertical вертикальный скроллбар.
     * @variant horizontal горизонтальный скроллбар.
     * @default vertical
     */
    direction?: TDirection;

    /**
     * @name Controls/_scrollbar/Scrollbar#paddings
     * @cfg {Controls/scrollbar:IScrollbarPadding} Конфигурация отступов скроллбара.
     * @remark
     * Если у вас вертикальный и горизонтальный скроллбар установите данную опцию каждому из них, чтобы скроллбары в крайних положениях не пересекались.
     */
    paddings?: IScrollbarPadding;

    /**
     * @name Controls/_scrollbar/Scrollbar#style
     * @cfg {String} Цветовая схема контейнера. Влияет на цвет тени и полоски скролла. Используется для того чтобы контейнер корректно отображался как на светлом так и на темном фоне.
     * @variant normal стандартная схема
     * @variant inverted противоположная схема
     */
    style?: string;
}

export default IScrollbars;
