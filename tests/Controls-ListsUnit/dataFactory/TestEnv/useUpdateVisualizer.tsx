import { IListState } from 'Controls/_dataFactory/List/_interface/IListState';
import * as React from 'react';
import { ListSlice } from 'Controls/dataFactory';
import { Record } from 'Types/entity';
import { clone, isEqual } from 'Types/object';

const {
    createRef,
    useContext,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    createContext,
    useCallback,
    forwardRef,
    useImperativeHandle,
} = React;

const SliceContextInitValue = { slice: {} };
const SliceContext = createContext({ slice: {} });

const SliceContextProvider = forwardRef(function (props, ref) {
    const [contextValue, setContextValue] = useState(SliceContextInitValue);
    const rerenderContext = useCallback(() => {
        setContextValue({ slice: clone(contextValue.slice) });
    }, []);

    useImperativeHandle(ref, () => rerenderContext);

    return <SliceContext.Provider value={contextValue}>{props.children}</SliceContext.Provider>;
});

export function useUpdateVisualizer<T extends keyof IListState>(props: {
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
            <SliceContextProvider ref={forceRerenderRef}>
                <TestComponent
                    deps={[...props.deps, 'executedActionsToDispatch']}
                    replacer={props.replacer}
                />
            </SliceContextProvider>
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
