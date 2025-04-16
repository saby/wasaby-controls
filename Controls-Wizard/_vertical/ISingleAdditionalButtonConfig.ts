/**
 * Интерфейс для настройки кнопок действий в вертикальном мастере настройки.
 * @interface Controls-Wizard/_vertical/ISingleAdditionalButtonConfig
 * @public
 */
export interface ISingleAdditionalButtonConfig {
    /**
     * @name Controls-Wizard/_vertical/ISingleAdditionalButtonConfig#caption
     * @cfg {string} Текст кнопки дополнительного действия.
     * @demo Controls-Wizard-demo/vertical/ActionButtons/Index
     */
    caption: string;

    /**
     * @name Controls-Wizard/_vertical/ISingleAdditionalButtonConfig#clickCallback
     * @cfg {string} Функция-колбэк вызываемая при клике на кнопку.
     * @demo Controls-Wizard-demo/vertical/ActionButtons/Index
     */
    clickCallback?: () => void;

    /**
     * @name Controls-Wizard/_vertical/ISingleAdditionalButtonConfig#isAdaptive
     * @cfg {Boolean} Опция, устанавливающая будет ли отображаться данная кнопка дополнительного действия в адаптивном режиме.
     * @demo Controls-Wizard-demo/vertical/ActionButtons/Index
     */
    isAdaptive?: boolean;
}
