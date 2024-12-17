/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IContrastBackgroundOptions {
    contrastBackground?: boolean;
}

/**
 * Интерфейс для контролов, которые поддерживают настройку контрастности фона.
 * @public
 */
export default interface IContrastBackground {
    readonly '[Controls/_interface/IContrastBackground]': boolean;
}

/**
 * @name Controls/_interface/IContrastBackground#contrastBackground
 * @cfg {Boolean} Определяет контрастность фона контрола по отношению к его окружению.
 * @default false
 * @variant true Контрастный фон.
 * @variant false Фон, гармонично сочетающийся с окружением.
 */

/*
 * @name Controls/interface/IContrastBackground#contrastBackground
 * @cfg {Boolean} Determines if control has contrast background.
 * @variant true Control has contrast background.
 * @variant false Control has the harmony background.
 */
