/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { AspectsNames, ListWebActions, TListMiddlewareCreator } from 'Controls/dataFactory';

export const marker: TListMiddlewareCreator =
    ({ getState, dispatch, getAspects, getCollection }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setMarkedKey': {
                //#region Обновление маркера
                await dispatch(
                    ListWebActions.state.setState({
                        markedKey: action.payload.key,
                    })
                );
                //#endregion

                //#region Сайд-эффекты
                await dispatch(ListWebActions.source.updateSavedState());
                await dispatch(ListWebActions.operationsPanel.updateOperationsSelection());
                //#endregion Сайд-эффекты
                break;
            }
            case 'setMarkerVisibility': {
                const markerVisibility = action.payload.visibility;

                await dispatch(
                    ListWebActions.state.setState({
                        markerVisibility,
                    })
                );

                const state = getState();

                const shouldSetMarkerOnFirstItem =
                    markerVisibility === 'visible' &&
                    (state.markedKey === undefined || state.markedKey === null);

                if (shouldSetMarkerOnFirstItem) {
                    const markerAspect = getAspects() && getAspects().get(AspectsNames.Marker);

                    if (markerAspect) {
                        await dispatch(
                            ListWebActions.state.setState({
                                markedKey: markerAspect.calculateMarkedKeyForVisible(
                                    state,
                                    getCollection()
                                ),
                            })
                        );
                    }
                }

                break;
            }
            case 'activateMarker': {
                // Не можем показать маркер, т.к. он скрыт вообще.
                if (getState().markerVisibility === 'hidden') {
                    break;
                }

                await dispatch(ListWebActions.marker.setMarkerVisibility('visible'));

                break;
            }
            case 'complexUpdateMarker': {
                const { prevState, nextState } = action.payload;

                if (prevState.markerVisibility !== nextState.markerVisibility) {
                    // Не скрываем маркер, если открыто ПМО и прикладной разработчик
                    // пытается скрыть маркер.
                    const shouldIgnoreVisibilityChange =
                        nextState.operationsPanelVisible && nextState.markerVisibility === 'hidden';

                    // Если идет смена модели с поддерживаемой на неподдерживаемую,
                    // то в некоторых случаях не нужно проставлять маркер.
                    // Например, если маркер прикладным разработчиком не задан.
                    // У нас нет точек в слайсе, чтобы понять, задан ли маркер и нет точки,
                    // чтобы понять, какая модель будет следующая.
                    // Ошибка https://online.sbis.ru/opendoc.html?guid=883d4c50-ea09-41fb-8ba0-84178b820f6b&client=3
                    // Чтобы таких ошибок не было, нужно поддержать все модели.
                    // Задача https://online.sbis.ru/opendoc.html?guid=f5e80392-e23c-4266-b4e5-cec270562c47&client=3
                    const isNextModelSupported = nextState.fix1193265616 !== true;

                    if (isNextModelSupported && !shouldIgnoreVisibilityChange) {
                        await dispatch(
                            ListWebActions.marker.setMarkerVisibility(nextState.markerVisibility)
                        );
                    }
                }

                if (prevState.markedKey !== nextState.markedKey) {
                    await dispatch(ListWebActions.marker.setMarkedKey(nextState.markedKey));
                }

                break;
            }
        }

        next(action);
    };
