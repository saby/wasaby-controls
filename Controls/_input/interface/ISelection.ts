/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
export interface ISelectionOptions {
    selectionStart: number;
    selectionEnd: number;
}

/**
 * Интерфейс для контролов, которые поддерживают выделения текста в поле ввода.
 * @remark
 * Если значения {@link selectionStart} и {@link selectionEnd} равны, то текст не выделяется, но значение указывает на положение каретки внутри поля.
 *
 * @interface Controls/_input/interface/ISelection
 * @public
 */
export interface ISelection {
    readonly '[Controls/input/interface:ISelection]': boolean;
}

/**
 * @name Controls/_input/interface/ISelection#selectionStart
 * @cfg {Number} Начало выделения области текста в поле ввода.
 * Значение указывает на порядковый номер первого символа в выделенном фрагменте относительно всего текста.
 * @demo Controls-demo/Input/Selection/Index
 */
/**
 * @name Controls/_input/interface/ISelection#selectionEnd
 * @cfg {Number} Конец выделения области текста в поле ввода.
 * Значение указывает на порядковый номер последнего символа в выделенном фрагменте относительно всего текста.
 * @demo Controls-demo/Input/Selection/Index
 */
