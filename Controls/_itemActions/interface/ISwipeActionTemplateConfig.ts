/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { TActionCaptionPosition } from 'Controls/interface';
import type { ISwipeConfig, TAnimationState } from 'Controls/display';

export interface ISwipeActionTemplateConfig extends ISwipeConfig {
    actionCaptionPosition?: TActionCaptionPosition;
    actionAlignment?: 'horizontal' | 'vertical';
    hasActionWithIcon?: boolean;
    swipeAnimation: TAnimationState;
}
