/**
 * Интерфейс опции открытия окна с отступом от края экрана
 * @interface Controls/_popup/interface/IEdgeOffset
 * @public
 */
export interface IEdgeOffsetOptions {
    edgeOffset?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
}

/**
 * @typedef {Object} Controls/_popup/interface/IEdgeOffset/EdgeOffset
 * @description Свойства объекта, который передается в опцию {@link edgeOffset}.
 * @property {Number} top Отступ от верхнего края экрана.
 * @property {Number} bottom Отступ от нижнего края экрана.
 * @property {Number} left Отступ от левого края экрана.
 * @property {Number} right Отступ от правого края экрана.
 */

/**
 * @name Controls/_popup/interface/IDialogOpener#edgeOffset
 * @cfg {Controls/_popup/interface/IEdgeOffset/EdgeOffset.typedef} Отступ окна от края экрана.
 * @demo Controls-demo/Popup/Dialog/EdgeOffset/Index
 */
