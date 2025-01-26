/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TListMiddleware } from 'Controls/dataFactory';

export const highlightFields: TListMiddleware =
    ({ setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setHighlightedFieldsMap': {
                const { highlightedFieldsMap } = action.payload;
                //#region Обновление состояния
                setState({
                    highlightedFieldsMap: new Map(highlightedFieldsMap),
                });
                //#endregion
                break;
            }
        }

        next(action);
    };
