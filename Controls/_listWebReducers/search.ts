/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddlewareCreator, SnapshotName } from 'Controls/dataFactory';

import { isEqual } from 'Types/object';

export const search: TListMiddlewareCreator =
    ({ getState, dispatch, snapshots }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'resetSearch': {
                //#region Обновление маркера
                await dispatch(
                    ListWebActions.state.setState({
                        searchValue: '',
                    })
                );
                //#endregion

                //#region Сайд-эффекты
                const state = getState();

                // Todo: ЧТО ЭТО? ВЫДЕЛЕНИЕ ЧЕРЕЗ ПМО В ДЕРЕВЕ?
                if (
                    typeof state.root !== 'undefined' &&
                    snapshots.get(SnapshotName.BeforeSearch) &&
                    state.selectedKeys?.includes(state.root) &&
                    state.excludedKeys?.includes(state.root) &&
                    // Проверка на существование снапшота выше
                    // eslint-disable-next-line
                    snapshots.get(SnapshotName.BeforeSearch)!.root !== state.root
                ) {
                    await dispatch(ListWebActions.selection.resetSelection());
                }
                //#endregion Сайд-эффекты
                break;
            }
            case 'updateSearch': {
                if (!isEqual(getState().searchValue, action.payload.searchValue)) {
                    if (action.payload.searchValue) {
                        await dispatch(
                            ListWebActions.state.setState({
                                searchValue: action.payload.searchValue,
                            })
                        );
                    } else {
                        await dispatch(ListWebActions.search.resetSearch());
                    }
                    await dispatch(ListWebActions.source.updateSavedState());
                }

                break;
            }
        }

        next(action);
    };
