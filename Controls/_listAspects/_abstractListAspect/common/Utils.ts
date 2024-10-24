import { CrudEntityKey } from 'Types/source';
import {
    TSelectionModel,
    TSelectionModelStatus,
} from '../../selection/_abstractSelectionAspect/IAbstractSelectionState';
import type { TExpansionModel } from '../../_expandCollapseListAspect/common/TExpansionModel';

export function getModelsDifference(
    prevModel: TSelectionModel | TExpansionModel,
    nextModel: TSelectionModel | TExpansionModel
) {
    const PREV_STATUS_ALIAS = 'prev';
    const NEXT_STATUS_ALIAS = 'next';

    const prevToNextModel = new Map<
        CrudEntityKey,
        {
            prev?: TSelectionModelStatus;
            next?: TSelectionModelStatus;
        }
    >();

    const fill = (
        pairs: [CrudEntityKey, TSelectionModelStatus | boolean][],
        index: number,
        fieldName: typeof PREV_STATUS_ALIAS | typeof NEXT_STATUS_ALIAS
    ) => {
        if (index < pairs.length) {
            const [key, value] = pairs[index];
            if (!prevToNextModel.has(key)) {
                prevToNextModel.set(key, {
                    [PREV_STATUS_ALIAS]: undefined,
                    [NEXT_STATUS_ALIAS]: undefined,
                });
            }
            // ts не понимает, что объект точно создан.
            // @ts-ignore
            prevToNextModel.get(key)[fieldName] = value;
        }
    };

    const prevModelEntries: [CrudEntityKey, TSelectionModelStatus | boolean][] = [
        ...prevModel.entries(),
    ];
    const nextModelEntries: [CrudEntityKey, TSelectionModelStatus | boolean][] = [
        ...nextModel.entries(),
    ];

    for (let i = 0; i < Math.max(prevModelEntries.length, nextModelEntries.length); i++) {
        fill(prevModelEntries, i, PREV_STATUS_ALIAS);
        fill(nextModelEntries, i, NEXT_STATUS_ALIAS);
    }

    const clearChanges: TSelectionModel | TExpansionModel = new Map();
    prevToNextModel.forEach((value, key) => {
        if (value[PREV_STATUS_ALIAS] !== value[NEXT_STATUS_ALIAS]) {
            const nextStatus = value[NEXT_STATUS_ALIAS];
            clearChanges.set(key, typeof nextStatus === 'undefined' ? false : nextStatus);
        }
    });
    return clearChanges;
}
