import { RecordSet } from 'Types/collection';
import { TResultsPosition } from 'Controls/_grid/display/interface/IGridControl';
import { TItemActionsPosition } from 'Controls/_display/Collection';
import { TBottomPaddingMode } from 'Controls/_baseList/BaseControl';

export type TBottomPaddingClass =
    | 'controls-ListViewV__placeholderAfterContent'
    | 'controls-ListView_outside-spacing'
    | 'controls-itemActionsV_outside-spacing'
    | '';

export interface IGetBottomPaddingClassParams {
    items: RecordSet;
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
}

export function getBottomPaddingClass(params: IGetBottomPaddingClassParams): TBottomPaddingClass {
    const {
        hasFooter,
        hasModel,
        hasResults,
        hasPaging,
        items,
        itemActionsPosition,
        bottomPaddingMode,
        resultsPosition,
        hasMoreDown,
        hasHiddenItemsDown,
        hasInfinityNavigation,
        shouldDrawNavigationButton,
        hasDemandNavigation,
        hasCutNavigation,
    } = params;
    if (!hasModel || !items || items.getCount() === 0) {
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
        if (itemActionsPosition === 'outside') {
            return 'controls-itemActionsV_outside-spacing';
        } else {
            if (bottomPaddingMode === 'additional' && !hasPaging) {
                return 'controls-ListView_outside-spacing';
            }
        }
    }

    return '';
}
