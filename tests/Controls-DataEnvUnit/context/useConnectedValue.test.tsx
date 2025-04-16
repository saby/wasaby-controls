/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render, waitFor } from '@testing-library/react';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Provider } from 'Controls-DataEnv/context';
import { TestConnectedEditor } from './UseConnected';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';

describe('Controls-DataEnvUnit/context/useConnectedValue', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        container.className += 'container';
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
    });

    it('Чтение полей из FormData', async () => {
        const configs = {
            FormData: {
                dataFactoryName: 'Controls-DataEnv-demo/context/hooks/useConnectedValue/Factory',
                dataFactoryArguments: {},
            },
        };
        const functions: Record<string, Function> = {};
        const setOnChange = (onChangeFunction: Function) => {
            functions.onChangeFunction = onChangeFunction;
        };

        const loadResults = await Loader.load(configs);

        render(
            <Provider configs={configs} loadResults={loadResults}>
                <TestConnectedEditor name={['FormData', 'field1']} setOnChange={setOnChange} />
            </Provider>,
            {
                container,
            }
        );

        const element = container.getElementsByClassName('test-data')[0] as HTMLDivElement;

        expect(element.textContent).toEqual('Первое поле.string');

        // Обновление значения в компоненте при изменении значения в FormSlice
        await waitFor(() => {
            functions.onChangeFunction?.('newValue');
        });
        expect(element.textContent).toEqual('newValue.string');
    });

    it('Чтение типа из typeRepository', async () => {
        const configs: Record<string, IDataConfig> = {
            FormData: {
                dataFactoryName: 'Controls-DataEnv-demo/context/hooks/useConnectedValue/Factory',
                dataFactoryArguments: {},
            },
            TypeRepository: {
                dataFactoryName: 'Controls-DataEnvUnit/context/testDataFactories/TypeRepository',
                dataFactoryArguments: {},
            },
        };

        const loadResults = await Loader.load(configs);
        const name = ['Data', 'TestGraphModel'];
        const functions: Record<string, Function> = {};
        const setOnChange = (onChangeFunction: Function) => {
            functions.onChangeFunction = onChangeFunction;
        };
        const setUpdateTypeRepository = (updateFunction: Function) => {
            functions.updateTypeRepository = updateFunction;
        };

        render(
            <Provider configs={configs} loadResults={loadResults}>
                <TestConnectedEditor
                    name={name}
                    setOnChange={setOnChange}
                    setUpdateTypeRepository={setUpdateTypeRepository}
                />
            </Provider>,
            {
                container,
            }
        );

        const element = container.getElementsByClassName('test-data')[0] as HTMLDivElement;

        expect(element.textContent).toEqual('graphId.model');

        await waitFor(() => {
            functions.updateTypeRepository?.();
        });
        expect(element.textContent).toEqual('graphId.string');
    });
});
