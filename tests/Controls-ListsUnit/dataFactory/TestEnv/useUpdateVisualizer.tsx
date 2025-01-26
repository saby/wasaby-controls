import { IListState } from 'Controls-DataEnv/list';
import * as React from 'react';
import { ListSlice } from 'Controls/dataFactory';
import { clone } from 'Types/object';
import { ISliceConstructorProps } from 'Controls-DataEnv/_dataFactory/interface/IDataFactory';
import { isEqual } from 'Controls-ListsUnit/dataFactory/TestEnv/utils';

const {
    createRef,
    useContext,
    useLayoutEffect,
    useRef,
    useState,
    createContext,
    useCallback,
    forwardRef,
    useImperativeHandle,
} = React;

const SliceContextInitValue = { slice: {} };
const SliceContext = createContext({ slice: {} });

const SliceContextProvider = forwardRef(function (
    props: { children: React.ReactNode },
    ref: React.ForwardedRef<() => void>
) {
    const [contextValue, setContextValue] = useState(SliceContextInitValue);
    const rerenderContext = useCallback(() => {
        setContextValue((prevState) => ({ slice: clone(prevState.slice) }));
    }, []);

    useImperativeHandle(ref, () => rerenderContext);

    return <SliceContext.Provider value={contextValue}>{props.children}</SliceContext.Provider>;
});

export function useUpdateVisualizer<
    State extends IListState = IListState,
    DepsKey extends string = Extract<keyof State, string>,
>(props: {
    deps: DepsKey[];
    Slice: new (constructorProps: ISliceConstructorProps<unknown, unknown>) => ListSlice<State>;
    replacer?: (key: DepsKey[][number], sliceState?: State) => unknown;
    assertBeforeBas?: (prevState: IListState, nextState: IListState) => void;
    assertAfterBas?: (prevState: IListState, nextState: IListState) => void;
}) {
    const { Slice } = props;
    const forceRerenderRef = createRef<() => void | undefined>();

    return {
        Slice: class extends Slice {
            constructor(config: ISliceConstructorProps<unknown, unknown>) {
                super({
                    ...config,
                    onChange: () => {
                        forceRerenderRef.current?.();
                    },
                });
                SliceContextInitValue.slice = this;
            }

            protected async _beforeApplyState(draftStateProp: State): Promise<State> {
                props.assertBeforeBas?.(this.state, draftStateProp);
                const newState = await super._beforeApplyState(draftStateProp);
                props.assertAfterBas?.(this.state, newState);
                return newState;
            }
        },
        Component: () => (
            <SliceContextProvider ref={forceRerenderRef}>
                <TestComponent deps={props.deps} replacer={props.replacer} />
            </SliceContextProvider>
        ),
    };
}

function TestComponent<
    State extends IListState = IListState,
    DepsKey extends string = Extract<keyof State, string>,
>(props: { deps: DepsKey[]; replacer?: (key: DepsKey[][number], sliceState?: State) => unknown }) {
    const previousState = useRef<undefined | State>(undefined);
    const watchingPropertiesNamesRef = useRef(props.deps);
    const replacerRef = useRef(props.replacer);
    const sliceContext = useContext(SliceContext) as unknown as { slice: ListSlice<State> };
    const [syncs, setSyncs] = useState<Record<DepsKey | 'otherProps', unknown>[]>([]);

    useLayoutEffect(() => {
        const { slice } = sliceContext;
        setSyncs((prevSyncs: Record<DepsKey | 'otherProps', unknown>[]) => {
            const getPropertyFromState = (propertyName: DepsKey, state?: State): unknown =>
                replacerRef.current?.(propertyName, state) ?? state?.[propertyName as keyof State];

            const resolveChanges = (
                keys: DepsKey[],
                initValue?: Record<DepsKey | 'otherProps', unknown>
            ): Record<DepsKey | 'otherProps', unknown> =>
                keys.reduce(
                    (acc: Record<DepsKey | 'otherProps', unknown>, propertyName: DepsKey) => {
                        const newValue = getPropertyFromState(propertyName, slice.state);
                        const prevValue = getPropertyFromState(
                            propertyName,
                            previousState?.current
                        );

                        if (newValue !== prevValue || !previousState?.current) {
                            acc[propertyName] =
                                prevValue && isEqual(newValue, prevValue)
                                    ? 'НОВАЯ ССЫЛКА'
                                    : clone(newValue);
                        }
                        return acc;
                    },
                    initValue ?? ({} as Record<DepsKey | 'otherProps', unknown>)
                );

            const watching = resolveChanges(watchingPropertiesNamesRef.current);

            if (Object.keys(watching).length === 0) {
                const otherProps = resolveChanges(Object.keys(slice.state) as DepsKey[]);
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
                (_, value) => {
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
