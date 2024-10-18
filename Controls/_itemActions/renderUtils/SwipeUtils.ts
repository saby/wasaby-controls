import { IAction, IItemAction, TActionCaptionPosition } from 'Controls/interface';
import { TActionAlignment } from 'Controls/_itemActions/interface/IItemActionsTemplateConfig';
import { ISwipeConfig } from 'Controls/_display/Collection';
import { verticalMeasurer } from 'Controls/_itemActions/measurers/VerticalMeasurer';
import { horizontalMeasurer } from 'Controls/_itemActions/measurers/HorizontalMeasurer';
import { IShownItemAction } from 'Controls/_itemActions/interface/IItemActionsObject';
import { getIcon, isSVGIcon } from 'Controls/Utils/Icon';
import { DEFAULT_ICON_STYLE } from '../constants';
import { ActionsStyleUtils } from './ActionsStyleUtils';
import { ActionsMapUtils } from './ActionsMapUtils';

interface IPrepareSwipeConfigParams {
    // Список операций над записью.
    itemActions: IAction[];
    // Видимость кнопки меню, - в идимая всегда или в зависимости от ширины экрана.
    menuButtonVisibility?: 'visible' | 'adaptive';
    actionsContainerWidth?: number;
    actionsContainerHeight?: number;
    // Функция обратного вызова для определения видимости опций записи.
    itemActionVisibilityCallback?: (action: IAction) => boolean;
    actionAlignment: TActionAlignment;
    actionCaptionPosition?: TActionCaptionPosition;
    theme?: string;
}

/**
 * Настройка параметров отображения кнопки, которая показывается в динамическом свайпе
 * при itemActionsPosition === 'inside'.
 * ItemAction с этими опциями передаётся в шаблон без дальнейших изменений.
 * @param action
 * @private
 */
function prepareSwipeAction(action: IItemAction): IShownItemAction {
    const shownAction: IShownItemAction = ActionsMapUtils.cloneAction(action);
    shownAction.isSVGIcon = isSVGIcon(shownAction.icon);
    shownAction.icon = getIcon(shownAction.icon);
    shownAction.iconStyle =
        shownAction.viewMode === 'filled'
            ? DEFAULT_ICON_STYLE
            : ActionsStyleUtils.getIconStyle(shownAction);
    return shownAction;
}

function needsHorizontalMeasurement(config: ISwipeConfig): boolean {
    const actionsObject = config.itemActions;
    return !!actionsObject && actionsObject.showed?.length === 1 && actionsObject.all?.length > 1;
}

function calculateSwipeConfig({
    itemActions,
    actionAlignment,
    actionsContainerWidth,
    actionsContainerHeight,
    actionCaptionPosition,
    menuButtonVisibility,
    theme = 'default',
}: IPrepareSwipeConfigParams): ISwipeConfig {
    const measurer = actionAlignment === 'vertical' ? verticalMeasurer : horizontalMeasurer;
    const config: ISwipeConfig = measurer.getSwipeConfig(
        itemActions,
        actionsContainerWidth,
        actionsContainerHeight,
        actionCaptionPosition,
        menuButtonVisibility,
        theme
    );
    config.needTitle = measurer.needTitle;
    config.needIcon = measurer.needIcon;
    config.actionAlignment = actionAlignment;
    return config;
}

function prepareSwipeConfig(params: IPrepareSwipeConfigParams): ISwipeConfig {
    let visibleActions = params.itemActionVisibilityCallback
        ? params.itemActions.filter((action) => {
              return params.itemActionVisibilityCallback(action);
          })
        : params.itemActions;

    let swipeConfig = calculateSwipeConfig({ ...params, itemActions: visibleActions });

    if (params.actionAlignment !== 'horizontal' && needsHorizontalMeasurement(swipeConfig)) {
        swipeConfig = calculateSwipeConfig({
            ...params,
            itemActions: visibleActions,
            actionAlignment: 'horizontal',
        });
    }

    if (swipeConfig.itemActions) {
        visibleActions = swipeConfig.itemActions.showed || [];
        swipeConfig.itemActions.showed = visibleActions.map(prepareSwipeAction);

        if (swipeConfig.twoColumns) {
            swipeConfig.twoColumnsActions = [
                [visibleActions[0], visibleActions[1]],
                [visibleActions[2], visibleActions[3]],
            ];
        }
    }

    return swipeConfig;
}

export const SwipeUtils = {
   prepareSwipeConfig
};
