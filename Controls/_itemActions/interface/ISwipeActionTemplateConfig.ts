/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import { TActionCaptionPosition } from 'Controls/interface';
import type { ISwipeConfig, TAnimationState } from 'Controls/display';

export interface ISwipeActionTemplateConfig extends ISwipeConfig {
    actionCaptionPosition?: TActionCaptionPosition;
    actionAlignment?: 'horizontal' | 'vertical';
    hasActionWithIcon?: boolean;
    swipeAnimation: TAnimationState;
}
