/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
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
 * @public
 */
export interface IActionConfig {
    readonly '[Controls/_interface/IActionConfig]': boolean;
}
