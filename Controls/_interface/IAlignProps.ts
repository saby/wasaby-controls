/**
 * Значения для горизонтального выравнивания содержимого
 * @typedef {String} THorizontalAlign
 * @variant start Содержимое прижато к началу
 * @variant center Содержимое выровнено по центру ячейки
 * @variant end Содержимое прижато к концу
 */
export type THorizontalAlign = 'left' | 'center' | 'right' | 'start' | 'end';

/**
 * Значения для вертикального выравнивания содержимого
 * @typedef {String} TVerticalAlign
 * @variant start Прижато к верхнему краю ячейки
 * @variant center Содержимое выровнено по центру ячейки
 * @variant end Прижато к нижнему краю ячейки
 * @variant baseline Содержимое ячейки выровнено по базовой линии
 */
export type TVerticalAlign = 'top' | 'center' | 'bottom' | 'baseline' | 'start' | 'end';

export interface IAlignProps {
    /**
     * @cfg {THorizontalAlign} Горизонтальное выравнивание для содержимого ячейки.
     * @default left
     * @variant left По левому краю.
     * @variant center По центру.
     * @variant right По правому краю.
     * @see valign
     */
    halign?: THorizontalAlign;

    /**
     * @cfg {TVerticalAlign} Вертикальное выравнивание для содержимого ячейки.
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
}
