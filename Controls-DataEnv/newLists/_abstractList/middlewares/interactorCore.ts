import * as coreActions from '../actions/types/_interactorCore';
import { TAbstractListMiddleware } from '../types/TAbstractListMiddleware';
import { default as AbstractListActionCreators } from '../actions';
import { isFunction } from '../validators/predicates';
const {
    interactorCore: {
        onPublicSetState,
        onBeforeStartUpdate,
        onAfterStartUpdate,
        onAfterBeforeApplyState,
        onEndUpdate,
    },
} = AbstractListActionCreators;

export const interactorCore: TAbstractListMiddleware =
    ({ getState, dispatch, setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case coreActions.PublicSetStateSymbol: {
                const { nextState } = action.payload;
                const partialNextState = isFunction(nextState) ? nextState(getState()) : nextState;

                await dispatch(onPublicSetState(partialNextState));

                break;
            }
            case coreActions.StartUpdateSymbol: {
                const { actions, prevState } = action.payload;
                await dispatch(onBeforeStartUpdate());

                //# region Обновление состояния
                for (const _action of actions) {
                    await dispatch(_action);
                }
                //# endregion

                await dispatch(onAfterStartUpdate(prevState));
                break;
            }
            case coreActions.BeforeApplyStateSymbol: {
                const { prevState, nextState } = action.payload;
                //# region Обновление состояния
                setState(nextState);
                //# endregion

                //# region Сайд-эффекты
                await dispatch(onAfterBeforeApplyState(prevState));
                //# endregion Сайд-эффекты
                break;
            }
            case coreActions.EndUpdateSymbol: {
                const { prevState, nextState } = action.payload;

                setState(nextState);

                await dispatch(onEndUpdate(prevState, nextState));
                break;
            }
        }

        next(action);
    };
