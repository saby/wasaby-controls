/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */

export type TScrollMode = 'scrollbar' | 'buttons';

/**
 * Различные режимы отображения контейнера прокрутки.
 * @typedef {String} Controls/_scroll/Container/Interface/IScrollMode/THorizontalScrollMode
 * @variant scrollbar Прокрутка при помощи скроллбара
 * @variant custom Без элементов управления прокруткой
 * @variant buttons Прокрутка при помощи кнопок
 */
export type THorizontalScrollMode = TScrollMode & 'custom';

/**
 * Различные режимы отображения контейнера прокрутки.
 * @typedef {String} Controls/_scroll/Container/Interface/IScrollMode/TVerticalScrollMode
 * @variant scrollbar Прокрутка при помощи скроллбара
 * @variant buttons Прокрутка при помощи кнопок
 */
export type TVerticalScrollMode = TScrollMode;

export interface IScrollModeOptions {
    /**
     * @name Controls/_scroll/Container/Interface/IScrollMode#horizontalScrollMode
     * @cfg {THorizontalScrollMode} Режим отображения контейнера прокрутки.
     * @default scrollbar
     * @demo Controls-demo/Scroll/HorizontalScrollMode/Index
     * @remark Значение может быть задано как напрямую через опцию, так и при помощи callback-функции
     * setHorizontalScrollMode(scrollMode), которая прокидывается через контексты.
     */
    horizontalScrollMode: THorizontalScrollMode;

    /**
     * @name Controls/_scroll/Container/Interface/IScrollMode#verticalScrollMode
     * @cfg {TVerticalScrollMode} Режим отображения контейнера прокрутки.
     * @default scrollbar
     * @demo Controls-demo/Scroll/VerticalScrollMode/Index
     */
    verticalScrollMode: TVerticalScrollMode;
}

export function getDefaultOptions(): IScrollModeOptions {
    return {
        horizontalScrollMode: 'scrollbar',
        verticalScrollMode: 'scrollbar',
    };
}

/**
 * Интерфейс для контролов с различными режимами прокрутки элементов
 * @public
 */
export interface IScrollMode {
    readonly '[Controls/_scroll/Container/Interface/IScrollMode]': boolean;
}
