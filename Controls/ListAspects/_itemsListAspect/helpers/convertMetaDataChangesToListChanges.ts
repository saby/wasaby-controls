import { IListChange, ListChangeNameEnum } from 'Controls/abstractListAspect';

import { MetaDataChangeAction, TMetaDataChange } from '../IItemsState';

export const convertMetaDataChangesToListChanges = (
    metaDataChanges: TMetaDataChange[]
): IListChange[] => {
    const changes: IListChange[] = [];
    for (const { action, metaData } of metaDataChanges) {
        switch (action) {
            case MetaDataChangeAction.REPLACE_META_DATA: {
                changes.push({
                    name: ListChangeNameEnum.REPLACE_META_DATA,
                    args: { metaData },
                });
                break;
            }
            case MetaDataChangeAction.MERGE_META_DATA: {
                changes.push({
                    name: ListChangeNameEnum.MERGE_META_DATA,
                    args: { metaData },
                });
                break;
            }
        }
    }
    return changes;
};
