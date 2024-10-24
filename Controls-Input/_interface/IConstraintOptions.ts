/**
 * Интерфейс, позволяющий проверять наличие определённых символов, введённых в поле ввода.
 * @public
 */
export interface IConstraintOptions {
    /**
     * @cfg {String | RegExp} Фильтр вводимого значения в формате регулярного выражения {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Regular_Expressions#special-character-set [xyz]}.
     * @demo Controls-Input-demo/InputConnected/Text/Constraint
     */
    constraint?: string;
}
