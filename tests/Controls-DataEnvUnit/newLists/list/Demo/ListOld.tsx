import * as React from 'react';
import { CancelablePromise, Model } from 'Types/entity';
import { Memory } from 'Types/source';
import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import { personsData, KEY_PROPERTY } from './Data/personsData';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { View as ListComponent } from 'Controls/list';
import {
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
    IListState,
} from 'Controls-DataEnv/currentList';
import { View as Panel } from 'Controls-ListEnv/operationsPanelConnected';
import { _private_DecomposedPromise, getError } from 'Controls-DataEnv/abstractList';
import { ListOldWrapper, ListSliceOld } from './ListOldWrapper/ListOldWrapper';
import { Container as ScrollContainer } from 'Controls/scroll';
import { loadData as CurrentListLoadData } from 'Controls-DataEnv/currentList';

export const LIST_QA = 'js-demo-list';
export const SEARCH_QA = 'js-demo-search-input-data-qa';
export const PMO_QA = 'js-demo-pmo-data-qa';
const DISPLAY_PROPERTY = 'name';
const ScrollInnerStyles = {
    height: '500px',
};

interface TestOptions {
    /**
     * Флаг для отмены в прикладном bas любых платформенных изменений, сделанных в фазе startUpdate
     */
    rejectPlatformChanges?: boolean;
    /**
     * Флаг, при котором в прикладном bas при смене маркера к имени маркируемой записи будет добавлен "Изменен"
     */
    changeItemOnMark?: boolean;
    /**
     * Флаг, при котором в прикладном bas при смене маркера сформируется фильтр по имени отмеченной записи
     */
    setFilterByMarkedKey?: boolean;
    /**
     * Флаг, при котором из прикладного bas всегда будет возвращаться отмененный промис
     */
    rejectByCanceledPromise?: boolean;
}

interface IUserListDataFactoryArguments extends IListDataFactoryArguments, TestOptions {}
interface IUserListState extends IListState, TestOptions {}

class UserSlice extends ListSliceOld<IUserListState> {
    protected _initState(
        loadResult: IListDataFactoryLoadResult,
        config: IUserListDataFactoryArguments
    ): IListState {
        const state = super._initState(loadResult, config);
        state.rejectPlatformChanges = config.rejectPlatformChanges;
        state.changeItemOnMark = config.changeItemOnMark;
        state.setFilterByMarkedKey = config.setFilterByMarkedKey;
        state.rejectByCanceledPromise = config.rejectByCanceledPromise;

        return state;
    }

    protected async _beforeApplyState(nextStateProp: IUserListState): Promise<IUserListState> {
        if (nextStateProp.rejectPlatformChanges) {
            nextStateProp = { ...this.state };
        }
        if (
            nextStateProp.changeItemOnMark &&
            this.state.markedKey !== nextStateProp.markedKey &&
            nextStateProp.markedKey &&
            this.state.items
        ) {
            const item = this.state.items.getRecordById(nextStateProp.markedKey);
            if (item) {
                item.set('name', item.get('name') + ' Изменен');
            }
        }
        if (
            nextStateProp.setFilterByMarkedKey &&
            this.state.markedKey !== nextStateProp.markedKey &&
            nextStateProp.markedKey &&
            this.state.items
        ) {
            const markedItem = this.state.items.getRecordById(nextStateProp.markedKey);
            if (markedItem) {
                nextStateProp.filter = {
                    name: markedItem.get('name'),
                };
            }
        }
        if (nextStateProp.rejectByCanceledPromise) {
            const cancelablePromise = new CancelablePromise(Promise.resolve(nextStateProp));
            cancelablePromise.cancel();
            return cancelablePromise.promise;
        }
        return super._beforeApplyState(nextStateProp);
    }

    deprecatedMethod() {
        getError(
            'DEPRECATED_USED',
            'error',
            `Списочный слайс с идентификатором ${this._name}`,
            'deprecatedMethod',
            void 0,
            'XX.XXXX'
        );
    }
}

export default buildDemo<UserSlice, IUserListDataFactoryArguments>({
    actions: [
        {
            name: 'Выключить видимость маркера (markerVisibility=hidden)',
            dataQa: 'markerVisibility=hidden',
            action: ({ slice }) => {
                slice.setState({ markerVisibility: 'hidden' });
            },
        },
        {
            name: 'Включить видимость маркера (markerVisibility=visible)',
            dataQa: 'markerVisibility=visible',
            action: ({ slice }) => {
                slice.setState({ markerVisibility: 'visible' });
            },
        },
        {
            name: 'Отметить Lumi Neva(0, команда mark)',
            dataQa: 'markedKey=0',
            action: ({ slice }) => {
                slice.mark(0);
            },
        },
        {
            name: 'Перезагрузить список',
            dataQa: 'reload',
            action: ({ slice }) => {
                slice.reload();
            },
        },
        {
            name: 'Перезагрузить список с сохранением навигации',
            dataQa: 'reload keepNavigation',
            action: ({ slice }) => {
                slice.reload(undefined, true);
            },
        },
        {
            name: 'Локально изменить данные',
            dataQa: 'change RecordSet',
            action: ({ slice }) => {
                const items = slice.state.items;
                if (items) {
                    items.setEventRaising(false, true);
                    items.forEach((item: Model) => {
                        const value = item.get('name');
                        item.set('name', value + ' (изменен)');
                    });
                    items.setEventRaising(true, true);
                }
            },
        },
        {
            name: 'Перезагрузить запись Hilary Osborne',
            dataQa: 'reloadItem 1',
            action: ({ slice }) => {
                slice.reloadItem(1);
            },
        },
        {
            name: 'Загрузить данные',
            dataQa: 'load',
            action: ({ slice }) => {
                slice.load();
            },
        },
        {
            name: 'Открыть ПМО',
            dataQa: 'openOperationsPanel',
            action: ({ slice }) => {
                slice.openOperationsPanel();
            },
        },
        {
            name: 'Закрыть ПМО',
            dataQa: 'closeOperationsPanel',
            action: ({ slice }) => {
                slice.closeOperationsPanel();
            },
        },
        {
            name: 'Загрузить данные с фильтром (load filter)',
            dataQa: 'load filter',
            action: ({ slice }) => {
                slice.load(void 0, null, {
                    country: 'Norway',
                });
            },
        },
        {
            name: 'Осуществить SPA переход (reloadDemo)',
            dataQa: 'reloadDemo',
            action: () => {
                if (window) {
                    // Для воспроизведения только на демках в браузере
                    // @ts-ignore
                    window.reloadDemo();
                }
            },
        },
        {
            name: 'Изменить searchInputValue',
            dataQa: 'searchInputValue=testPlus',
            action: ({ slice }) => {
                slice.setSearchInputValue('testPlus');
            },
        },
        {
            name: 'Поиск: пустое значение',
            dataQa: 'searchValue=',
            action: ({ slice }) => {
                slice.setState({
                    searchValue: '',
                });
            },
        },
        {
            name: 'Поиск value',
            dataQa: 'searchInputValue=value',
            action: ({ slice }) => {
                slice.setState({
                    searchInputValue: 'value',
                });
            },
        },
        {
            name: 'Вызов устаревшего метода',
            dataQa: 'deprecatedMethod',
            action: ({ slice }) => {
                slice.deprecatedMethod();
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
                <div data-qa={SEARCH_QA}>
                    <SearchInput storeId={storeId} />
                </div>
                <div data-qa={PMO_QA}>
                    <Panel storeId={storeId} />
                </div>
                <ScrollContainer
                    // @ts-ignore
                    style={ScrollInnerStyles}
                >
                    <div data-qa={LIST_QA}>
                        <ListOldWrapper slice={slice}>
                            <ListComponent storeId={storeId} />
                        </ListOldWrapper>
                    </div>
                </ScrollContainer>
            </div>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/ListOld',
    getDataFactoryArguments: () => ({
        source: new Memory({
            keyProperty: KEY_PROPERTY,
            data: personsData.slice(0, 5),
        }),
        keyProperty: KEY_PROPERTY,
        displayProperty: DISPLAY_PROPERTY,
        searchParam: DISPLAY_PROPERTY,
    }),
    loadData: CurrentListLoadData,
});
