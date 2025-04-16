import * as React from 'react';
import {
    render,
    waitFor,
    act,
    queries,
    Matcher,
    RenderOptions,
    MatcherOptions,
    RenderResult,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    TApi,
    COMPONENT_CLASS_NAME,
    TBuiltDemoProps,
} from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import {
    encodeDataFactoryArguments,
    decodeDataFactoryArguments,
} from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo/withURLCustomizer';
import { IListDataFactoryArguments, ListSlice } from 'Controls-DataEnv/list';
import { getChanges, loadDebug } from './getStateChanges';
import type { TChangeMapper } from 'Controls-DataEnv/listDebug';
import { MockConsole } from 'Controls-DataEnvUnit/newLists/TestEnv/mockConsole';
import * as AbstractList from 'Controls-DataEnv/abstractList';

type TQueries = typeof queries & {
    getComponent(container: HTMLElement, options?: MatcherOptions): HTMLElement;
    callAction(container: HTMLElement, id: Matcher): Promise<HTMLElement>;
};

type TRenderDemoProps<
    TSlice extends ListSlice = ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments = IListDataFactoryArguments,
> = RenderOptions<TQueries> & {
    demoProps?: Partial<TBuiltDemoProps<TSlice, TDataFactoryArguments>> & {
        search?: string;
    };
};

function getApiRef<
    TSlice extends ListSlice = ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments = IListDataFactoryArguments,
>(
    props: TRenderDemoProps<TSlice, TDataFactoryArguments>
): React.MutableRefObject<TApi<TSlice> | undefined> {
    if (props.demoProps?.api) {
        return props.demoProps.api;
    }
    return {
        current: undefined,
    };
}

function getDFA<TSlice extends ListSlice, TDataFactoryArguments extends IListDataFactoryArguments>(
    props: TRenderDemoProps<TSlice, TDataFactoryArguments>
): Partial<TDataFactoryArguments> {
    const search = props.demoProps?.search;

    if (search) {
        return decodeDataFactoryArguments<TDataFactoryArguments>(search);
    }

    const args = props.demoProps?.dataFactoryArguments;

    if (!args) {
        return {};
    }

    return args;
}

function getSearch<TSlice extends ListSlice>(props: TRenderDemoProps<TSlice>): string {
    const search = props.demoProps?.search;

    if (search) {
        return search;
    }

    const args = props.demoProps?.dataFactoryArguments;

    if (args) {
        return encodeDataFactoryArguments(args);
    }

    return '';
}

const defaultChangeMapper: TChangeMapper = (key, value) => {
    if (key === 'collection') {
        // @ts-expect-error for testing purpose only
        return value?._moduleName;
    }
};

const mockGetError = () => {
    const pendingErrors = new Set<Promise<void | Error>>();
    const originalGetError = AbstractList.getError;
    jest.spyOn(AbstractList, 'getError').mockImplementation(((...args) => {
        const promise = originalGetError(...args);
        pendingErrors.add(promise);
        promise.then(() => {
            pendingErrors.delete(promise);
        });
        return promise;
    }) as typeof AbstractList.getError);
    return pendingErrors;
};

type CheckChangesArgs = {
    changeMapper?: TChangeMapper;
    enabled?: boolean;
};

export async function renderDemo<
    TSlice extends ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments,
>(
    DemoComponent: React.ComponentType<TBuiltDemoProps<TSlice, TDataFactoryArguments>>,
    options: TRenderDemoProps<TSlice, TDataFactoryArguments>
): Promise<
    RenderResult<TQueries> & {
        slice: TSlice;
        waitForIdle: (timeout?: number) => Promise<void>;
        checkChanges: (args?: CheckChangesArgs) => void;
    }
> {
    const apiRef = getApiRef<TSlice, TDataFactoryArguments>(options);
    const dataFactoryArguments = getDFA<TSlice, TDataFactoryArguments>(options);

    const showURI = () => {
        const demoName =
            DemoComponent?.prototype?._moduleName ||
            DemoComponent.displayName ||
            DemoComponent.name;

        MockConsole.getInstance().writeInfoInOriginConsole(`${demoName}${getSearch(options)}`);
    };

    const customQueries: TQueries = {
        ...queries,
        ...options.queries,
        getComponent: (container: HTMLElement, o?: MatcherOptions) => {
            return queries.getByTestId(container, COMPONENT_CLASS_NAME, o);
        },
        callAction: async (container: HTMLElement, id: Matcher): Promise<HTMLElement> => {
            const button = queries.getByTestId(container, id);

            await act(async () => {
                await userEvent.click(button);
            });

            return button;
        },
    };

    await loadDebug();

    showURI();

    const renderResult = render<TQueries>(
        <DemoComponent api={apiRef} dataFactoryArguments={dataFactoryArguments} />,
        {
            ...options,
            queries: customQueries,
        }
    );

    const api = apiRef.current;

    if (!api) {
        throw Error(
            'Исключение при выполнении утилиты renderDemo!\n' +
                'Построение демо примера не началось.'
        );
    }

    await act(async () => {
        await api.awaiter;
    });

    const { slice } = api;

    if (!slice) {
        throw Error(
            'Исключение при выполнении утилиты renderDemo.\n' +
                'Построение демо примера прошло некорректно.\n' +
                'API для работы с демо примером не проинициализировано.'
        );
    }
    const pendingErrors = mockGetError();

    const waitForIdle = async (timeout?: number) => {
        await waitFor(() => expect(slice.isIdle() && !pendingErrors.size).toBeTruthy(), {
            timeout: timeout ?? 1000,
        });
    };

    await waitForIdle();

    return {
        ...renderResult,
        slice: slice as TSlice,
        waitForIdle,
        checkChanges: (checkChangesArgs?: CheckChangesArgs) =>
            expect(
                !api.storeId || checkChangesArgs?.enabled === false
                    ? []
                    : getChanges(api.storeId, checkChangesArgs?.changeMapper ?? defaultChangeMapper)
            ).toMatchSnapshot(),
    };
}
