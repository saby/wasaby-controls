/**
 * Интерфейс, определяющий тип номера, который можно ввести в поле ввода.
 * @public
 */
export interface IOnlyMobileOptions {
    /**
     * @cfg {boolean} Ограничивает ввод только мобильными номерами телефона
     * @variant true Только мобильный номер.
     * @variant false Любой номер.
     * @default false
     * @demo Controls-Input-demo/InputConnected/Phone/OnlyMobile
     */
    onlyMobile?: boolean;
}
