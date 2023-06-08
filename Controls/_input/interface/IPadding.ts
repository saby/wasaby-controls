/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { descriptor } from 'Types/entity';
/**
 * @typedef {String} THorizontalPadding
 * @variant xs
 * @variant null
 */
export type THorizontalPadding = 'xs' | 'null';

export interface IPaddingOptions {
    horizontalPadding: THorizontalPadding;
}

export function getDefaultPaddingOptions(): Partial<IPaddingOptions> {
    return {
        horizontalPadding: 'null',
    };
}

export function getOptionPaddingTypes(): object {
    return {
        horizontalPadding: descriptor<string>(String).oneOf(['xs', 'null']),
    };
}

/**
 * Интерфейс для контролов, которые поддерживают разные размеры отступов текста от контейнера.
 *
 * @interface Controls/_input/interface/IPadding
 * @public
 */
export interface IPadding {
    readonly '[Controls/interface/IPadding]': boolean;
}
/**
 * @name Controls/_input/interface/IPadding#horizontalPadding
 * @cfg {THorizontalPadding} Размер отступов контрола по горизонтали.
 */
