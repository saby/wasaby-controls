import * as coreActions from '../actions/types/_interactorCore';
import { TAbstractListMiddleware } from '../types/TAbstractListMiddleware';
import { AbstractListActionCreators } from '../actions/creators';

export const interactorCore: TAbstractListMiddleware =
    ({ getState, dispatch, setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case coreActions.PublicSetStateSymbol: {
                const partialNextState =
                    typeof action.payload.nextState === 'function'
                        ? action.payload.nextState(getState())
                        : action.payload.nextState;

                await dispatch(
                    AbstractListActionCreators.interactorCore.onPublicSetState(partialNextState)
                );

                break;
            }
            case coreActions.StartUpdateSymbol: {
                const { actions, prevState } = action.payload;
                await dispatch(AbstractListActionCreators.interactorCore.onBeforeStartUpdate());

                //#region Обновление состояния
                for (const _action of actions) {
                    await dispatch(_action);
                }
                //#endregion

                await dispatch(
                    AbstractListActionCreators.interactorCore.onAfterStartUpdate(prevState)
                );
                break;
            }
            case coreActions.BeforeApplyStateSymbol: {
                const { prevState, nextState } = action.payload;
                //#region Обновление состояния
                setState(nextState);
                //#endregion

                //#region Сайд-эффекты
                await dispatch(
                    AbstractListActionCreators.interactorCore.onAfterBeforeApplyState(prevState)
                );
                //#endregion Сайд-эффекты
                break;
            }
        }

        next(action);
    };
