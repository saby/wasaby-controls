import { default as InputContainer } from 'Controls/_searchDeprecated/Input/Container';
import Store from 'Controls/Store';
import { default as Input } from 'Controls/_search/Input/Search';

describe('Controls/_search/Input', () => {
    it('_beforeMount', () => {
        const options = {
            value: 'test',
            minSearchLength: 3,
        };
        const input = new Input(options);
        input._beforeMount(options);
        expect(input._getSearchResolverController().isSearchStarted()).toBeTruthy();
    });

    describe('_beforeUpdate', () => {
        it('inputSearchValue.length > minSearchLength', () => {
            let options = {
                value: '',
                minSearchLength: 3,
            };
            const input = new Input(options);
            input._beforeMount(options);
            input.saveOptions(options);

            options = { ...options };
            options.value = 'test';
            input._beforeUpdate(options);
            expect(input._getSearchResolverController().isSearchStarted()).toBeTruthy();
        });

        it('inputSearchValue.length === minSearchLength', () => {
            let options = {
                inputSearchValue: '',
                minSearchLength: 3,
            };
            const cont = new InputContainer(options);
            cont.saveOptions(options);

            options = { ...options };
            options.inputSearchValue = 'tes';
            cont._beforeUpdate(options);
            expect(cont._value).toEqual('tes');
        });

        it('inputSearchValue.length < minSearchLength', () => {
            let options = {
                inputSearchValue: '',
                minSearchLength: 3,
            };
            const cont = new InputContainer(options);
            cont.saveOptions(options);

            options = { ...options };
            options.inputSearchValue = 'te';
            cont._beforeUpdate(options);
            expect(cont._value).toEqual('te');
        });

        it('inputSearchValue equals current value in input', () => {
            let options = {
                value: 'test',
                minSearchLength: 3,
                searchDelay: 500,
            };
            const input = new Input(options);
            input._beforeMount(options);
            input.saveOptions(options);

            options = { ...options };
            input._beforeUpdate(options);
            expect(input._getSearchResolverController().isSearchStarted()).toBeTruthy();

            options = { ...options };
            input._beforeUpdate(options);
            expect(input._getSearchResolverController().isSearchStarted()).toBeTruthy();
        });
    });

    describe('_resolve', () => {
        it('search', () => {
            const input = new Input({});
            const stub = jest.spyOn(input, '_notify').mockClear().mockImplementation();
            const dispatchStub = jest.spyOn(Store, 'dispatch').mockClear().mockImplementation();

            input._notifySearch('test');
            expect(stub).toHaveBeenCalledWith('search', ['test']);
            expect(dispatchStub).not.toHaveBeenCalled();
        });

        it('searchReset', () => {
            const input = new Input({});
            const stub = jest.spyOn(input, '_notify').mockClear().mockImplementation();
            const dispatchStub = jest.spyOn(Store, 'dispatch').mockClear().mockImplementation();

            input._notifySearchReset();
            expect(stub).toHaveBeenCalledWith('searchReset', ['']);
            expect(dispatchStub).not.toHaveBeenCalled();
        });
    });

    it('_searchClick', () => {
        const input = new Input({});
        const stub = jest.spyOn(input, '_notify').mockClear().mockImplementation();
        input._resolve('test', 'search');

        expect(stub).toHaveBeenCalledWith('search', ['test']);
        stub.mockReset();
    });

    it('_keyDown', () => {
        const cont = new InputContainer({});
        let propagationStopped = false;
        const event = {
            stopPropagation: () => {
                propagationStopped = true;
            },
            nativeEvent: {
                which: 13, // enter
            },
        };

        cont._keyDown(event);
        expect(propagationStopped).toBe(true);
    });

    describe('_beforeUnmount', () => {
        let cont;
        beforeEach(() => {
            cont = new Input({});
        });

        it('should clear the timer on searchResolverController', () => {
            cont._searchResolverController = {
                clearTimer: jest.fn(),
            };

            cont._beforeUnmount();

            expect(cont._searchResolverController.clearTimer).toHaveBeenCalledTimes(1);
        });

        it("should not throw when the _searchResolverController doesn't exist", () => {
            expect(() => {
                cont._beforeUnmount();
            }).not.toThrow();
        });
    });
});
