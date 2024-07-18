/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { ISwipeActionTemplateConfig } from './ISwipeActionTemplateConfig';
import { IItemAction, TActionCaptionPosition } from 'Controls/interface';

export interface IMeasurer {
    getSwipeConfig(
        actions: IItemAction[],
        rowWidth: number,
        rowHeight: number,
        actionCaptionPosition: TActionCaptionPosition,
        menuButtonVisibility: 'visible' | 'adaptive',
        theme: string
    ): ISwipeActionTemplateConfig;
    needIcon(
        action: IItemAction,
        actionCaptionPosition: TActionCaptionPosition,
        hasActionWithIcon?: boolean
    ): boolean;
    needTitle(action: IItemAction, actionCaptionPosition: TActionCaptionPosition): boolean;
}

/**
 * @typedef {String} Controls/_itemActions/interface/IMeasurer/TSwipeItemActionsSize
 * Размер иконок опций записи
 * @variant m Средняя.
 * @variant l Большая.
 */
export type TSwipeItemActionsSize = 'l' | 'm';
