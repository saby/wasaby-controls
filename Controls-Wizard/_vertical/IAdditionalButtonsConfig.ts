import { ISingleAdditionalButtonConfig } from 'Controls-Wizard/_vertical/ISingleAdditionalButtonConfig';

/**
 * Интерфейс для настройки кнопок действий в вертикальном мастере настройки.
 * @interface Controls-Wizard/_vertical/IAdditionalButtonsConfig
 * @public
 */

export interface IAdditionalButtonsConfig {
    /**
     * @name Controls-Wizard/_vertical/IAdditionalButtonsConfig#step
     * @cfg {Number} Номер шага на котором будут располагаться кнопки доп. действия.
     * @demo Controls-Wizard-demo/vertical/ActionButtons/Index
     */
    step?: number;

    /**
     * @name Controls-Wizard/_vertical/IAdditionalButtonsConfig#buttonsConfig
     * @cfg {Array.<Controls-Wizard/vertical:ISingleAdditionalButtonConfig>} Конфигурация для кнопок дополнительного действия.
     * @demo Controls-Wizard-demo/vertical/ActionButtons/Index
     */
    buttonsConfig?: ISingleAdditionalButtonConfig[];
}
