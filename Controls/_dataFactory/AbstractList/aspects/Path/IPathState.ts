import type { RecordSet } from 'Types/collection';
import type { Path } from 'Controls/dataSource';
import type { Model } from 'Types/entity';

export interface IPathState {
    items: RecordSet;
    breadCrumbsItems: Path;
    breadCrumbsItemsWithoutBackButton: Path;
    backButtonItem: Model;
    displayProperty?: string;
    backButtonCaption: string;
}
