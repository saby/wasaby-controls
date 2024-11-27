/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TListMiddleware } from 'Controls/dataFactory';

export const stub: TListMiddleware =
    ({ setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setStubVisibility': {
                const { needShowStub } = action.payload;
                //#region Обновление состояния
                setState({
                    needShowStub,
                });
                //#endregion
                break;
            }
        }

        next(action);
    };
