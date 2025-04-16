import { _private_DecomposedPromise } from 'Controls-DataEnv/abstractList';
import {
    ListSlice,
    IListDataFactoryArguments,
    IListDataFactory,
    loadData as ListLoadData,
} from 'Controls-DataEnv/list';
import * as React from 'react';
import { Guid } from 'Types/entity';
import { useEffect, useState } from 'react';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TSliceCtor, TDemoComponentType, TDemoComponentTypeProps } from './types';
import { ContextProvider, TContextProps } from './Context';
import { Actions, TActionsProps } from './Actions';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { useStableCallback } from 'Controls/hooks';
import { getPulseAnimation } from './pulseAnimation';

const WEB_LIST_DATA_FACTORY_NAME = 'Controls-DataEnv/list:factory';
export const COMPONENT_CLASS_NAME = 'js-buildDemo-component';

type TContextConnectorProps<TSlice extends ListSlice> = {
    storeId: string;
    children: TDemoComponentType<TSlice>;
    setSliceCallback: React.Dispatch<React.SetStateAction<TSlice | undefined>>;
    waitForRender: TDemoComponentTypeProps<TSlice>['waitForRender'];
    loading: boolean;
} & Pick<Partial<TActionsProps<TSlice>>, 'actions'>;

const { pulseClassName, pulseStyle } = getPulseAnimation();

/**
 * Обертка, которая строится отложенно, после построения контекста.
 */
function ContextConnector<TSlice extends ListSlice>({
    storeId,
    children: Component,
    setSliceCallback,
    actions,
    waitForRender,
    loading,
}: TContextConnectorProps<TSlice>): React.ReactElement {
    const slice = useStrictSlice(storeId);

    React.useEffect(() => {
        setSliceCallback(slice as TSlice | undefined);
        return () => {
            setSliceCallback(undefined);
        };
    }, [setSliceCallback, slice]);

    return (
        <>
            <style>{pulseStyle}</style>
            {actions && <Actions slice={slice as TSlice} actions={actions} />}
            <div data-qa={COMPONENT_CLASS_NAME} className={loading ? pulseClassName : undefined}>
                <Component
                    storeId={storeId}
                    slice={slice as TSlice}
                    waitForRender={waitForRender}
                />
            </div>
        </>
    );
}

export type THookProps<
    TSlice extends ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments,
> = {
    Slice?: TSliceCtor<TSlice, TDataFactoryArguments>;
    dataFactoryArguments: TDataFactoryArguments;
    Component: TDemoComponentType<TSlice>;
    loadData?: IListDataFactory['loadData'];
} & Pick<TContextConnectorProps<TSlice>, 'actions'>;

export type THookResult<TSlice extends ListSlice> = Partial<TBuildResult<TSlice>> & {
    awaiter: Promise<Required<TBuildResult<TSlice>>>;
};

type TBuildResult<TSlice extends ListSlice> = {
    Component: JSX.Element;
    slice: TSlice;
    storeId: string;
};

/**
 * Подготавливает конфиг для слайса и гагружает данные
 */
function useSlicePrepareConfig<
    TSlice extends ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments,
>(
    sliceCtor: TSliceCtor<TSlice, TDataFactoryArguments>,
    dataFactoryArguments: TDataFactoryArguments,
    loadData: IListDataFactory['loadData']
) {
    const STORE_ID = React.useMemo(() => Guid.create(), []);

    // Конфиг и результаты загрузки
    const configs = React.useMemo<TContextProps['configs']>(
        () => ({
            [STORE_ID]: {
                dataFactoryName: WEB_LIST_DATA_FACTORY_NAME,
                dataFactoryArguments,
            },
        }),
        // configs are readOnly!
        []
    );
    const [loadResults, setLoadResults] = useState<Record<string, unknown> | null>(null);

    // Загружаем данные для слайса
    useEffect(() => {
        Loader.load(configs).then((a) => {
            setLoadResults(a);
        });
    }, [configs]);

    // С помощью "мока" передаем прикладной слайс в демку.
    useEffect(() => {
        const factory = loadSync<(typeof import('Controls-DataEnv/list'))['factory']>(
            WEB_LIST_DATA_FACTORY_NAME
        );

        const originSlice = factory.slice;
        const originLoadData = factory.loadData;

        //@ts-ignore
        factory.slice = sliceCtor;
        //@ts-ignore
        factory.loadData = loadData;

        return () => {
            factory.slice = originSlice;
            factory.loadData = originLoadData;
        };
    }, []);

    return {
        storeId: STORE_ID,
        configs,
        loadResults,
    };
}

export function useWebListSliceOnContext<
    TSlice extends ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments,
>({
    Slice = ListSlice as TSliceCtor<TSlice, TDataFactoryArguments>,
    dataFactoryArguments,
    loadData = ListLoadData,
    Component: ChildComponent,
    actions,
}: THookProps<TSlice, TDataFactoryArguments>): THookResult<TSlice> {
    // Промис полной готовности демки.
    // Разрешается после инициализации всех необходимых полей(например слайс) и полного построения демки.
    const awaiter = React.useMemo(
        () => _private_DecomposedPromise.getDecomposedPromise<TBuildResult<TSlice>>(),
        []
    );

    const renderExtraAwaiter = React.useRef<Promise<void>>();

    const waitForRender = useStableCallback(
        React.useCallback((promise: Promise<void>) => {
            if (!renderExtraAwaiter.current) {
                renderExtraAwaiter.current = promise;
            } else {
                throw Error(
                    'Множественное построение!\n' +
                        'Демо пример несколько раз пытается зарегистрировать промис о завершении построения!'
                );
            }
        }, [])
    );

    // Слайс списка, устанавливается дочерним компонентом, рожденным в контексте.
    // Устанавливается при построении дочернего компонента, ДО полного построения родителя(данной обертки).
    const [slice, setSlice] = React.useState<TSlice>();

    // Флаг, указывающий, что демо пример завершил React-построение.
    // Не является полной готовность, см. awaiter.
    const [isMounted, setIsMounted] = React.useState(false);

    // Флаг полной готовности демки.
    const [isReady, setIsReady] = React.useState(false);
    const [isAwaiterResolveStarted, setIsAwaiterResolveStarted] = React.useState(false);
    const [isAwaiterResolved, setIsAwaiterResolved] = React.useState(false);

    const { storeId, configs, loadResults } = useSlicePrepareConfig(
        Slice,
        dataFactoryArguments,
        loadData
    );

    const Component = React.useMemo(
        () => (
            <ContextProvider configs={configs} loadResults={loadResults}>
                <ContextConnector
                    storeId={storeId}
                    children={ChildComponent}
                    setSliceCallback={setSlice}
                    waitForRender={waitForRender}
                    actions={actions}
                    loading={!isAwaiterResolved}
                />
            </ContextProvider>
        ),
        [ChildComponent, actions, configs, isAwaiterResolved, loadResults, storeId, waitForRender]
    );

    // Хук для отслеживания и установки флага, что демо пример завершил React-построение.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Хук для отслеживания и установки полной готовности демо примера
    useEffect(() => {
        if (slice && !isReady && isMounted) {
            setIsReady(true);
        }
    }, [awaiter, isReady, isMounted, slice]);

    // Резолвим промис единожды при полной готовности демо примера
    useEffect(() => {
        if (!isAwaiterResolveStarted && isReady && slice) {
            setIsAwaiterResolveStarted(true);

            const resolve = () => {
                setIsAwaiterResolved(true);
                awaiter.resolve({
                    Component,
                    slice,
                    storeId,
                });
            };

            const extraAwaiter = renderExtraAwaiter.current;
            if (extraAwaiter) {
                extraAwaiter.then(resolve);
            } else {
                resolve();
            }
        }
    }, [Component, awaiter, isAwaiterResolveStarted, isReady, slice, storeId]);

    return {
        Component,
        awaiter: awaiter.promise,
        slice,
        storeId,
    };
}
