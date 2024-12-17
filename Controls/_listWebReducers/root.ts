/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddlewareCreator, SnapshotName } from 'Controls/dataFactory';

export const root: TListMiddlewareCreator =
    ({ snapshots, dispatch, getState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setRoot': {
                if (getState().root === action.payload.root) {
                    break;
                }

                await dispatch(
                    ListWebActions.state.setState({
                        root: action.payload.root,
                    })
                );

                // Если во время поиска поменяли фильтр, то надо сбросить
                // корень перед поиском, т.к мы можем в него не вернуться.
                // Сбрасываем только если запомнили корень.
                // Корень из "undefined" в "null" превращать нельзя.
                const beforeSearch = snapshots.get(SnapshotName.BeforeSearch);
                if (beforeSearch && beforeSearch.root !== undefined) {
                    beforeSearch.root = null;
                }

                break;
            }
            case 'complexUpdateRoot': {
                if (action.payload.prevState.root === action.payload.root) {
                    break;
                }

                await dispatch(ListWebActions.root.setRoot(action.payload.root));

                break;
            }
        }

        next(action);
    };
