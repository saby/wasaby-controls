/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
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
}
