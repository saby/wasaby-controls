/**
 * @private
 */
export default interface IPartialSelected {
    /**
     * @cfg {Boolean|undefined} Определяет, какое значение будет передаваться в чекбокс в состоянии множественного выбора.
     * @default undefined
     * @remark В случае если данному полю присвоить значение true, то value чекбокса будет соответствовать значению null.
     * @demo Controls-Colors-demo/ColormarkOpener/DemoWIthNullValueCheckbox/Index
     */
    partialSelected?: boolean;
}
