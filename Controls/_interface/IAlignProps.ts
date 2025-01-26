import { TFontSize } from 'Controls/interface';

/**
 * Значения для горизонтального выравнивания содержимого
 * @typedef THorizontalAlign
 * @variant left Содержимое прижато к началу
 * @variant center Содержимое выровнено по центру ячейки
 * @variant right Содержимое прижато к концу
 */
export type THorizontalAlign = 'left' | 'center' | 'right';

/**
 * Значения для вертикального выравнивания содержимого
 * @typedef TVerticalAlign
 * @variant start Прижато к верхнему краю ячейки
 * @variant center Содержимое выровнено по центру ячейки
 * @variant end Прижато к нижнему краю ячейки
 * @variant baseline Содержимое ячейки выровнено по базовой линии
 * @variant top @deprecated. Прижато к верхнему краю ячейки (используйте значение "start")
 * @variant bottom @deprecated. Прижато к нижнему краю ячейки (используйте значение "end")
 */
export type TVerticalAlign = 'baseline' | 'start' | 'center' | 'end' | 'top' | 'bottom';

export interface IAlignProps {
    /**
     * Горизонтальное выравнивание для содержимого ячейки.
     * @cfg
     * @default left
     * @variant left По левому краю.
     * @variant center По центру.
     * @variant right По правому краю.
     * @see valign
     */
    halign?: THorizontalAlign;

    /**
     * Вертикальное выравнивание для содержимого ячейки.
     * @cfg
     * @default baseline
     * @variant top По верхнему краю.
     * @variant center По центру.
     * @variant bottom По нижнему краю.
     * @variant baseline По базовой линии.
     * @remark
     * См. {@link https://developer.mozilla.org/ru/docs/Web/CSS/align-items align-items}.
     * @see halign
     */
    valign?: TVerticalAlign;

    baseline?: Exclude<TFontSize, 'inherit'> | 'default';
}
