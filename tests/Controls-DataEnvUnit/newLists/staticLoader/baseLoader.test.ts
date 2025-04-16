import * as ModuleLoader from 'WasabyLoader/ModulesLoader';
import * as PageDeps from 'UICommon/_deps/PageDependencies';
import _baseLoader from 'Controls-DataEnv/newLists/_staticLoader/base/loader';
import { TUI_Dependencies } from 'Controls-DataEnv/newLists/_staticLoader/base/types';

describe('Controls-DataEnv/staticLoader:_baseLoader', () => {
    let isLoadedMock: jest.Mock;
    let loadAsyncMock: jest.Mock;
    let addPageDepsMock: jest.Mock;

    beforeAll(() => {
        const { isLoaded: originalIsLoaded, loadAsync: originalLoadAsync } = ModuleLoader;
        isLoadedMock = jest.fn().mockImplementation((path) => {
            if (typeof path === 'string' && path.includes('testDependency')) {
                return false;
            }
            return originalIsLoaded(path);
        });
        loadAsyncMock = jest.fn().mockImplementation((path) => {
            if (typeof path === 'string' && path.includes('testDependency')) {
                return Promise.resolve();
            }
            return originalLoadAsync(path);
        });
        addPageDepsMock = jest.fn();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ModuleLoader.isLoaded = isLoadedMock;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ModuleLoader.loadAsync = loadAsyncMock;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        PageDeps.addPageDeps = addPageDepsMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('модули подгружаются в случае выполнения условий', () => {
        type TState = {
            testProperty: string;
            testProperty2: string;
        };
        const state: TState = {
            testProperty: 'test',
            testProperty2: 'test',
        };
        const dependencies: TUI_Dependencies<TState> = {
            testDependency: [
                {
                    prop: 'testProperty',
                    value: ['test'],
                },
            ],
            testDependency2: [() => true],
        };
        _baseLoader(Object.keys(dependencies), state, dependencies);
        expect(loadAsyncMock).toHaveBeenCalledTimes(2);
        expect(loadAsyncMock.mock.calls[0][0]).toEqual('testDependency');
        expect(loadAsyncMock.mock.calls[1][0]).toEqual('testDependency2');
        expect(addPageDepsMock).toHaveBeenCalledTimes(2);
    });
    it('метод addPageDeps вызывается с корректными парраметрами', () => {
        type TState = {
            testProperty: string;
            testProperty2: string;
        };
        const state: TState = {
            testProperty: 'test',
            testProperty2: 'test',
        };
        const dependencies: TUI_Dependencies<TState> = {
            testDependency: [() => false],
            testDependency2: [() => true],
            testDependency3: [() => true],
        };
        _baseLoader(Object.keys(dependencies), state, dependencies, true);
        expect(addPageDepsMock).toHaveBeenCalledTimes(2);
        expect(addPageDepsMock.mock.calls[0][0]).toEqual(['testDependency2']);
        expect(addPageDepsMock.mock.calls[1][0]).toEqual(['testDependency3']);
    });
    it('модули не загружаются, если условия не выполняются', () => {
        type TState = {
            testProperty: string;
            testProperty2: string;
        };
        const state: TState = {
            testProperty: 'test',
            testProperty2: 'test',
        };
        const dependencies: TUI_Dependencies<TState> = {
            testDependency: [
                {
                    prop: 'testProperty',
                    value: [],
                },
            ],
            testDependency2: [() => false],
        };
        _baseLoader(Object.keys(dependencies), state, dependencies);
        expect(loadAsyncMock).not.toHaveBeenCalled();
    });
});
