import { TListMiddlewareCreator } from '../types/TListMiddleware';
import * as stateActions from '../actions/state';

import {
    withLogger,
    Logger as DispatcherLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';
import { getDecomposedPromise } from 'Controls/_dataFactory/helpers/DecomposedPromise';

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'reload',
    actionsNames: ['reload'],
});

export const reload: TListMiddlewareCreator = (ctx) => {
    const { getState, dispatch, getTrashBox, getCollection, originalSliceSetState } = withLogger(
        ctx,
        'reload'
    );

    return (next) => async (action) => {
        logger.enter(action);

        switch (action.type) {
            case 'reload': {
                let { sourceConfig } = action.payload;
                const { keepNavigation, onResolve, onReject } = action.payload;

                const { promise: onDataLoadedPromise, resolve: onDataLoadedPromiseResolve } =
                    getDecomposedPromise();
                const immediateState = {
                    loading: true,
                };

                if (keepNavigation) {
                    immediateState.keepNavigationSliceReloadId = Date.now();
                }

                await dispatch(stateActions.setState(immediateState, 'immediate'));
                await dispatch(
                    stateActions.setState({
                        promiseResolverForReloadOnly: onDataLoadedPromiseResolve,
                    })
                );

                const state = getState();
                const { _propsForMigrationToDispatcher } = getTrashBox();

                if (!sourceConfig && keepNavigation) {
                    const navigation = state.navigation;
                    const isMultiNavigation = !!navigation?.sourceConfig?.multiNavigation;
                    if (navigation?.source === 'position') {
                        const maxLimit = Math.max(
                            navigation.sourceConfig.limit,
                            getCollection()?.getSourceCollectionCount()
                        );
                        sourceConfig = {
                            ...navigation.sourceConfig,
                            limit: maxLimit,
                        };
                    }
                    if (!isMultiNavigation && navigation?.source === 'page') {
                        const navPageSize = navigation.sourceConfig.pageSize;
                        const pageSize = Math.max(
                            Math.ceil(getCollection()?.getSourceCollectionCount() / navPageSize) *
                                navPageSize,
                            navPageSize
                        );
                        sourceConfig = {
                            ...navigation.sourceConfig,
                            page: 0,
                            pageSize,
                        };
                    }
                }

                _propsForMigrationToDispatcher.sliceProperties.loadConfig = {
                    sourceConfig,
                    keepNavigation,
                };

                // нужен механизм регистрации висячих пендингов
                // добавить по задаче: https://online.sbis.ru/opendoc.html?guid=3103a015-07aa-4421-a3ab-13301eb00aad&client=3
                state.sourceController
                    ?.reload(sourceConfig, false, false, keepNavigation)
                    ?.then(async (items) => {
                        _propsForMigrationToDispatcher.sliceProperties.newItems = items;
                        if (state.loading) {
                            originalSliceSetState({
                                loading: false,
                            });
                        } else {
                            //TODO: Перезагрузка должна всегда вешать промис. Это костыль на случай, когда за время загрузки сбросили флаг loading
                            originalSliceSetState({
                                newReloadedItems: items,
                            });
                        }

                        onDataLoadedPromise.then(() => {
                            // Необходимо гарантировать, чтобы reload разрешался сразу после исполнения всех обновлений от notify dataLoaded
                            // без setTimeout в очередь микротаск попадают сначала обработчики reload, затем dataLoaded
                            setTimeout(() => {
                                onResolve(items);
                            }, 0);
                        });
                    })
                    ?.catch(async (error) => {
                        // TODO: !!!!!!
                        if (!error?.isCanceled) {
                            originalSliceSetState({
                                loading: false,
                            });
                        }
                        onReject(error);
                    });
                break;
            }
        }

        logger.exit(action);

        next(action);
    };
};
