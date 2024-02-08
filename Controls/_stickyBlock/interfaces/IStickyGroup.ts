/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import {
    StickyGroupMode,
    StickyShadowVisibility,
    StickyVerticalPosition,
} from 'Controls/_stickyBlock/types';

export interface IStickyGroup {
    mode?: StickyGroupMode;
    position?: StickyVerticalPosition;
    offsetTop?: number;
    shadowVisibility?: StickyShadowVisibility;
    onFixed?: Function;
    // опция для оптимизации, позволяет задать свойство сразу, а не после расчета
    fixedPositionInitial?: string;
}
