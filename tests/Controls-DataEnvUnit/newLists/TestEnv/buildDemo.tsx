import { IListDataFactoryArguments, ListSlice } from 'Controls-DataEnv/list';
import * as React from 'react';
import {
    THookProps,
    THookResult,
    useWebListSliceOnContext,
    COMPONENT_CLASS_NAME,
} from './buildDemo/useWebListSliceOnContext';
import { withURLCustomizer } from './buildDemo/withURLCustomizer';
import { _ListScrollContext } from 'Controls/scroll';

export { COMPONENT_CLASS_NAME };

type TBuildDemoProps<
    TSlice extends ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments,
> = Omit<THookProps<TSlice, TDataFactoryArguments>, 'dataFactoryArguments'> & {
    demoPath: string;
    getDataFactoryArguments: () => TDataFactoryArguments;
};

export type TBuiltDemoProps<
    TSlice extends ListSlice = ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments = IListDataFactoryArguments,
> = {
    api?: React.MutableRefObject<TApi<TSlice> | undefined>;
    dataFactoryArguments?: Partial<TDataFactoryArguments>;
};

export type TApi<TSlice extends ListSlice = ListSlice> = Omit<THookResult<TSlice>, 'Component'>;

// Мокаем тут консольный вывод логгера, делаем так, чтобы он выводил куда то, откуда тест может прочитать это.
export function buildDemo<
    TSlice extends ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments,
>(props: TBuildDemoProps<TSlice, TDataFactoryArguments>) {
    const STYLE: React.CSSProperties = {
        padding: 20,
    };
    const dataFactoryArguments = props.getDataFactoryArguments();

    const Demo = React.forwardRef(
        (
            composedProps: TBuiltDemoProps<TSlice, TDataFactoryArguments>,
            ref: React.ForwardedRef<HTMLDivElement>
        ) => {
            const { Component, awaiter, storeId, slice } = useWebListSliceOnContext<
                TSlice,
                TDataFactoryArguments
            >({
                Component: props.Component,
                Slice: props.Slice,
                dataFactoryArguments: {
                    ...dataFactoryArguments,
                    ...composedProps.dataFactoryArguments,
                },
                loadData: props.loadData,
                actions: props.actions,
            });

            React.useEffect(() => {
                if (composedProps.api) {
                    const api = (composedProps.api.current = composedProps.api.current || {
                        awaiter,
                        storeId,
                        slice,
                    });
                    api.awaiter = awaiter;
                    api.storeId = storeId;
                    api.slice = slice;
                }
            }, [awaiter, storeId, slice, composedProps.api]);

            return (
                // Уничтожаем контекст скролла.
                // На демках мы живем в скролл контейнере и из за этого может показаться, что всё работает.
                <_ListScrollContext.Provider value={undefined}>
                    <div ref={ref} style={STYLE}>
                        {Component}
                    </div>
                </_ListScrollContext.Provider>
            );
        }
    );

    Demo.displayName = props.demoPath;

    return withURLCustomizer(Demo, dataFactoryArguments);
}
