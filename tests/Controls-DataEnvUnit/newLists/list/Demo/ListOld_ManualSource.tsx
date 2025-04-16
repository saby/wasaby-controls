import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import { personsData, KEY_PROPERTY } from './Data/personsData';
import {
    IListState,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
} from 'Controls/dataFactory';
import { ListOldWrapper, ListSliceOld } from './ListOldWrapper/ListOldWrapper';
import ManualMemory from './Utils/ManualMemory';
import { View as ListComponent } from 'Controls/baseList';
import { Container as ScrollContainer } from 'Controls/scroll';
import { RecordSet } from 'Types/collection';
import { Direction } from 'Controls-DataEnv/listTypes';
import { _private_DecomposedPromise } from 'Controls-DataEnv/abstractList';
import * as React from 'react';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';

export const ERROR_QA = 'js-demo-error-data-qa';
export const LIST_QA = 'js-demo-list';
export const SEARCH_QA = 'js-demo-search-input-data-qa';
const DISPLAY_PROPERTY = 'name';
const ScrollInnerStyles = {
    height: '500px',
};

interface TestOptions {
    /**
     * Ошибка, возвращаемая от source при ручной отправки ошибки загрузки
     */
    manualLoadError?: Error;
    /**
     * Флаг, при котором в прикладном _dataLoaded ко всем загруженным записям будет добавлено "Изменен в dataLoaded"
     */
    changeAllItemsInDataLoaded?: boolean;

    /**
     * Флаг, при котором из прикладного _dataLoaded будет возвращено новое состояние в виде промиса Promise.resolve(nextState)
     */
    dataLoadedReturnPromise?: boolean;
}

interface IUserListDataFactoryArguments extends IListDataFactoryArguments, TestOptions {
    /**
     * Флаг для перевода source в режим ручного управления на initState
     */
    manualSource?: boolean;
}

interface IUserListState extends IListState, TestOptions {}

export class UserSlice extends ListSliceOld<IUserListState> {
    protected _initState(
        loadResult: IListDataFactoryLoadResult,
        config: IUserListDataFactoryArguments
    ): IListState {
        const state = super._initState(loadResult, config);
        if (config.manualSource) {
            (state.source as ManualMemory).setManual(true);
        }
        state.manualLoadError = config.manualLoadError;
        state.changeAllItemsInDataLoaded = config.changeAllItemsInDataLoaded;
        state.dataLoadedReturnPromise = config.dataLoadedReturnPromise;
        return state;
    }

    protected _dataLoaded(
        items: RecordSet,
        _direction: Direction,
        nextState: IUserListState
    ): Partial<IUserListState> | Promise<Partial<IUserListState>> {
        if (this.state.changeAllItemsInDataLoaded) {
            items.forEach((item) => {
                item.set('name', item.get('name') + ' Изменен в dataLoaded');
            });
        }
        const result = super._dataLoaded(items, _direction, nextState);
        return this.state.dataLoadedReturnPromise ? Promise.resolve(result) : result;
    }

    rejectUpdate() {
        this._rejectBeforeApplyPromise();
    }

    destroy() {
        (this.state.source as ManualMemory).setManual(false);
        super.destroy();
    }

    protected async _onRejectBeforeApplyState(): Promise<void> {
        (this.state.source as ManualMemory).resolveQuery();
        return super._onRejectBeforeApplyState();
    }
}

export default buildDemo<UserSlice, IUserListDataFactoryArguments>({
    actions: [
        {
            name: 'Вернуть данные от загрузчика',
            dataQa: 'source resolveQuery',
            action: ({ slice }) => {
                (slice.state.source as ManualMemory).resolveQuery();
            },
        },
        {
            name: 'Вернуть ошибку от загрузчика',
            dataQa: 'rejectQuery',
            action: ({ slice }) => {
                (slice.state.source as ManualMemory).rejectQuery(
                    slice.state.manualLoadError || new Error('Ошибка загрузки данных')
                );
            },
        },
        {
            name: 'Отменить загрузку',
            dataQa: 'rejectSliceUpdate',
            action: ({ slice }) => {
                slice.rejectUpdate();
            },
        },
        {
            name: 'Запустить загрузку по фильтру (setFilter)',
            dataQa: 'setFilter country=Norway',
            action: ({ slice }) => {
                slice.setFilter({
                    country: 'Norway',
                });
            },
        },
        {
            name: 'Запустить загрузку данных (load filter)',
            dataQa: 'load with filter',
            action: ({ slice }) => {
                slice.load(void 0, undefined, {
                    country: 'Norway',
                });
            },
        },
        {
            name: 'Перезагрузить список (reload)',
            dataQa: 'reload',
            action: ({ slice }) => {
                slice.reload();
            },
        },
    ],
    Slice: UserSlice,
    Component: ({ storeId, waitForRender, slice }) => {
        const buildPromise = React.useMemo(
            () => _private_DecomposedPromise.getDecomposedPromise<void>(),
            []
        );

        React.useLayoutEffect(() => {
            waitForRender(buildPromise.promise);
            setTimeout(() => {
                buildPromise.resolve();
            }, 150);
        }, []);
        return (
            <div>
                <ScrollContainer
                    // @ts-ignore
                    style={ScrollInnerStyles}
                >
                    <div data-qa={SEARCH_QA}>
                        <SearchInput storeId={storeId} />
                    </div>
                    <div data-qa={LIST_QA}>
                        <ListOldWrapper slice={slice}>
                            <ListComponent storeId={storeId} />
                        </ListOldWrapper>
                    </div>
                </ScrollContainer>
                {slice.state.error && <div data-qa={ERROR_QA}>{slice.state.error.message}</div>}
            </div>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/ListOld_ManualSource',
    getDataFactoryArguments: () => ({
        source: new ManualMemory({
            keyProperty: KEY_PROPERTY,
            data: personsData.slice(0, 5),
        }),
        displayProperty: DISPLAY_PROPERTY,
        keyProperty: KEY_PROPERTY,
        searchParam: DISPLAY_PROPERTY,
    }),
});
