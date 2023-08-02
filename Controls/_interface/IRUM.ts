/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @interface Controls/_interface/IRUM
 * @private
 */

export default interface IRUM {
    readonly '[Controls/_interface/IRUM]': boolean;
}

/**
 * @name Controls/_interface/IRUM#RUMEnabled
 * @cfg {Boolean} Позволяет включить сбор RUM-статистики
 */

/**
 * @name Controls/_interface/IRUM#pageName
 * @cfg {string} Позволяет задать имя страницы при отображении RUM-статистики
 */

export interface IRUMOptions {
    RUMEnabled?: boolean;
    pageName?: string;
}
