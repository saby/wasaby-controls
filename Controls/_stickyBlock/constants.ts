/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
export const CONTENT_CLASS = 'controls-StickyBlock__content';
import { FixedPosition } from 'Controls/_stickyBlock/types';

/**
 * Константы для StickyBlockReact.
 * @private
 */

export const EMPTY_STICKY_MODEL = {
    offset: {
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
    },
    shadow: {
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: undefined,
    },
    fixedPosition: FixedPosition.None,
    syntheticFixedPosition: {
        fixedPosition: FixedPosition.None,
        prevPosition: FixedPosition.None,
    },
};

export const EMPTY_STICKY_GROUPED_MODEL = {
    ...EMPTY_STICKY_MODEL,
    shadow: {
        top: undefined,
        bottom: undefined,
        left: undefined,
        right: false,
    },
};
