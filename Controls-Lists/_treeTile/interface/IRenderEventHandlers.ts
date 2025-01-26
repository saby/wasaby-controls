/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IAbstractRenderEventHandlers } from 'Controls-Lists/abstractList';
import type { ITreeTileViewOptions } from 'Controls/treeTile';
import type { SyntheticEvent } from 'UICommon/Events';
import type { TreeTileCollectionItem } from 'Controls/treeTile';

export interface ITileRenderEventHandlers
    extends IAbstractRenderEventHandlers,
        Required<Pick<ITreeTileViewOptions, 'onItemClick'>> {
    onCheckBoxClick: (item: TreeTileCollectionItem, event: SyntheticEvent<MouseEvent>) => void;
}
