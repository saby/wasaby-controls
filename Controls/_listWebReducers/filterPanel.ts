/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TListMiddleware } from 'Controls/dataFactory';

export const filterPanel: TListMiddleware =
    ({ setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'openFilterDetailPanel': {
                setState({
                    filterDetailPanelVisible: true,
                });
                break;
            }

            case 'closeFilterDetailPanel': {
                setState({
                    filterDetailPanelVisible: false,
                });

                break;
            }
        }
        next(action);
    };
