import { TResultsPosition } from 'Controls/_grid/display/interface/IGridControl';
import { TItemActionsPosition } from 'Controls/_display/Collection';
import { TBottomPaddingMode } from 'Controls/_baseList/BaseControl';

export type TBottomPaddingClass =
    | 'controls-ListViewV__placeholderAfterContent'
    | 'controls-ListView_outside-spacing'
    | 'controls-itemActionsV_outside-spacing'
    | '';

export interface IGetBottomPaddingClassParams {
    hasItems: boolean;
    hasModel: boolean;
    hasFooter: boolean;
    hasResults: boolean;
    hasPaging: boolean;
    resultsPosition: TResultsPosition;
    itemActionsPosition: TItemActionsPosition;
    bottomPaddingMode?: TBottomPaddingMode;
    hasMoreDown?: boolean;
    hasHiddenItemsDown?: boolean;
    shouldDrawNavigationButton?: boolean;
    hasInfinityNavigation?: boolean;
    hasDemandNavigation?: boolean;
    hasCutNavigation?: boolean;
    isTouch?: boolean;
}

export function getBottomPaddingClass(params: IGetBottomPaddingClassParams): TBottomPaddingClass {
    const {
        hasFooter,
        hasModel,
        hasResults,
        hasPaging,
        hasItems,
        itemActionsPosition,
        bottomPaddingMode,
        resultsPosition,
        hasMoreDown,
        hasHiddenItemsDown,
        hasInfinityNavigation,
        shouldDrawNavigationButton,
        hasDemandNavigation,
        hasCutNavigation,
        isTouch,
    } = params;
    if (!hasModel || !hasItems) {
        return '';
    }
    if (bottomPaddingMode === 'placeholder') {
        return 'controls-ListViewV__placeholderAfterContent';
    }
    if (
        !hasFooter &&
        (!hasResults || resultsPosition !== 'bottom') &&
        ((!hasHiddenItemsDown && !hasMoreDown) || !hasInfinityNavigation) &&
        !(shouldDrawNavigationButton && (hasCutNavigation || hasDemandNavigation)) &&
        bottomPaddingMode !== 'basic'
    ) {
        if (itemActionsPosition === 'outside' && !isTouch) {
            return 'controls-itemActionsV_outside-spacing';
        } else {
            if (bottomPaddingMode === 'additional' && !hasPaging) {
                return 'controls-ListView_outside-spacing';
            }
        }
    }

    return '';
}
