/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import { TItemActionsSize } from 'Controls/interface';
import { MeasurerUtils } from './MeasurerUtils';
import { IItemActionsObject } from '../interface/IItemActionsObject';

const ICON_SIZES = {
    m: 24,
    l: 32,
};

const ACTION_PADDINGS = {
    left: 6,
    right: 6,
    top: 0,
    bottom: 0,
};

export function getItemActionSize(
    iconSize: TItemActionsSize,
    alignment: string = 'horizontal'
): number {
    return (
        ICON_SIZES[iconSize] +
        (alignment === 'horizontal'
            ? ACTION_PADDINGS.left + ACTION_PADDINGS.right
            : ACTION_PADDINGS.top + ACTION_PADDINGS.bottom)
    );
}

export function getAvailableActionsCount(
    iconSize: TItemActionsSize,
    availableSize: number
): number {
    const itemActionSize = getItemActionSize(iconSize);
    return Math.floor(availableSize / itemActionSize);
}

export function getActions(
    actions: IItemActionsObject,
    iconSize: TItemActionsSize,
    alignment: string,
    containerSize: number
): IItemActionsObject {
    let showedActions = [];
    const allActions = MeasurerUtils.getActualActions(actions.all);
    const rootActions = allActions.filter((action) => {
        return !action['parent@'];
    });
    const availableActionsCount = getAvailableActionsCount(iconSize, containerSize);
    if (rootActions.length > availableActionsCount || rootActions.length < allActions.length) {
        showedActions = MeasurerUtils.sliceAndFixActions(rootActions, availableActionsCount - 1);
        showedActions.push({
            id: null,
            icon: 'icon-SettingsNew',
            style: 'secondary',
            iconStyle: 'secondary',
            iconSize,
            isMenu: true,
        });
    } else {
        showedActions = MeasurerUtils.sliceAndFixActions(rootActions);
    }
    return {
        all: actions.all,
        showed: showedActions,
    };
}
