/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IAbstractRenderEventHandlers } from 'Controls-Lists/abstractList';
import type { ITreeTileViewOptions, TreeTileCollectionItem } from 'Controls/treeTile';
import type { SyntheticEvent } from 'UICommon/Events';

export interface ITileRenderEventHandlers
    extends IAbstractRenderEventHandlers,
        Required<
            Pick<ITreeTileViewOptions, 'onItemClick' | 'onItemMouseDown' | 'onItemMouseMove'>
        > {
    onCheckBoxClick: (item: TreeTileCollectionItem, event: SyntheticEvent<MouseEvent>) => void;
}
