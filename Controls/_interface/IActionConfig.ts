/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */

export interface IActionConfigOptions {
    /**
     * @name Controls/_interface/IActionConfig#action
     * @cfg {String} Определяет данные для действия.
     */
    source: string;
    /**
     * @name Controls/_interface/IActionConfig#action
     * @cfg {*} Определяет набор полей.
     */
    path: string[];
}

/**
 * Интерфейс действия.
 * @interface Controls/_interface/IActionConfig
 *
 * @public
 */
export interface IActionConfig {
    readonly '[Controls/_interface/IActionConfig]': boolean;
}
