/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react';
import { RootContextProvider, Provider } from 'Controls-DataEnv/context';
import TestWidget from './TestWidget';
import { simpleHierarchyConfig } from 'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig';

const dataConfigs = {
    contextConfigs: simpleHierarchyConfig.contextConfigs,
};

function PageComponent(props: { value?: string }): JSX.Element {
    return (
        <RootContextProvider dataConfigs={dataConfigs}>
            <Provider dataLayoutId={'root'}>
                <Provider dataLayoutId={'firstGetter'}>
                    <Provider dataLayoutId={'secondGetter'}>
                        <Provider dataLayoutId={'thirdGetter'}>
                            <TestWidget storeId={'simpleElement'} value={props.value} />
                        </Provider>
                    </Provider>
                </Provider>
            </Provider>
        </RootContextProvider>
    );
}

describe('Controls-DataEnvUnit/HierarchySliceContext/hooks/useSlice', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
        container = null;
    });

    test('widget получает доступ к слайсу из корня контекста по иерархии', async () => {
        const { rerender, getByTestId } = render(<PageComponent />, { container });

        await waitFor(() => {
            expect(getByTestId('Test_Widget').innerHTML).toBe('simpleElementValue');
        });

        rerender(<PageComponent value={'newSliceValue'} />);
        await waitFor(() => {
            expect(getByTestId('Test_Widget').innerHTML).toBe('newSliceValue');
        });
    });
});
