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

type TQueries = typeof queries & {
    getComponent(container: HTMLElement, options?: MatcherOptions): HTMLElement;
    callAction(container: HTMLElement, id: Matcher): Promise<HTMLElement>;
};

type TRenderDemoProps<TSlice extends ListSlice = ListSlice> = RenderOptions<TQueries> & {
    demoProps?: Partial<TBuiltDemoProps<TSlice>> & {
        search?: string;
    };
};

function getApiRef<TSlice extends ListSlice = ListSlice>(
    props: TRenderDemoProps<TSlice>
): React.MutableRefObject<TApi<TSlice> | undefined> {
    if (props.demoProps?.api) {
        return props.demoProps.api;
    }
    return {
        current: undefined,
    };
}

function getDFA(props: TRenderDemoProps): Partial<IListDataFactoryArguments> {
    const search = props.demoProps?.search;

    if (search) {
        return decodeDataFactoryArguments(search);
    }

    const args = props.demoProps?.dataFactoryArguments;

    if (!args) {
        return {};
    }

    return args;
}

function getSearch(props: TRenderDemoProps): string {
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

type CheckChangesArgs = {
    changeMapper?: TChangeMapper;
    enabled?: boolean;
};

export async function renderDemo<TSlice extends ListSlice>(
    DemoComponent: React.ComponentType<TBuiltDemoProps<TSlice>>,
    options: TRenderDemoProps<TSlice>
): Promise<
    RenderResult<TQueries> & {
        slice: TSlice;
        waitForIdle: () => Promise<void>;
        checkChanges: (args?: CheckChangesArgs) => void;
    }
> {
    const apiRef = getApiRef(options);
    const dataFactoryArguments = getDFA(options);

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

    const waitForIdle = async () => {
        await waitFor(() => expect(slice.isIdle()).toBeTruthy());
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
