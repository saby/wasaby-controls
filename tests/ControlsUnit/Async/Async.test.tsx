/**
 * @jest-environment jsdom
 */
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UICommon/Utils';
import { default as Async } from 'Controls/Container/Async';

describe('Controls/Container/Async', () => {
    const moduleName = 'ControlsUnit/Async/FailCallback/TestControlAsync';
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);

        jest.useFakeTimers();
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(
            setTimeout
        );
        jest.spyOn(Logger, 'warn').mockImplementation();
        jest.spyOn(Logger, 'error').mockImplementation();
        jest.spyOn(console, 'error').mockImplementation();
        jest.spyOn(ModulesLoader, 'loadAsync').mockRejectedValue(new Error());
        jest.spyOn(ModulesLoader, 'unloadSync').mockImplementation();
    });

    afterEach(() => {
        jest.useRealTimers();
        unmountComponentAtNode(container);
        container.remove();
        jest.restoreAllMocks();
    });

    test('Асинхронная провальная загрузка на клиенте без errorCallback', async () => {
        let instance;
        act(() => {
            render(
                <Async
                    ref={(v) => {
                        instance = v;
                    }}
                    templateName={moduleName}
                    templateOptions={{}}
                />,
                container
            );
        });

        await act(async () => {
            jest.runAllTimers();
        });

        await act(async () => {
            jest.runAllTimers();
        });

        expect(instance.error).toMatchSnapshot();
        expect(instance.optionsForComponent.resolvedTemplate).toBeUndefined();
    });

    test('Асинхронная провальная загрузка на клиенте с errorCallback', async () => {
        const errorCallback = jest.fn();

        let instance;
        act(() => {
            render(
                <Async
                    ref={(v) => {
                        instance = v;
                    }}
                    templateName={moduleName}
                    templateOptions={{}}
                    errorCallback={errorCallback}
                />,
                container
            );
        });

        await act(async () => {
            jest.runAllTimers();
        });

        await act(async () => {
            jest.runAllTimers();
        });

        expect(instance.error).toBeUndefined();
        expect(instance.optionsForComponent.resolvedTemplate).toBeUndefined();
        expect(errorCallback).toBeCalledTimes(1);
        expect(errorCallback.mock.calls[0][0]).toBeDefined(); // первый аргумент - viewConfig
        expect(errorCallback.mock.calls[0][1]).toBeDefined(); // второй аргумент - error
    });
});
