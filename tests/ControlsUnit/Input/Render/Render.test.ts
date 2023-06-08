import { SyntheticEvent } from 'Vdom/Vdom';
import { Render, IRenderOptions } from 'Controls/input';

describe('Controls.input:Render', () => {
    let inst: Render;
    const defaultOptions: Partial<IRenderOptions> = Render.getDefaultOptions();
    beforeEach(() => {
        inst = new Render(defaultOptions);
    });
    describe('_beforeMount', () => {
        describe('Check _border state', () => {
            it('partial', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    borderVisibility: 'partial',
                    multiline: false,
                } as IRenderOptions);

                expect(inst._border).toEqual({
                    top: false,
                    bottom: true,
                });
            });
            it('partial and minLines', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    borderVisibility: 'partial',
                    minLines: 2,
                } as IRenderOptions);

                expect(inst._border).toEqual({
                    top: false,
                    bottom: true,
                });

                inst._beforeUpdate({
                    ...defaultOptions,
                    borderVisibility: 'partial',
                    contrastBackground: false,
                    minLines: 2,
                } as IRenderOptions);

                expect(inst._border).toEqual({
                    top: true,
                    bottom: true,
                });

                inst._beforeUpdate({
                    ...defaultOptions,
                    borderVisibility: 'partial',
                    minLines: 1,
                } as IRenderOptions);

                expect(inst._border).toEqual({
                    top: false,
                    bottom: true,
                });
            });
            it('hidden', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    borderVisibility: 'hidden',
                } as IRenderOptions);

                expect(inst._border).toEqual({
                    top: false,
                    bottom: false,
                });
            });
        });
        describe('Check _state and _statePrefix state', () => {
            it('readonly', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    readOnly: true,
                } as IRenderOptions);

                expect(inst._state).toEqual('readonly');
                expect(inst._statePrefix).toEqual('');
            });
            it('readonly and state', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    readOnly: true,
                    state: 'test',
                } as IRenderOptions);

                expect(inst._state).toEqual('test-readonly');
                expect(inst._statePrefix).toEqual('_test');
            });
            it('readonly and multiline', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    readOnly: true,
                    multiline: true,
                } as IRenderOptions);

                expect(inst._state).toEqual('readonly-text-multiline');
                expect(inst._statePrefix).toEqual('');
            });
            it('readonly and multiline and state', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    readOnly: true,
                    multiline: true,
                    state: 'test',
                } as IRenderOptions);

                expect(inst._state).toEqual('test-readonly-text-multiline');
                expect(inst._statePrefix).toEqual('_test');
            });
            it('borderStyle and validationStatus = valid', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    validationStatus: 'valid',
                    borderStyle: 'success',
                } as IRenderOptions);

                expect(inst._state).toEqual('success');
                expect(inst._statePrefix).toEqual('');
            });
            it('borderStyle and validationStatus = valid and state', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    validationStatus: 'valid',
                    borderStyle: 'success',
                    state: 'test',
                } as IRenderOptions);

                expect(inst._state).toEqual('test-success');
                expect(inst._statePrefix).toEqual('_test');
            });
            it('validationStatus = invalid', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    validationStatus: 'invalid',
                } as IRenderOptions);

                expect(inst._state).toEqual('invalid');
                expect(inst._statePrefix).toEqual('');
            });
            it('validationStatus = invalid and state', () => {
                inst._beforeMount({
                    ...defaultOptions,
                    validationStatus: 'invalid',
                    state: 'test',
                } as IRenderOptions);

                expect(inst._state).toEqual('test-invalid');
                expect(inst._statePrefix).toEqual('_test');
            });
            it('validationStatus = invalid and contentActive', () => {
                const options: IRenderOptions = {
                    ...defaultOptions,
                    validationStatus: 'invalid',
                } as IRenderOptions;
                inst._beforeMount(options);
                inst._options = options;
                const event = new SyntheticEvent<FocusEvent>({} as FocusEvent);
                jest.spyOn(Render, 'notSupportFocusWithin')
                    .mockClear()
                    .mockImplementation(() => {
                        return true;
                    });
                inst._setContentActive(event, true);

                expect(inst._state).toEqual('invalid-active');
                expect(inst._statePrefix).toEqual('');

                jest.restoreAllMocks();
            });
            it('validationStatus = invalid and contentActive and state', () => {
                const options: IRenderOptions = {
                    ...defaultOptions,
                    validationStatus: 'invalid',
                    state: 'test',
                } as IRenderOptions;
                inst._beforeMount(options);
                inst._options = options;
                const event = new SyntheticEvent<FocusEvent>({} as FocusEvent);
                jest.spyOn(Render, 'notSupportFocusWithin')
                    .mockClear()
                    .mockImplementation(() => {
                        return true;
                    });
                inst._setContentActive(event, true);

                expect(inst._state).toEqual('test-invalid-active');
                expect(inst._statePrefix).toEqual('_test');

                jest.restoreAllMocks();
            });
        });
    });
});
