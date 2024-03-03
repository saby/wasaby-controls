export type TPopupWidth = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | number;
/**
 * @typedef {TPopupWidth} Controls/_popup/interface/IPopupWidth/TPopupWidth
 * @description Стандартная линейка размеров для ширин окна.
 * Подробнее о значениях переменных для темы {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-23.7000/Controls-default-theme/variables/_popupTemplate.less#L112 online'а}
 * @property {String} a
 * @property {String} b
 * @property {String} c
 * @property {String} d
 * @property {String} e
 * @property {String} f
 * @property {String} g
 * @property {String} h
 * @property {String} i
 * @property {String} j
 * @property {String} k
 * @property {String} l
 * @property {String} m
 * @property {Number} Значение ширины в пикселях
 * @demo Controls-demo/Popup/Sticky/BaseWidthSizes/Index
 */

export interface IPopupWidthOptions {
    width?: TPopupWidth;
}

/**
 * Интерфейс, который используется для установки ширин как в буквенном или числовом варианте.
 *
 * @interface Controls/_popup/interface/IPopupWidth
 * @public
 */
export interface IPopupWidth {
    readonly '[Controls/_popup/interface/IPopupWidth]': boolean;
}
/**
 * @name Controls/_popup/interface/IPopupWidth#width
 * @cfg {Controls/_popup/interface/IPopupWidth/TPopupWidth.typedef} Ширина диалогового окна. Значение
 * может быть указано как в пикселях, так и с помощью стандартной линейки размеров.
 */
