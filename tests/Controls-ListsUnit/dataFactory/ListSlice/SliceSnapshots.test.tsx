/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { IListState, ListSlice } from 'Controls/dataFactory';
import {
    createContext,
    useContext,
    useRef,
    useState,
    useMemo,
    createRef,
    forwardRef,
    useImperativeHandle,
    useCallback,
    useLayoutEffect,
} from 'react';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { act } from 'react-dom/test-utils';
import { render, waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
} from 'Controls/_interface/INavigation';
import { isEqual, clone } from 'Types/object';
import { Record } from 'Types/entity';
import { fetch, HTTPStatus } from 'Browser/Transport';

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

const SliceContextInitValue = { slice: {} };
const SliceContext = createContext(SliceContextInitValue);

const SliceContextConnected = forwardRef(function (props, ref) {
    const [contextValue, setContextValue] = useState(SliceContextInitValue);
    const rerenderContext = useCallback(() => {
        setContextValue({ slice: clone(contextValue.slice) });
    }, []);

    useImperativeHandle(ref, () => rerenderContext);

    return <SliceContext.Provider value={contextValue}>{props.children}</SliceContext.Provider>;
});

function useSliceConnected<T extends keyof IListState>(props: {
    deps: T[];
    Slice;
    replacer?: (key: T, sliceState?: IListState) => unknown;
}) {
    const { Slice } = props;
    const forceRerenderRef = createRef();

    return {
        Slice: class extends Slice {
            constructor(config) {
                super({
                    ...config,
                    onChange: () => {
                        forceRerenderRef.current?.();
                    },
                });
                SliceContextInitValue.slice = this;
            }
            protected async __beforeApplyStateInternal(draftStateProp: T): Promise<T> {
                let actions;
                if (draftStateProp._actionToDispatch) {
                    actions = Array.from(draftStateProp._actionToDispatch.keys());
                }
                const newState = await super.__beforeApplyStateInternal(draftStateProp);
                newState.executedActionsToDispatch = actions;
                return newState;
            }
        },
        Component: () => (
            <SliceContextConnected ref={forceRerenderRef}>
                <TestComponent
                    deps={[...props.deps, 'executedActionsToDispatch']}
                    replacer={props.replacer}
                />
            </SliceContextConnected>
        ),
    };
}

function TestComponent<T extends keyof IListState>(props: {
    deps: T[];
    replacer?: (key: T, sliceState?: IListState) => unknown;
}) {
    const previousState = useRef<undefined | IListState>(undefined);
    const watchingPropertiesNames = useMemo(() => props.deps, []);
    const sliceContext = useContext(SliceContext) as unknown as { slice: ListSlice<IListState> };
    const [syncs, setSyncs] = useState<Record<T, unknown>[]>([]);

    useLayoutEffect(() => {
        const { slice } = sliceContext;
        setSyncs((prevSyncs) => {
            const resolveChanges = (keys, initValue) =>
                keys.reduce((acc, propertyName) => {
                    const newValue =
                        props?.replacer?.(propertyName, slice.state) ?? slice.state[propertyName];
                    const prevValue =
                        props?.replacer?.(propertyName, previousState?.current) ??
                        previousState?.current?.[propertyName];
                    // сравнивается содержание и упускается смена ссылки, что приводит к "пустым" рендерам
                    // поправить по задаче: https://online.sbis.ru/opendoc.html?guid=35e9b60d-a8bc-44b8-9b0f-b9907b957d93&client=3
                    if (!isEqual(newValue, prevValue) || !previousState?.current) {
                        acc[propertyName] = clone(newValue);
                    }
                    return acc;
                }, initValue as Record<T, unknown>);

            const watching = resolveChanges(watchingPropertiesNames, {});

            if (Object.keys(watching).length === 0) {
                const otherProps = resolveChanges(Object.keys(slice.state), {});
                const otherPropsKeys = Object.keys(otherProps);
                if (otherPropsKeys.length) {
                    watching.otherProps = otherPropsKeys;
                }
            }

            previousState.current = clone(slice.state);
            return [...prevSyncs, watching];
        });
    }, [sliceContext]);

    return (
        <div>
            {JSON.stringify(
                syncs,
                (key, value) => {
                    switch (typeof value) {
                        case 'function':
                            return 'function';
                        case 'undefined':
                            return 'undefined';
                        default:
                            return value;
                    }
                },
                4
            )}
        </div>
    );
}

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
        const source = getMemory();
        const items = new RecordSet({
            rawData: flatData.slice(0, 2),
            keyProperty: 'key',
        });
        const sliceConfig = {
            source,
            filter: {
                department: 'Platform',
            },
        };
        const sliceLoadResult = {
            items,
        };
        const sliceConstructorParams = {
            config: sliceConfig,
            loadResult: sliceLoadResult,
        };

        const { Slice, Component } = useSliceConnected({
            deps: ['loading', 'markedKey'],
            Slice: ListSlice,
        });
        const slice = new Slice(sliceConstructorParams);

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
        expect(asFragment()).toMatchSnapshot();
    });

    it('При изменении фильтра должна произойти перезагрузка с новым фильтром', async () => {
        const items = new RecordSet({
            rawData: flatData,
            keyProperty: 'key',
        });
        const sliceConfig = {
            source: getMemory(),
            keyProperty: 'key',
            filter: {},
        };
        const sliceLoadResult = {
            items,
        };
        const sliceConstructorParams = {
            config: sliceConfig,
            loadResult: sliceLoadResult,
        };

        const { Slice, Component } = useSliceConnected({
            deps: ['loading', 'filter'],
            Slice: ListSlice,
        });
        const slice = new Slice(sliceConstructorParams);

        const { asFragment } = render(<Component />, {
            container,
        });

        await act(async () => {
            slice.setFilter({
                title: 'Платформа',
            });
        });

        await new Promise((resolve) =>
            setTimeout(() => {
                expect(asFragment()).toMatchSnapshot();
                resolve();
            }, 1000)
        );
    });

    it('После поиска не должно сбрасываться состояние searchInputValue, если оно менялось, пока выполнялся запрос', async () => {
        const items = new RecordSet();
        const sliceConfig = {
            source: getMemory(),
            searchParam: 'testSearchParam',
        };
        const sliceLoadResult = {
            items,
        };
        const sliceConstructorParams = {
            config: sliceConfig,
            loadResult: sliceLoadResult,
        };

        const { Slice, Component } = useSliceConnected({
            deps: ['loading', 'searchInputValue', 'searchValue', 'filter'],
            Slice: ListSlice,
        });
        const slice = new Slice(sliceConstructorParams);

        const { asFragment } = render(<Component />, {
            container,
        });
        await act(async () => {
            slice.search('test');
            await waitFor(() => expect(slice.state.loading).toBeTruthy());
            slice.setSearchInputValue('testPlus');
            await waitFor(() => expect(slice.state.loading).toBeFalsy());
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('Готово. Вызов reload с параметром keepNavigation должен сохранять навигацию при перезагрузке', async () => {
        const source = getMemory();
        const items = new RecordSet({
            rawData: [...flatData.slice(0, 1)],
            keyProperty: 'key',
        });
        const { Slice, Component } = useSliceConnected({
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
                source,
                navigation: getPagingNavigation(false, 1, false),
            },
            loadResult: {
                items,
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

        expect(asFragment()).toMatchSnapshot();
    });

    it('Вызов reload в момент, когда уже идёт загрузка. Стейт loading из-за отмены предыдущей загрузки не должен сбрасываться ', async () => {
        const source = getMemory();
        const items = new RecordSet({
            keyProperty: 'id',
            rawData: flatData,
        });

        const { Slice, Component } = useSliceConnected({
            deps: ['loading', 'filter'],
            Slice: ListSlice,
        });

        const slice: ListSlice = new Slice({
            config: {
                source,
            },
            loadResult: {
                items,
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

        expect(asFragment()).toMatchSnapshot();
    });

    it('selectionViewMode сбрасывается при перезагрузке (вызов метода reload)', async () => {
        const source = getMemory();
        const items = new RecordSet({
            keyProperty: 'id',
            rawData: flatData,
        });

        const { Slice, Component } = useSliceConnected({
            deps: ['loading', 'selectionViewMode'],
            Slice: ListSlice,
        });

        const slice = new Slice({
            config: {
                source,
            },
            loadResult: {
                items,
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

        expect(asFragment()).toMatchSnapshot();
    });

    it('повторный вызов метода reload должен отменить предыдущую загрузку, если она выполняется', async () => {
        const source = getMemory();
        const items = new RecordSet({
            keyProperty: 'id',
            rawData: flatData,
        });

        const { Slice, Component } = useSliceConnected({
            deps: ['loading', 'selectionViewMode'],
            Slice: ListSlice,
        });

        const slice = new Slice({
            config: {
                source,
            },
            loadResult: {
                items,
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

        expect(asFragment()).toMatchSnapshot();
    });

    it('reload должен выполнить перезагрузку и обновить items на стейте', async () => {
        const source = getMemory();
        const items = new RecordSet();

        const { Slice, Component } = useSliceConnected({
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
                source,
            },
            loadResult: {
                items,
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
        const source = new Memory();
        const items = new RecordSet();

        const { Slice, Component } = useSliceConnected({
            deps: ['loading', 'searchValue'],
            Slice: ListSlice,
        });

        const slice = new Slice({
            config: {
                source,
                dataLoadedReturnPromise: false,
                searchParam: 'testSearchParam',
                searchValue: 'test',
            },
            loadResult: {
                items,
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

        expect(asFragment()).toMatchSnapshot();
    });

    describe('Загрузка записей по скролу', () => {
        it('Источник вернул ошибку загрузки', async () => {
            const error = new fetch.Errors.HTTP({
                httpError: HTTPStatus.GatewayTimeout,
                message: 'test',
                url: 'test',
            });
            const source = new Memory();
            const items = new RecordSet();

            source.query = () => Promise.reject(error);

            const { Slice, Component } = useSliceConnected({
                deps: ['errorViewConfig'],
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

            const slice = new Slice({
                config: {
                    source,
                },
                loadResult: {
                    items,
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                return slice._loadItemsToDirection('down').catch((error) => error);
            });

            await waitFor(() => expect(slice.state.errorViewConfig.mode).toStrictEqual('inlist'));

            expect(asFragment()).toMatchSnapshot();
        });
    });
});
