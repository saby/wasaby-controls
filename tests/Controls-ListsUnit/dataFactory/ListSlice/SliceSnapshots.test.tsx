/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { ListSlice } from 'Controls/dataFactory';

import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { act } from 'react-dom/test-utils';
import { render, waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
} from 'Controls/_interface/INavigation';
import { useUpdateVisualizer } from '../TestEnv/useUpdateVisualizer';

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

function getMemory(): Memory {
    return new Memory({
        data: flatData,
        keyProperty: 'key',
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

    it('Вызов mark с параметром устанавливает корректное значение в стейт', async () => {
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

    // describe('Загрузка записей по скролу', () => {
    //     it('Источник вернул ошибку загрузки', async () => {
    //         const error = new fetch.Errors.HTTP({
    //             httpError: HTTPStatus.GatewayTimeout,
    //             message: 'test',
    //             url: 'test',
    //         });
    //         const source = new Memory();
    //         const items = new RecordSet();
    //
    //         source.query = () => Promise.reject(error);
    //
    //         const { Slice, Component } = useUpdateVisualizer({
    //             deps: ['errorViewConfig', 'loading'],
    //             Slice: ListSlice,
    //             replacer: (key, sliceState) => {
    //                 if (key === 'errorViewConfig' && sliceState?.errorViewConfig) {
    //                     return {
    //                         ...sliceState.errorViewConfig,
    //                         options: {
    //                             ...sliceState.errorViewConfig.options,
    //                             error: null,
    //                         },
    //                     };
    //                 }
    //             },
    //         });
    //
    //         const slice = new Slice({
    //             config: {
    //                 source,
    //             },
    //             loadResult: {
    //                 items,
    //             },
    //         });
    //
    //         const { asFragment } = render(<Component />, {
    //             container,
    //         });
    //
    //         await act(async () => {
    //             return slice._loadItemsToDirection('down').catch((error) => error);
    //         });
    //
    //         await waitFor(() => expect(slice.state.errorViewConfig.mode).toStrictEqual('inlist'));
    //
    //         await awaitMs();
    //
    //         expect(asFragment()).toMatchSnapshot();
    //     });
    // });
});
