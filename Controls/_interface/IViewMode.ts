/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IViewModeOptions {
    viewMode?: 'filled' | 'outlined';
}

/**
 * Интерфейс для контролов, которые поддерживают настройку контрастности фона.
 * @public
 */
export default interface IViewMode {
    readonly '[Controls/_interface/IViewMode]': boolean;
}

/**
 * @name Controls/_interface/IViewMode#viewMode
 * @cfg {string} Определяет заливку фона контрола по отношению к его окружению.
 * @default filled
 * @variant filled Фон с заливкой.
 * @variant outlined Без заливки.
 */

/*
 * @nameControls/_interface/IViewMode#viewMode
 * @cfg {string} Specifies the background fill of the control in relation to its surroundings.
 * @default filled
 * @variant filled Filled background.
 * @variant outlined No fill.
 */
