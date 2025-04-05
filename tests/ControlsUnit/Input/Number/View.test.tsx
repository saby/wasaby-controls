/**
 * @jest-environment jsdom
 */
import { useState } from 'react';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { Number } from 'Controls/input';

// TODO: пока скип потому что иногда падает в jenkins при сборке
// локально не падает
describe.skip('Controls/input:Number', () => {
    describe('change value by Up/Down arrow keys', () => {
        it('integer number', async () => {
            const onKeyDownMock = jest.fn();
            const onKeyUpMock = jest.fn();
            const user = userEvent.setup();

            const { result: localState } = renderHook(() => {
                const [value, setValue] = useState<string>('0');

                return { value, setValue };
            });
            const { result: state } = renderHook(() => {
                const [value, setValue] = useState<string>('1');

                return { value, setValue };
            });

            const onValueChanged = jest.fn((newValue: string) =>
                act(() => localState.current.setValue(newValue))
            );
            const onInputCompleted = jest.fn((newValue: string) =>
                act(() => state.current.setValue(newValue))
            );

            const { rerender } = render(
                <Number
                    value={localState.current.value}
                    valueChangedCallback={onValueChanged}
                    onInputCompleted={onInputCompleted}
                    onKeyUp={onKeyUpMock}
                    onKeyDown={onKeyDownMock}
                    integersLength={2}
                    minValue={-1}
                    maxValue={10}
                />
            );

            const input = document.querySelector(
                '.controls-Field.js-controls-Field.controls-InputBase__nativeField'
            );

            // проверка изменения значения до потери фокуса
            await user.click(input);
            await user.keyboard('{ArrowUp>5}');

            expect(localState.current.value).toBe('5');
            expect(state.current.value).toBe('1');

            // проверка значения после потери фокуса
            await user.keyboard('{Enter}');

            expect(localState.current.value).toBe('5');
            expect(state.current.value).toBe('5');
            expect(onValueChanged.mock.calls.length).toBe(5);
            expect(onInputCompleted.mock.calls.length).toBe(1);
            expect(onKeyDownMock.mock.calls.length).toBe(6);
            expect(onKeyUpMock.mock.calls.length).toBe(1);

            // проверка ограничения maxValue={10}
            await user.keyboard('{ArrowUp>10/}{Enter}');

            expect(localState.current.value).toBe('10');
            expect(state.current.value).toBe('10');

            // проверка ограничения minValue={-1}
            await user.keyboard('{ArrowDown>20/}{Enter}');

            expect(localState.current.value).toBe('-1');
            expect(state.current.value).toBe('-1');

            rerender(
                <Number
                    value={localState.current.value}
                    valueChangedCallback={onValueChanged}
                    onInputCompleted={onInputCompleted}
                    onKeyUp={onKeyUpMock}
                    onKeyDown={onKeyDownMock}
                    integersLength={2}
                    onlyPositive
                    minValue={-1}
                    maxValue={10}
                />
            );

            // проверка ограничения onlyPositive
            await user.keyboard('{ArrowDown>10/}{Enter}');

            expect(localState.current.value).toBe('0');
            expect(state.current.value).toBe('0');

            rerender(
                <Number
                    value={localState.current.value}
                    valueChangedCallback={onValueChanged}
                    onInputCompleted={onInputCompleted}
                    onKeyUp={onKeyUpMock}
                    onKeyDown={onKeyDownMock}
                    integersLength={2}
                />
            );

            // проверка ограничения на количество цифр
            await user.keyboard('{ArrowUp>120/}{Enter}');

            expect(localState.current.value).toBe('99');
            expect(state.current.value).toBe('99');
        });

        it('precission number', async () => {
            const user = userEvent.setup();
            let value = '5.567';
            const onChangeMock = jest.fn((newValue: string) => (value = newValue));

            const { rerender } = render(
                <Number
                    value={value}
                    valueChangedCallback={onChangeMock}
                    onInputCompleted={onChangeMock}
                />
            );

            const input = document.querySelector(
                '.controls-Field.js-controls-Field.controls-InputBase__nativeField'
            );

            await user.click(input);
            await user.keyboard('{ArrowUp>5/}');

            expect(value).toBe('10.567');

            rerender(
                <Number
                    value={value}
                    valueChangedCallback={onChangeMock}
                    onInputCompleted={onChangeMock}
                    precision={2}
                />
            );

            await user.keyboard('{ArrowUp>5/}');

            expect(value).toBe('15.56');

            rerender(
                <Number
                    value={value}
                    valueChangedCallback={onChangeMock}
                    onInputCompleted={onChangeMock}
                    precision={0}
                />
            );

            await user.keyboard('{ArrowUp>5/}');

            expect(value).toBe('20');
        });
    });
});
