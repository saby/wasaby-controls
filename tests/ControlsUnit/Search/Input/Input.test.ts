import { default as InputContainer } from 'Controls/_searchDeprecated/Input/Container';
import Store from 'Controls/Store';
import { default as Input } from 'Controls/_search/Input/Search';

describe('Controls/_search/Input', () => {
    it('_beforeMount', () => {
        const options = {
            ...Input.defaultProps,
            value: 'test',
            minSearchLength: 3,
        };
        const input = new Input(options);
        expect(input._getSearchResolverController().isSearchStarted()).toBeTruthy();
    });

    describe('_beforeUpdate', () => {
        it('inputSearchValue.length > minSearchLength', () => {
            let options = {
                ...Input.defaultProps,
                value: '',
                minSearchLength: 3,
            };
            const input = new Input(options);

            options = { ...options };
            options.value = 'test';
            input.shouldComponentUpdate(options);
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
                ...Input.defaultProps,
                value: 'test',
                minSearchLength: 3,
                searchDelay: 500,
            };
            const input = new Input(options);

            options = { ...options };
            input.shouldComponentUpdate(options);
            expect(input._getSearchResolverController().isSearchStarted()).toBeTruthy();

            options = { ...options };
            input.shouldComponentUpdate(options);
            expect(input._getSearchResolverController().isSearchStarted()).toBeTruthy();
        });
    });

    describe('_resolve', () => {
        it('search', () => {
            const options = {
                ...Input.defaultProps,
                onSearch: () => {},
            };
            const onSearch = jest.spyOn(options, 'onSearch').mockClear().mockImplementation();
            const input = new Input(options);
            const dispatchStub = jest.spyOn(Store, 'dispatch').mockClear().mockImplementation();

            input._notifySearch('test');
            expect(onSearch).toHaveBeenCalledWith('test');
            expect(dispatchStub).not.toHaveBeenCalled();
        });

        it('searchReset', () => {
            const options = {
                ...Input.defaultProps,
                onSearchReset: () => {},
            };
            const onSearchReset = jest
                .spyOn(options, 'onSearchReset')
                .mockClear()
                .mockImplementation();
            const input = new Input(options);
            const dispatchStub = jest.spyOn(Store, 'dispatch').mockClear().mockImplementation();

            input._notifySearchReset();
            expect(onSearchReset).toHaveBeenCalledWith('');
            expect(dispatchStub).not.toHaveBeenCalled();
        });
    });

    it('_searchClick', () => {
        const options = {
            ...Input.defaultProps,
            value: '',
            onSearch: () => {},
        };
        const onSearch = jest.spyOn(options, 'onSearch').mockClear().mockImplementation();
        const input = new Input(options);
        input._resolve('test', 'search');

        expect(onSearch).toHaveBeenCalledWith('test');
        onSearch.mockReset();
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
            cont = new Input({ ...Input.defaultProps });
        });

        it('should clear the timer on searchResolverController', () => {
            cont._searchResolverController = {
                clearTimer: jest.fn(),
            };

            cont.componentWillUnmount();

            expect(cont._searchResolverController.clearTimer).toHaveBeenCalledTimes(1);
        });

        it("should not throw when the _searchResolverController doesn't exist", () => {
            expect(() => {
                cont.componentWillUnmount();
            }).not.toThrow();
        });
    });
});
