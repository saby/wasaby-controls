/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { descriptor } from 'Types/entity';

/**
 * @typedef {String} Controls/_input/interface/IBorderVisibility/TBorderVisibility
 * @variant partial Видна нижняя граница
 * @variant hidden Границы не видны
 */
export type TBorderVisibility = 'partial' | 'hidden';

export interface IBorderVisibilityOptions {
    borderVisibility?: TBorderVisibility;
}

export function getDefaultBorderVisibilityOptions(): Partial<IBorderVisibilityOptions> {
    return {
        borderVisibility: 'partial',
    };
}

export function getOptionBorderVisibilityTypes(): object {
    return {
        borderVisibility: descriptor<string>(String).oneOf(['partial', 'hidden', 'visible']),
    };
}
/**
 * Интерфейс для контролов, которые поддерживают разное количество видимых границ.
 * @public
 */
export interface IBorderVisibility {
    readonly '[Controls/interface/IBorderVisibility]': boolean;
}

/**
 * @name Controls/_input/interface/IBorderVisibility#borderVisibility
 * @cfg {Controls/_input/interface/IBorderVisibility/TBorderVisibility.typedef} Видимость границ контрола.
 * @default partial
 * @demo Controls-demo/Input/BorderVisibility/Index
 */
