import type { Path } from 'Controls/dataSource';
import type { Model } from 'Types/entity';
import { copyStateWithItems, IStateWithItems } from '../_abstractListAspect/common/IStateWithItems';

export interface IPathState extends IStateWithItems {
    breadCrumbsItems: Path;
    breadCrumbsItemsWithoutBackButton: Path;
    backButtonItem?: Model;
    displayProperty?: string;
    backButtonCaption: string;
}

export function copyPathState({
    displayProperty,
    backButtonCaption,
    backButtonItem,
    breadCrumbsItemsWithoutBackButton,
    breadCrumbsItems,
    ...state
}: IPathState): IPathState {
    return {
        ...copyStateWithItems(state),
        displayProperty,
        backButtonCaption,
        backButtonItem,
        breadCrumbsItemsWithoutBackButton,
        breadCrumbsItems,
    };
}
