import Store from 'Controls/Store';

describe('Controls/Store', () => {
    const runContextTests = () => {
        it('without context', () => {
            Store.dispatch('myValue', 'myValue');
            expect(Store.getState().myValue as unknown as string).toEqual('myValue');
        });

        it('with context', () => {
            Store.updateStoreContext('contextName');
            Store.dispatch('myValueWithContext', 'myValue');
            expect(Store.getState().myValueWithContext as unknown as string).toEqual('myValue');
        });

        it('change context', () => {
            Store.updateStoreContext('firstContextName');
            Store.dispatch('myValueChangeContext', 'myFirstValue');
            expect(Store.getState().myValueChangeContext as unknown as string).toEqual(
                'myFirstValue'
            );

            Store.updateStoreContext('secondContextName');
            expect(Store.getState().myValueChangeContext).toEqual(undefined);
            // крайний случай с пустым контекстом

            Store.updateStoreContext(null);
            expect(Store.getState().myValueChangeContext).toEqual(undefined);
        });

        it('should send params in command', () => {
            let declareParams;
            const sendParams = 'test';
            Store.declareCommand('testCommand', (params) => {
                declareParams = params;
            });
            Store.sendCommand('testCommand', sendParams);
            expect(sendParams).toEqual(declareParams);
        });

        it('unsubscribe callbacks', () => {
            let callCounter = 0;
            const callback1 = Store.declareCommand('unsubscribeTest', () => {
                callCounter++;
            });
            const callback2 = Store.declareCommand('unsubscribeTest', () => {
                callCounter++;
            });
            Store.sendCommand('unsubscribeTest');
            expect(callCounter).toEqual(2);

            callCounter = 0;
            Store.unsubscribe(callback1);
            Store.sendCommand('unsubscribeTest');
            expect(callCounter).toEqual(1);

            callCounter = 0;
            Store.unsubscribe(callback2);
            Store.sendCommand('unsubscribeTest');
            expect(callCounter).toEqual(0);
        });
    };

    runContextTests();

    describe('global Context', () => {
        it('getGlobalContextName()', () => {
            Store.setGlobalContextName('');
            expect(Store.getGlobalContextName()).toEqual('');
            Store.setGlobalContextName('testContext');
            expect(Store.getGlobalContextName()).toEqual('testContext');
        });

        it('context removal', () => {
            Store.updateStoreContext('testContext1');
            Store.dispatch('contextVar', 'foo');
            Store.setGlobalContextName('');
            Store.updateStoreContext('testContext1');
            Store.dispatch('contextVar2', 'bar');

            expect(Store.getState().hasOwnProperty('contextVar1')).toBe(false);
            expect(Store.getState().hasOwnProperty('contextVar2')).toBe(true);
        });
    });

    describe('sendCommand callbacks', () => {
        it('local and global callback interaction', () => {
            let calledFirst = false;
            let calledSecond = false;
            const command1 = Store.declareCommand('myCommand', () => {
                calledFirst = true;
            });
            const command2 = Store.declareCommand(
                'myCommand',
                () => {
                    calledSecond = true;
                },
                true
            );
            // Коллбеки команд делятся на глобальные и локальные они не должны пересекаться
            //  при пересечении вызывается только локальный коллбек.
            Store.sendCommand('myCommand');
            expect(calledFirst).toBe(true);
            expect(calledSecond).toBe(false);
            Store.unsubscribe(command1);
            Store.unsubscribe(command2);
        });
    });

    describe('use application context', () => {
        beforeEach(() => {
            Store.setGlobalContextName('testGlobalContext');
        });

        afterEach(() => {
            Store.setGlobalContextName(null);
        });

        runContextTests();

        before(() => {
            Store.dispatch('testValue', 'testValue');
        });
        it('check otherContextValue', () => {
            expect(Store.get('testValue')).toEqual(undefined);
        });
    });

    describe('application context isolation', () => {
        beforeEach(() => {
            Store.updateStoreContext('myContextName');
        });

        it('check commands', () => {
            let called = false;
            Store.setGlobalContextName('appId1');
            const command1 = Store.declareCommand('myCommand', () => {
                expect(false).toBe(true);
            });
            Store.setGlobalContextName('appId2');
            const command2 = Store.declareCommand('myCommand', () => {
                called = true;
            });
            Store.sendCommand('myCommand');
            expect(called).toBe(true);

            Store.unsubscribe(command1);
            Store.unsubscribe(command2);
            called = false;
            Store.sendCommand('myCommand');
            expect(called).toBe(false);
        });

        it('check commands global', () => {
            let called = false;
            Store.setGlobalContextName('appId1');
            const command1 = Store.declareCommand(
                'myCommandGlobal',
                () => {
                    expect(false).toBe(true);
                },
                true
            );
            Store.setGlobalContextName('appId2');
            const command2 = Store.declareCommand(
                'myCommandGlobal',
                () => {
                    called = true;
                },
                true
            );
            Store.sendCommand('myCommandGlobal');
            expect(called).toBe(true);

            Store.unsubscribe(command1);
            Store.unsubscribe(command2);
            Store.sendCommand('myCommandGlobal');
            called = false;
            Store.sendCommand('myCommandGlobal');
            expect(called).toBe(false);
        });

        it('check properties', () => {
            let called = false;
            Store.setGlobalContextName('appId1');
            const prop1 = Store.onPropertyChanged('myProp', () => {
                expect(false).toBe(true);
            });
            Store.setGlobalContextName('appId2');
            const prop2 = Store.onPropertyChanged('myProp', () => {
                called = true;
            });
            Store.dispatch('myProp', 'testValue');
            expect(called).toBe(true);

            Store.unsubscribe(prop1);
            Store.unsubscribe(prop2);
            called = false;
            Store.dispatch('myProp', 'testValue2');
            expect(called).toBe(false);
        });

        it('check properties global', () => {
            let called = false;
            Store.setGlobalContextName('appId1');
            const prop1 = Store.onPropertyChanged(
                'myProp',
                () => {
                    expect(false).toBe(true);
                },
                true
            );
            Store.setGlobalContextName('appId2');
            const prop2 = Store.onPropertyChanged(
                'myProp',
                () => {
                    called = true;
                },
                true
            );
            Store.dispatch('myProp', 'testValue', true);
            expect(called).toBe(true);

            Store.unsubscribe(prop1);
            Store.unsubscribe(prop2);

            called = false;
            Store.dispatch('myProp', 'testValue2');
            expect(called).toBe(false);
        });
    });

    describe('ignore application context isolation', () => {
        beforeEach(() => {
            Store.setGlobalContextName(null, true);
            Store.updateStoreContext('myContextName');
        });

        afterEach(() => {
            Store.setGlobalContextName(null, true);
        });

        it('check properties', () => {
            Store.dispatch('myProp', 'testValue', false, { ignoreContext: true });
            expect(Store.get('myProp')).toEqual('testValue');

            let called = false;
            Store.setGlobalContextName('appId1');

            expect(Store.get('myProp')).toEqual(undefined);
            expect(Store.get('myProp', { ignoreContext: true })).toEqual('testValue');

            const prop1 = Store.onPropertyChanged(
                'myProp',
                () => {
                    expect(false).toBe(true);
                },
                false,
                { ignoreContext: false }
            );
            const prop2 = Store.onPropertyChanged(
                'myProp',
                () => {
                    called = true;
                },
                false,
                { ignoreContext: true }
            );
            Store.dispatch('myProp', 'testValue', false, { ignoreContext: true });
            expect(called).toBe(true);

            Store.unsubscribe(prop1);
            Store.unsubscribe(prop2);
            called = false;
            Store.dispatch('myProp', 'testValue2');
            expect(called).toBe(false);
        });

        it('check properties global', () => {
            Store.dispatch('myProp', 'testValue', true, { ignoreContext: true });
            expect(Store.get('myProp')).toEqual('testValue');

            let called = false;
            Store.setGlobalContextName('appId1');

            expect(Store.get('myProp')).toEqual(undefined);
            expect(Store.get('myProp', { ignoreContext: true })).toEqual('testValue');

            const prop1 = Store.onPropertyChanged(
                'myProp',
                () => {
                    expect(false).toBe(true);
                },
                true,
                { ignoreContext: false }
            );
            const prop2 = Store.onPropertyChanged(
                'myProp',
                () => {
                    called = true;
                },
                true,
                { ignoreContext: true }
            );
            Store.dispatch('myProp', 'testValue', true, { ignoreContext: true });
            expect(called).toBe(true);

            Store.unsubscribe(prop1);
            Store.unsubscribe(prop2);
            called = false;
            Store.dispatch('myProp', 'testValue2');
            expect(called).toBe(false);
        });
    });
});
