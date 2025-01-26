/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { DOMUtil } from 'Controls/sizeUtils';
import { IItemAction, TActionCaptionPosition } from 'Controls/interface';
import { IMeasurer, TSwipeItemActionsSize } from '../interface/IMeasurer';
import { IShownItemAction } from '../interface/IItemActionsObject';
import { MeasurerUtils } from './MeasurerUtils';
import { ISwipeActionTemplateConfig } from '../interface/ISwipeActionTemplateConfig';
import { ActionsMapUtils } from '../renderUtils/ActionsMapUtils';

import SwipeActionTemplate from '../resources/templatesReact/SwipeAction';

const MAX_ACTIONS_COUNT = 3;
const HEIGHT_LOWER_BOUND_WITH_TITLE = 58;
const HEIGHT_LOWER_BOUND_WITHOUT_TITLE = 38;

type ActionCaptionPosition = Exclude<TActionCaptionPosition, 'right'>;

class HorizontalMeasurer implements IMeasurer {
    private constructor() {}

    getSwipeConfig(
        actions: IItemAction[],
        rowWidth: number,
        rowHeight: number,
        actionCaptionPosition: ActionCaptionPosition,
        menuButtonVisibility: 'visible' | 'adaptive',
        theme: string
    ): ISwipeActionTemplateConfig {
        const actualActions: IItemAction[] = MeasurerUtils.getActualActions(actions);
        let visibleActions: IItemAction[] = [];
        const actionTemplateConfig = this._getActionTemplateConfig(
            rowHeight,
            actionCaptionPosition,
            theme
        );

        if (actualActions.length) {
            visibleActions = HorizontalMeasurer._calculateVisibleActions(
                actualActions,
                menuButtonVisibility,
                rowWidth,
                actionTemplateConfig,
                theme
            );
        } else if (menuButtonVisibility === 'visible') {
            visibleActions = [HorizontalMeasurer._getMenuItemAction()];
        }

        return {
            itemActionsSize: actionTemplateConfig.itemActionsSize,
            itemActions: {
                all: actions,
                showed: visibleActions,
            },
            paddingSize: actionTemplateConfig.paddingSize,
            needIcon: actionTemplateConfig.needIcon,
            needTitle: actionTemplateConfig.needTitle,
            actionCaptionPosition: actionTemplateConfig.actionCaptionPosition,
        };
    }

    needIcon(
        action: IItemAction,
        actionCaptionPosition: ActionCaptionPosition,
        hasActionWithIcon: boolean = false
    ): boolean {
        return !!action.icon || (hasActionWithIcon && actionCaptionPosition !== 'none');
    }

    needTitle(action: IItemAction, actionCaptionPosition: ActionCaptionPosition): boolean {
        return !action.icon || (actionCaptionPosition !== 'none' && !!action.title);
    }

    /**
     * Возвращает конфиг для шаблона swipeAction, необходимый для измерения ширины опций записи
     * @param rowHeight
     * @param actionCaptionPosition
     * @param theme
     * @private
     */
    private _getActionTemplateConfig(
        rowHeight: number,
        actionCaptionPosition: ActionCaptionPosition,
        theme: string
    ): ISwipeActionTemplateConfig {
        return {
            itemActionsSize: HorizontalMeasurer._getItemActionsSize(
                rowHeight,
                actionCaptionPosition
            ),
            paddingSize: 'm',
            needIcon: this.needIcon,
            needTitle: this.needTitle,
            actionCaptionPosition,
            actionAlignment: 'horizontal',
            theme,
        };
    }

    private static instance: HorizontalMeasurer;

    static getInstance(): HorizontalMeasurer {
        if (!HorizontalMeasurer.instance) {
            HorizontalMeasurer.instance = new HorizontalMeasurer();
        }

        return HorizontalMeasurer.instance;
    }

    /**
     * Возвращает кнопку Ещё
     * @private
     */
    private static _getMenuItemAction(): IShownItemAction {
        return ActionsMapUtils.getMenuButton(undefined, true);
    }

    /**
     * Вычисляет горизонтальный размер одной опции свайпа.
     * @param itemAction видимая по свайпу опция записи
     * @param templateConfig настройки шаблона для виртуальной отрисовки ItemAction
     * @param theme Тема оформления
     */
    private static _calculateActionSize(
        itemAction: IItemAction,
        templateConfig: ISwipeActionTemplateConfig,
        theme: string
    ): number {
        return this._calculateActionsSizes([itemAction], templateConfig, theme)[0];
    }

    /**
     * Вычисляет горизонтальные размеры опций свайпа с учётом размеров блока, в который они завёрнуты.
     * @param itemActions видимые по свайпу опции записи
     * @param templateConfig настройки шаблона для виртуальной отрисовки ItemAction
     * @param theme Тема оформления
     */
    private static _calculateActionsSizes(
        itemActions: IItemAction[],
        templateConfig: ISwipeActionTemplateConfig,
        theme: string
    ): number[] {
        // Если в доступных для показа опциях есть те, у которых есть иконки, ставим соответствующий параметр в конфиг
        if (
            itemActions.some((action: IItemAction) => {
                return !!action.icon;
            })
        ) {
            templateConfig.hasActionWithIcon = true;
        }
        const elements = itemActions.map((action) => {
            return {
                component: SwipeActionTemplate,
                props: {
                    ...templateConfig,
                    action,
                },
            };
        });
        return DOMUtil.getElementsWidth(
            elements,
            'controls-Swipe__action',
            true,
            `controls_list_theme-${theme}`
        );
    }

    /**
     * Запрашивает горизонтальные размеры и возвращает на их основе массив видимых опций свайпа
     * @param actions все опции свайпа
     * @param menuButtonVisibility Видимость кнопки ещё
     * @param rowWidth ширина контейнера для отображения опций свайпа
     * @param templateConfig настройки шаблона для виртуальной отрисовки ItemAction
     * @param theme
     */
    private static _calculateVisibleActions(
        actions: IItemAction[],
        menuButtonVisibility: 'visible' | 'adaptive',
        rowWidth: number,
        templateConfig: ISwipeActionTemplateConfig,
        theme: string
    ): IItemAction[] {
        // По стандарту, показываем не более трёх опций в свайпе.
        // Кроме всего прочего, это позволит не производить слишком много вычислений с DOM
        const itemActions = MeasurerUtils.sliceAndFixActions(actions, MAX_ACTIONS_COUNT);
        const menuItemAction = HorizontalMeasurer._getMenuItemAction();
        let visibleActions: IItemAction[] = [];
        // Если не указана ширина, то не будем ничего считать, а выведем всё только по MAX_ACTIONS_COUNT.
        if (rowWidth) {
            const itemActionsContainerWidth = DOMUtil.getWidthForCssClass(
                'controls-Swipe_horizontal'
            );
            const itemActionsSizes = this._calculateActionsSizes(
                itemActions,
                templateConfig,
                theme
            );
            let availableWidth = rowWidth - itemActionsContainerWidth;
            let menuActionSize = 0;

            // Если всего было передано лишь 3 опции или меньше, и видимость кнопки "ещё" не "visible",
            // то сначала считаем без учёта её ширины, иначе расчёт будет некорректным и даже
            // в случае, когда все опции записи должны бы по своей ширине уместиться в контейнер им может добавляться
            // кнопка "ещё"
            if (menuButtonVisibility !== 'visible' && itemActions.length === actions.length) {
                visibleActions = this._fillVisibleActions(
                    itemActions,
                    itemActionsSizes,
                    availableWidth
                );
            }
            // Если кнопка "ещё" всё-таки нужна, то считаем, учитывая её ширину
            if (menuButtonVisibility === 'visible' || visibleActions.length < itemActions.length) {
                menuActionSize = this._calculateActionSize(menuItemAction, templateConfig, theme);
                availableWidth -= menuActionSize;
                visibleActions = this._fillVisibleActions(
                    itemActions,
                    itemActionsSizes,
                    availableWidth
                );
                visibleActions.push(menuItemAction);
            }
        } else {
            visibleActions = itemActions;
            if (menuButtonVisibility === 'visible' || visibleActions.length < actions.length) {
                visibleActions.push(menuItemAction);
            }
        }
        return visibleActions;
    }

    /**
     * Вычисляет на основе горизонтальных размеров видимые операции над записью.
     * @param itemActions
     * @param itemActionsSizes
     * @param containerWidth
     * @private
     */
    private static _fillVisibleActions(
        itemActions: IItemAction[],
        itemActionsSizes: number[],
        containerWidth: number
    ): IItemAction[] {
        const visibleActions: IItemAction[] = [];
        let currentWidth: number = containerWidth;
        itemActions.every((action, index) => {
            currentWidth -= itemActionsSizes[index];
            if (currentWidth < 0) {
                return false;
            }
            visibleActions.push(action);
            return true;
        });

        return visibleActions;
    }

    private static _getItemActionsSize(
        rowHeight: number,
        actionCaptionPosition: ActionCaptionPosition
    ): TSwipeItemActionsSize {
        if (actionCaptionPosition !== 'none') {
            return rowHeight < HEIGHT_LOWER_BOUND_WITH_TITLE ? 'm' : 'l';
        } else {
            return rowHeight < HEIGHT_LOWER_BOUND_WITHOUT_TITLE ? 'm' : 'l';
        }
    }
}

export const horizontalMeasurer = HorizontalMeasurer.getInstance();
