/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react';
import { RootContextProvider, Provider } from 'Controls-DataEnv/context';
import TestWidget from './TestWidget';
import { simpleHierarchyConfig } from 'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig';
import { useMemo } from 'react';

const dataConfigs = {
    contextConfigs: simpleHierarchyConfig.contextConfigs,
};

function PageComponent(props: { value?: string; getSlice: Function }): JSX.Element {
    return (
        <RootContextProvider dataConfigs={dataConfigs}>
            <Provider dataLayoutId={'root'}>
                <Provider dataLayoutId={'firstGetter'}>
                    <Provider dataLayoutId={'secondGetter'}>
                        <Provider dataLayoutId={'thirdGetter'}>
                            <TestWidget storeId={'simpleElement'} getSlice={props.getSlice} />
                        </Provider>
                    </Provider>
                </Provider>
            </Provider>
        </RootContextProvider>
    );
}

function NestedProvidersPage(props: { getSlice?: Function }): JSX.Element {
    const config1 = useMemo(() => {
        return {
            configs: {
                firstSlice: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                    dataFactoryArguments: {},
                },
            },
            loadResults: {
                firstSlice: {
                    value: 'firstSlice',
                },
            },
        };
    }, []);

    const config2 = useMemo(() => {
        return {
            configs: {
                secondSlice: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                    dataFactoryArguments: {},
                },
            },
            loadResults: {
                secondSlice: {
                    value: 'secondSlice',
                },
            },
        };
    }, []);

    return (
        <Provider configs={config1.configs} loadResults={config1.loadResults}>
            <Provider configs={config2.configs} loadResults={config2.loadResults}>
                <>
                    <TestWidget storeId={'firstSlice'} getSlice={props.getSlice} />
                    <TestWidget storeId={'secondSlice'} getSlice={props.getSlice} />
                </>
            </Provider>
        </Provider>
    );
}

describe('Controls-DataEnvUnit/HierarchySliceContext/hooks/useSlice', () => {
    let container = null;
    let slices = {};

    function registerSlice(storeId: string, slice: any): void {
        slices[storeId] = slice;
    }

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        slices = {};
    });

    afterEach(() => {
        container.remove();
        container = null;
        slices = {};
    });

    test('widget получает доступ к слайсу из корня контекста по иерархии', async () => {
        const { getByTestId } = render(<PageComponent getSlice={registerSlice} />, { container });
        expect(getByTestId('simpleElement').innerHTML).toBe('simpleElementValue');

        await waitFor(() => {
            slices.simpleElement.setState({
                value: 'newSliceValue',
            });
        });
        expect(getByTestId('simpleElement').innerHTML).toBe('newSliceValue');
    });

    test('widget получает доступ к слайсу по иерархии вложенных провайдеров', async () => {
        const { getByTestId } = render(<NestedProvidersPage getSlice={registerSlice} />, {
            container,
        });
        expect(getByTestId('firstSlice').innerHTML).toBe('firstSlice');
        expect(getByTestId('secondSlice').innerHTML).toBe('secondSlice');

        await waitFor(() => {
            slices.firstSlice.setState({
                value: 'newValue',
            });
        });
        expect(getByTestId('firstSlice').innerHTML).toBe('newValue');

        await waitFor(() => {
            slices.secondSlice.setState({
                value: 'newValue',
            });
        });

        expect(getByTestId('secondSlice').innerHTML).toBe('newValue');
    });
});
