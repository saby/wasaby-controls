/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { IListState, ListSlice } from 'Controls/dataFactory';

import { HierarchicalMemory, IHierarchicalMemoryOptions, Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { act } from 'react-dom/test-utils';
import { render, waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
} from 'Controls/_interface/INavigation';
import { useUpdateVisualizer } from '../TestEnv/useUpdateVisualizer';
import { HTTPStatus, fetch } from 'Browser/Transport';

const flatData = [
    {
        key: 0,
        name: 'Sasha',
        department: 'Platform',
    },
    {
        key: 1,
        name: 'Sergey',
        department: 'Platform',
    },
    {
        key: 2,
        name: 'Maksimka',
        department: 'SocialNetwork',
    },
];

const hierarchyItems = [
    {
        key: 0,
        title: 'Контролы',
        parent: null,
        hasChildren: true,
    },
    {
        key: 1,
        title: 'Саша',
        parent: 0,
        hasChildren: false,
    },
    {
        key: 2,
        title: 'Дмитрий',
        parent: 0,
        hasChildren: false,
    },
    {
        key: 3,
        title: 'Каталог',
        parent: null,
        hasChildren: true,
    },
    {
        key: 4,
        title: 'Алексей',
        parent: 3,
        hasChildren: false,
    },
    {
        key: 5,
        title: 'Сергей',
        parent: null,
        hasChildren: false,
    },
];

function getMemory(): Memory {
    return new Memory({
        data: flatData,
        keyProperty: 'key',
    });
}

export function getHierarchicalMemory(
    options?: Partial<IHierarchicalMemoryOptions>
): HierarchicalMemory {
    return new HierarchicalMemory({
        data: hierarchyItems,
        keyProperty: 'key',
        parentProperty: 'parent',
        ...options,
    });
}

function getPagingNavigation(
    hasMore: boolean = false,
    pageSize: number = 1,
    multiNavigation: boolean = false
): INavigationOptionValue<INavigationPageSourceConfig> {
    return {
        source: 'page',
        sourceConfig: {
            multiNavigation,
            pageSize,
            page: 0,
            hasMore,
        },
    };
}

const awaitMs = async (ms: number = 500) =>
    new Promise((r) => {
        setTimeout(r, ms);
    });

describe('Controls/ListSliceSnapshots', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    it('Во время метода load можно менять стейт, который не влияет на загрузку данных', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['loading', 'markedKey'],
            Slice: ListSlice,
        });
        const slice = new Slice({
            config: {
                source: getMemory(),
                filter: {
                    department: 'Platform',
                },
            },
            loadResult: {
                items: new RecordSet({
                    rawData: flatData.slice(0, 2),
                    keyProperty: 'key',
                }),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });
        await waitFor(() => expect(slice.state).toBeDefined());
        act(() => {
            slice.load();
            slice.setState({ markedKey: 'test' });
        });

        await waitFor(() => expect(slice.state.loading).toBeTruthy());
        await waitFor(() => expect(slice.state.loading).toBeFalsy());

        await awaitMs();

        expect(asFragment()).toMatchSnapshot();
    });

    it('При изменении фильтра должна произойти перезагрузка с новым фильтром', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['loading', 'filter'],
            Slice: ListSlice,
        });
        const slice = new Slice({
            config: {
                source: getMemory(),
                keyProperty: 'key',
                filter: {},
            },
            loadResult: {
                items: new RecordSet({
                    rawData: flatData,
                    keyProperty: 'key',
                }),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });

        await act(async () => {
            slice.setFilter({
                title: 'Платформа',
            });
        });

        await awaitMs(1000);

        expect(asFragment()).toMatchSnapshot();
    });

    it('После поиска не должно сбрасываться состояние searchInputValue, если оно менялось, пока выполнялся запрос', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['loading', 'searchInputValue', 'searchValue', 'filter'],
            Slice: ListSlice,
        });
        const slice = new Slice({
            config: {
                source: getMemory(),
                searchParam: 'testSearchParam',
            },
            loadResult: {
                items: new RecordSet(),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });
        await act(async () => {
            slice.search('test');
            await waitFor(() => expect(slice.state.loading).toBeTruthy());
            slice.setSearchInputValue('testPlus');
            await waitFor(() => expect(slice.state.loading).toBeFalsy());
        });

        await awaitMs();

        expect(asFragment()).toMatchSnapshot();
    });

    it('Вызов reload с параметром keepNavigation должен сохранять навигацию при перезагрузке', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['slice.state.items.getCount', 'loading', 'navigation'],
            replacer: (key, sliceState) => {
                if (key === 'slice.state.items.getCount') {
                    return sliceState?.items.getCount();
                }
                return undefined;
            },
            Slice: ListSlice,
        });

        const slice = new Slice({
            config: {
                source: getMemory(),
                navigation: getPagingNavigation(false, 1, false),
            },
            loadResult: {
                items: new RecordSet({
                    rawData: [...flatData.slice(0, 1)],
                    keyProperty: 'key',
                }),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });

        act(() => {
            slice.load('down');
        });
        await waitFor(() => expect(slice.state.loading).toBeTruthy());
        await waitFor(() => expect(slice.state.loading).toBeFalsy());

        act(() => {
            slice.reload(null, true);
        });
        await waitFor(() => expect(slice.state.loading).toBeTruthy());
        await waitFor(() => expect(slice.state.loading).toBeFalsy());

        await awaitMs();

        expect(asFragment()).toMatchSnapshot();
    });

    it('Вызов reload в момент, когда уже идёт загрузка. Стейт loading из-за отмены предыдущей загрузки не должен сбрасываться ', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['loading', 'filter'],
            Slice: ListSlice,
        });

        const slice: ListSlice = new Slice({
            config: {
                source: getMemory(),
            },
            loadResult: {
                items: new RecordSet({
                    keyProperty: 'id',
                    rawData: flatData,
                }),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });

        act(() => {
            slice.setState({ filter: { key: 1 } });
            slice.reload();
        });

        await waitFor(() => expect(slice.state.loading).toBeTruthy());
        await waitFor(() => expect(slice.state.loading).toBeFalsy());

        await awaitMs();

        expect(asFragment()).toMatchSnapshot();
    });

    it('selectionViewMode сбрасывается при перезагрузке (вызов метода reload)', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['loading', 'selectionViewMode'],
            Slice: ListSlice,
        });

        const slice = new Slice({
            config: {
                source: getMemory(),
            },
            loadResult: {
                items: new RecordSet({
                    keyProperty: 'id',
                    rawData: flatData,
                }),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });

        act(() => {
            slice.setSelectionViewMode('selected');
        });
        act(() => {
            slice.reload();
        });

        await waitFor(() => expect(slice.state.loading).toBeTruthy());
        await waitFor(() => expect(slice.state.loading).toBeFalsy());

        await awaitMs();

        expect(asFragment()).toMatchSnapshot();
    });

    it('Повторный вызов метода reload должен отменить предыдущую загрузку, если она выполняется', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['loading', 'selectionViewMode'],
            Slice: ListSlice,
        });

        const slice = new Slice({
            config: {
                source: getMemory(),
            },
            loadResult: {
                items: new RecordSet({
                    keyProperty: 'id',
                    rawData: flatData,
                }),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });

        await act(async () => {
            const promise = slice.reload();
            await waitFor(() => expect(slice.state.loading).toBeTruthy());
            slice.reload();
            promise.catch((error) => {
                expect(error.isCanceled).toBeTruthy();
            });
        });

        await waitFor(() => expect(slice.state.loading).toBeFalsy());

        await awaitMs();

        expect(asFragment()).toMatchSnapshot();
    });

    it('Вызов метода load без аргументов. Фильтр не должен меняться.', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['items', 'loading', 'filter'],
            replacer: (key, sliceState) => {
                if (key === 'items') {
                    return sliceState?.items.getCount();
                }
            },
            Slice: ListSlice,
        });

        const slice = new Slice({
            config: {
                source: getMemory(),
                filter: {
                    department: 'Platform',
                },
            },
            loadResult: {
                items: new RecordSet({
                    rawData: flatData.slice(0, 2),
                    keyProperty: 'key',
                }),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });

        act(() => {
            slice.load();
        });

        await waitFor(() => expect(slice.state.loading).toBeTruthy());
        await waitFor(() => expect(slice.state.loading).toBeFalsy());

        await awaitMs();

        expect(asFragment()).toMatchSnapshot();
    });

    it('reload должен выполнить перезагрузку и обновить items на стейте', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['items', 'loading'],
            replacer: (key, sliceState) => {
                if (key === 'items') {
                    return sliceState?.items.getCount();
                }
            },
            Slice: ListSlice,
        });

        const slice = new Slice({
            config: {
                source: getMemory(),
            },
            loadResult: {
                items: new RecordSet(),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });

        act(() => {
            slice.reload();
        });

        await waitFor(() => expect(slice.state.loading).toBeTruthy());
        await waitFor(() => expect(slice.state.loading).toBeFalsy());

        expect(asFragment()).toMatchSnapshot();
    });

    describe('Тесты поиска', () => {
        it('Вызов метода search c тем же searchValue, что и на стейте', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['loading', 'searchValue'],
                Slice: ListSlice,
            });

            const slice = new Slice({
                config: {
                    source: new Memory(),
                    searchParam: 'testSearchParam',
                    searchValue: 'test',
                },
                loadResult: {
                    items: new RecordSet(),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.search('test');
                await waitFor(() => expect(slice.state.loading).toBeTruthy());
                slice.search('test');
                await waitFor(() => expect(slice.state.loading).toBeFalsy());
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
        it('При смене корня прикладник может отменить сброс поиска', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['loading', 'searchValue'],
                Slice: class extends ListSlice {
                    protected async _beforeApplyState(
                        nextStateProp: IListState
                    ): Promise<IListState> {
                        if (
                            this.state.searchValue === 'test' &&
                            nextStateProp.searchValue === '' &&
                            this.state.root !== nextStateProp.root
                        ) {
                            nextStateProp.searchValue = this.state.searchValue;
                        }
                        return super._beforeApplyState(nextStateProp);
                    }
                },
            });

            const slice = new Slice({
                config: {
                    source: getHierarchicalMemory(),
                    parentProperty: 'parent',
                    searchParam: 'testSearchParam',
                    searchValue: 'test',
                },
                loadResult: {
                    items: new RecordSet(),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.changeRoot(1);
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
        it('Значение в строке поиска не сбрасывается, если за время поиска успели сбросить и что-то написать', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['loading', 'searchValue', 'searchInputValue'],
                Slice: class extends ListSlice {
                    protected async _beforeApplyState(
                        nextStateProp: IListState
                    ): Promise<IListState> {
                        if (
                            this.state.searchValue === 'test' &&
                            nextStateProp.searchValue === '' &&
                            this.state.root !== nextStateProp.root
                        ) {
                            nextStateProp.searchValue = this.state.searchValue;
                        }
                        return super._beforeApplyState(nextStateProp);
                    }
                },
            });

            const slice = new Slice({
                config: {
                    source: getHierarchicalMemory(),
                    parentProperty: 'parent',
                    searchParam: 'testSearchParam',
                    searchValue: '',
                    searchInputValue: '',
                },
                loadResult: {
                    items: new RecordSet(),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.search('7777');
                await waitFor(() => expect(slice.state.loading).toBeTruthy());
                slice.search('');
                slice.search('value');
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
        it('Значение searchInputValue не должно сбрасываться при вызове setState с пустым searchValue', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['loading', 'searchValue', 'searchInputValue'],
                Slice: ListSlice,
            });

            const slice = new Slice({
                config: {
                    source: getHierarchicalMemory(),
                    parentProperty: 'parent',
                    searchParam: 'testSearchParam',
                    searchValue: 'testValue',
                    searchInputValue: 'testValue',
                },
                loadResult: {
                    items: new RecordSet(),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.setState({
                    searchValue: '',
                });
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
        it('При сбросе поиска должны вернуться в узел, с которого начинали поиск', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['loading', 'searchValue', 'searchInputValue', 'viewMode', 'root'],
                Slice: ListSlice,
            });

            const slice = new Slice({
                config: {
                    source: getHierarchicalMemory(),
                    parentProperty: 'parent',
                    searchParam: 'testSearchParam',
                    searchValue: '',
                    searchInputValue: '',
                },
                loadResult: {
                    items: new RecordSet(),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.changeRoot(1);
                slice.search('value');
                await waitFor(() => expect(slice.state.loading).toBeTruthy());
                await waitFor(() => expect(slice.state.loading).toBeFalsy());
                slice.setState({
                    searchValue: '',
                });
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('Загрузка записей по скролу', () => {
        it('Источник вернул ошибку загрузки', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['errorViewConfig', 'loading'],
                Slice: ListSlice,
                replacer: (key, sliceState) => {
                    if (key === 'errorViewConfig' && sliceState?.errorViewConfig) {
                        return {
                            ...sliceState.errorViewConfig,
                            options: {
                                ...sliceState.errorViewConfig.options,
                                error: null,
                            },
                        };
                    }
                },
            });

            const error = new fetch.Errors.HTTP({
                httpError: HTTPStatus.GatewayTimeout,
                message: 'test',
                url: 'test',
            });
            const source = new Memory();

            source.query = jest.fn().mockRejectedValue(error);

            const slice = new Slice({
                config: {
                    source,
                },
                loadResult: {
                    items: new RecordSet(),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                return slice._loadItemsToDirection('down').catch((error) => error);
            });

            await waitFor(() => expect(slice.state.errorViewConfig?.mode).toStrictEqual('inlist'));

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
    });

    it('При проваливании в папку данные и корень обновляются в одном и том же beforeApplyState', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['root', 'items', 'loading'],
            replacer: (key, sliceState) => {
                if (key === 'items') {
                    return sliceState?.items.getCount();
                }
            },
            Slice: ListSlice,
            assertAfterBas: (prevState, nextState) => {
                if (prevState.root !== nextState.root || prevState.items !== nextState.items) {
                    expect(prevState.root).not.toEqual(nextState.root);
                    expect(prevState.items).not.toEqual(nextState.items);
                }
            },
        });

        const slice = new Slice({
            config: {
                source: getHierarchicalMemory(),
                parentProperty: 'parent',
            },
            loadResult: {
                items: new RecordSet({
                    keyProperty: 'id',
                    rawData: new RecordSet(),
                }),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });

        await act(async () => {
            slice.setState({ root: 0 });
        });

        await awaitMs();

        expect(asFragment()).toMatchSnapshot();
    });

    it('Открытие и закрытие панели фильтров', async () => {
        const { Slice, Component } = useUpdateVisualizer({
            deps: ['filterDetailPanelVisible'],
            Slice: ListSlice,
        });

        const slice = new Slice({
            config: {
                source: getHierarchicalMemory(),
                filterDescription: [],
            },
            loadResult: {
                items: new RecordSet(),
            },
        });

        const { asFragment } = render(<Component />, {
            container,
        });

        await act(async () => {
            slice.openFilterDetailPanel();
        });

        await act(async () => {
            slice.closeFilterDetailPanel();
        });

        expect(asFragment()).toMatchSnapshot();
    });

    describe('Отметка маркером', () => {
        it('Вызов API.mark() с параметром устанавливает корректное значение в стейт', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['markedKey'],
                Slice: ListSlice,
            });
            const slice = new Slice({
                config: {
                    source: getMemory(),
                },
                loadResult: {
                    items: new RecordSet({
                        keyProperty: 'id',
                        rawData: flatData,
                    }),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.mark(2);
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });

        describe('Смена состояния markerVisibility', () => {
            it('При выключении видимости, маркер сбрасывается в null', async () => {
                const { Slice, Component } = useUpdateVisualizer({
                    deps: ['markedKey', 'markerVisibility'],
                    Slice: ListSlice,
                });
                const slice = new Slice({
                    config: {
                        source: getMemory(),
                        markerVisibility: 'visible',
                        markedKey: 2,
                    },
                    loadResult: {
                        items: new RecordSet({
                            keyProperty: 'id',
                            rawData: flatData,
                        }),
                    },
                });

                const { asFragment } = render(<Component />, {
                    container,
                });

                await act(async () => {
                    slice.setState({ markerVisibility: 'hidden' });
                });

                await awaitMs();

                expect(asFragment()).toMatchSnapshot();
            });
        });
    });
    describe('Иерархия', () => {
        it('Если сброс поиска был вызван сменой корня, то восстанавливать прошлый корень не надо', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['root', 'searchValue', 'viewMode', 'loading'],
                Slice: ListSlice,
            });

            const slice = new Slice({
                config: {
                    source: getHierarchicalMemory(),
                    parentProperty: 'parent',
                    searchParam: 'searchParam',
                    viewMode: 'table',
                    root: 0,
                },
                loadResult: {
                    items: new RecordSet({
                        keyProperty: 'id',
                        rawData: new RecordSet(),
                    }),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.changeRoot(1);
                await awaitMs();
                slice.search('test');
                await awaitMs();
                slice.changeRoot(2);
            });
            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('Загрузка', () => {
        it('Если в прикладном bas были изменения, требующие загрузку, она должна выполниться', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['filterDescription', 'filter', 'loading'],
                Slice: class extends ListSlice {
                    protected async _beforeApplyState(
                        nextStateProp: IListState
                    ): Promise<IListState> {
                        if (nextStateProp.changeFilterDescription) {
                            nextStateProp.filterDescription = [
                                {
                                    name: 'test',
                                    value: null,
                                },
                            ];
                        }
                        return super._beforeApplyState(nextStateProp);
                    }
                },
            });

            const slice = new Slice({
                config: {
                    source: getHierarchicalMemory(),
                    parentProperty: 'parent',
                    markedKey: 0,
                },
                loadResult: {
                    items: new RecordSet({
                        keyProperty: 'id',
                        rawData: new RecordSet(),
                    }),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.setState({ changeFilterDescription: true });
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
    });
    describe('setState', () => {
        it('Экшены должны добавляться в очередь без дублирования уже исполняемых экшенов', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['markedKey'],
                Slice: ListSlice,
            });

            const slice = new Slice({
                config: {
                    source: getHierarchicalMemory(),
                    parentProperty: 'parent',
                    markedKey: 0,
                },
                loadResult: {
                    items: new RecordSet({
                        keyProperty: 'id',
                        rawData: new RecordSet(),
                    }),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.setState((state) => ({
                    markedKey: state.markedKey + 1,
                }));
                slice.setState((state) => ({
                    markedKey: state.markedKey + 1,
                }));
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
        it('slice.setState, отправленные в очередь во время работы другого, должны сгруппироваться в один перед испонением', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['markedKey'],
                Slice: ListSlice,
            });

            const slice = new Slice({
                config: {
                    source: getHierarchicalMemory(),
                    parentProperty: 'parent',
                    markedKey: 0,
                },
                loadResult: {
                    items: new RecordSet({
                        keyProperty: 'id',
                        rawData: new RecordSet(),
                    }),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                for (let i = 0; i < 10; i++) {
                    slice.setState((state) => ({
                        markedKey: state.markedKey + 1,
                    }));
                }
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
        it('Обновление не должно происходить, если состояние уже установлено', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['markedKey'],
                Slice: ListSlice,
            });
            const slice = new Slice({
                config: {
                    source: getMemory(),
                    markerVisibility: 'visible',
                    markedKey: 2,
                },
                loadResult: {
                    items: new RecordSet({
                        keyProperty: 'id',
                        rawData: flatData,
                    }),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.setState({ markedKey: 2 });
                slice.setState({ markedKey: 3 });
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
        it('Обновление не должно быть отсеяно, если идет попытка установки текущего состояния во время исполнения другого setState', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['markedKey'],
                Slice: ListSlice,
            });
            const slice = new Slice({
                config: {
                    source: getMemory(),
                    markerVisibility: 'visible',
                    markedKey: 2,
                },
                loadResult: {
                    items: new RecordSet({
                        keyProperty: 'id',
                        rawData: flatData,
                    }),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.setState({ markedKey: 3 });
                slice.setState({ markedKey: 2 });
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('Фильтрация', () => {
        it('Применение структуры фильтров', async () => {
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['filter', 'filterDescription'],
                Slice: ListSlice,
            });
            const slice = new Slice({
                config: {
                    source: getHierarchicalMemory(),
                    parentProperty: 'parent',
                    searchParam: 'testSearchParam',
                    searchValue: 'test',
                    filterDescription: [
                        {
                            name: 'test',
                            value: null,
                            resetValue: null,
                        },
                    ],
                },
                loadResult: {
                    items: new RecordSet(),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                slice.applyFilterDescriptionNew([
                    {
                        name: 'test',
                        value: 1,
                        resetValue: null,
                    },
                ]);
            });

            await awaitMs();

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
