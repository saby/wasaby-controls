/**
 * @kaizen_zone 2a31278f-f868-4f4f-9ef4-3e21a7f9f586
 */
import {
    IBorderVisibility,
    TBorderVisibility,
} from 'Controls/_input/interface/IBorderVisibility';
import { descriptor } from 'Types/entity';

/**
 * @typedef {String} Controls/_input/interface/IBorderVisibilityArea/TBorderVisibilityArea
 * @variant partial
 * @variant hidden
 * @variant bottom
 */
export type TBorderVisibilityArea = TBorderVisibility | 'bottom';

export interface IBorderVisibilityArea extends IBorderVisibility {
    borderVisibility: TBorderVisibilityArea;
}

export function getOptionBorderVisibilityAreaTypes(): object {
    return {
        borderVisibility: descriptor<string>(String).oneOf([
            'partial',
            'hidden',
            'bottom',
        ]),
    };
}

/**
 * Интерфейс для многострочного поля ввода, которое поддерживают разное количество видимых границ.
 * @interface Controls/_input/interface/IBorderVisibilityArea
 * @public
 */
export interface IBorderVisibilityArea {
    readonly '[Controls/interface/IBorderVisibilityArea]': boolean;
}

/**
 * @name Controls/_input/interface/IBorderVisibilityArea#borderVisibility
 * @cfg {Controls/_input/interface/IBorderVisibilityArea/TBorderVisibilityArea.typedef} Видимость границ контрола.
 * @default partial
 * @demo Controls-demo/Input/Area/BorderVisibility/Index
 */
