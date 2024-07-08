/**
 * Интерфейс, позволяющий отобразить и сконфигурировать флаг в поле ввода.
 * @public
 */
export interface IFlagVisibleOptions {
    /**
     * Определяет видимость флага.
     * @demo Controls-Input-demo/InputConnected/Phone/FlagPosition
     */
    flagVisible?: boolean;
    /**
     * Определяет расположение флага.
     * @demo Controls-Input-demo/InputConnected/Phone/FlagPosition
     */
    flagPosition?: 'start' | 'end';
}
