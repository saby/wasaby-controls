import { default as InputContainer } from 'Controls/_search/Input/Container';
import { SyntheticEvent } from 'UI/Vdom';
import Store from 'Controls/Store';

describe('Controls/_search/Input/Container', () => {
    it('_beforeMount', () => {
        const options = {
            inputSearchValue: 'test',
            minSearchLength: 3,
        };
        const cont = new InputContainer(options);
        cont._value = '';
        cont._beforeMount(options);
        expect(cont._value).toEqual('test');
        expect(
            cont._getSearchResolverController().isSearchStarted()
        ).toBeTruthy();
    });

    describe('_beforeUpdate', () => {
        it('inputSearchValue.length > minSearchLength', () => {
            let options = {
                inputSearchValue: '',
                minSearchLength: 3,
            };
            const cont = new InputContainer(options);
            cont.saveOptions(options);

            options = { ...options };
            options.inputSearchValue = 'test';
            cont._beforeUpdate(options);
            expect(cont._value).toEqual('test');
            expect(
                cont._getSearchResolverController().isSearchStarted()
            ).toBeTruthy();
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
            expect(
                cont._getSearchResolverController().isSearchStarted()
            ).toBeTruthy();
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
            expect(
                !cont._getSearchResolverController().isSearchStarted()
            ).toBeTruthy();
        });

        it('inputSearchValue equals current value in input', () => {
            let options = {
                inputSearchValue: 'test',
                minSearchLength: 3,
                searchDelay: 500,
            };
            const cont = new InputContainer(options);
            cont._beforeMount(options);
            cont.saveOptions(options);

            options = { ...options };
            options.inputSearchValue = 'te';
            cont._valueChanged(null, 'te');
            cont._beforeUpdate(options);
            expect(cont._value).toEqual('te');
            expect(
                cont._getSearchResolverController().isSearchStarted()
            ).toBeTruthy();

            options = { ...options };
            options.inputSearchValue = 'ту';
            cont._beforeUpdate(options);
            expect(cont._value).toEqual('ту');
            expect(
                cont._getSearchResolverController().isSearchStarted()
            ).toBeTruthy();
        });
    });

    describe('_resolve', () => {
        it('search', () => {
            const cont = new InputContainer({});
            const stub = jest
                .spyOn(cont, '_notify')
                .mockClear()
                .mockImplementation();
            const dispatchStub = jest
                .spyOn(Store, 'dispatch')
                .mockClear()
                .mockImplementation();

            cont._notifySearch('test');
            expect(stub).toHaveBeenCalledWith(
                'search',
                ['test'],
                expect.anything()
            );
            expect(dispatchStub).not.toHaveBeenCalled();
        });

        it('searchReset', () => {
            const cont = new InputContainer({});
            const stub = jest
                .spyOn(cont, '_notify')
                .mockClear()
                .mockImplementation();
            const dispatchStub = jest
                .spyOn(Store, 'dispatch')
                .mockClear()
                .mockImplementation();

            cont._notifySearchReset();
            expect(stub).toHaveBeenCalledWith(
                'searchReset',
                [''],
                expect.anything()
            );
            expect(dispatchStub).not.toHaveBeenCalled();
        });
    });

    it('_searchClick', () => {
        const cont = new InputContainer({});
        cont._value = 'test';
        const stub = jest
            .spyOn(cont, '_notify')
            .mockClear()
            .mockImplementation();
        cont._searchClick(null);

        expect(stub).toHaveBeenCalledWith(
            'search',
            ['test'],
            expect.anything()
        );
        stub.mockReset();

        cont._value = '';
        cont._searchClick(null);
        expect(stub).not.toHaveBeenCalled();
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

    describe('_valueChanged', () => {
        const cont = new InputContainer({});
        let called = false;
        cont._searchResolverController = {
            resolve: (value) => {
                called = true;
            },
        };

        it('new value not equally old value', () => {
            cont._value = '';
            cont._valueChanged(null, 'newValue');

            expect(cont._value).toEqual('newValue');
            expect(called).toBe(true);
        });

        it('new value equally old value', () => {
            called = false;
            cont._valueChanged(null, 'newValue');

            expect(called).toBe(false);
        });

        it('_beforeMount with inputSearchValue, then valueChanged', () => {
            jest.useFakeTimers();
            const inputContainerOptions = InputContainer.getDefaultOptions();
            inputContainerOptions.inputSearchValue = 'testValue';

            const inputContainer = new InputContainer(inputContainerOptions);
            const stubNotify = jest
                .spyOn(inputContainer, '_notify')
                .mockClear()
                .mockImplementation();
            inputContainer._beforeMount(inputContainerOptions);
            inputContainer.saveOptions(inputContainerOptions);

            inputContainer._valueChanged({} as SyntheticEvent, 'testValue2');
            expect(stubNotify).not.toHaveBeenCalledWith(
                'search',
                ['testValue2'],
                { bubbling: true }
            );

            jest.advanceTimersByTime(inputContainerOptions.searchDelay);
            expect(stubNotify).toHaveBeenCalledWith('search', ['testValue2'], {
                bubbling: true,
            });
        });
    });

    describe('_beforeUnmount', () => {
        let cont;
        beforeEach(() => {
            cont = new InputContainer({});
        });

        it('should clear the timer on searchResolverController', () => {
            cont._searchResolverController = {
                clearTimer: jest.fn(),
            };

            cont._beforeUnmount();

            expect(
                cont._searchResolverController.clearTimer
            ).toHaveBeenCalledTimes(1);
        });

        it("should not throw when the _searchResolverController doesn't exist", () => {
            expect(() => {
                cont._beforeUnmount();
            }).not.toThrow();
        });
    });
});
