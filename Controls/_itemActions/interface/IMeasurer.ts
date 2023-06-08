/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
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
