/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
export interface IResizingOptions {
    /**
     * Шаг, с которым будет происходить смещение
     * @default 1
     */
    step?: number;
    /**
     * Определяет позицию области ресайза
     * @variant left-top
     * @variant right-top
     * @variant left-bottom
     * @variant right-bottom
     * @variant right
     * @variant bottom
     * @default right-top
     */
    position?: string;
}

/**
 * Интерфейс для окон с ресайзом.
 *
 * @interface Controls/_popupTemplate/interface/IResize
 * @public
 */
export interface IResizeOptions {
    resizable?: boolean;
    resizingOptions?: IResizingOptions;
}

/**
 * @name Controls/_popupTemplate/interface/IResize#resizable
 * @cfg {boolean} Определяет возможность изменения размера окна
 * @default false
 * @demo Controls-demo/Popup/Dialog/Resizable/Index
 */

/**
 * @name Controls/_popupTemplate/interface/IResize#resizingOptions
 * @cfg {IResizingOptions} Дополнительные опции для изменения размеров окна
 * @demo Controls-demo/Popup/Dialog/ResizingOptions/Index
 */
