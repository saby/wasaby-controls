/**
 * @jest-environment jsdom
 */

import { useState } from 'react';
import { cleanup, render, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ObjectType, StringType, NumberType, group } from 'Meta/types';

import { BaseSizes, LimitSizes, TValue } from 'Controls-editors/_sizeEditor/constants';
import { useComplexSizeEditor } from 'Controls-editors/_sizeEditor/_hooks/useComplexSizeEditor';

describe('Controls-editors/_sizeEditor/_hooks/useComplexSizeEditor', () => {
    const metaType = ObjectType.properties({
        ...group('Размер', {
            width: StringType.title('Ширина').optional(),
            height: StringType.title('Высота').optional(),
            maxWidth: StringType.title('Max ширина').optional(),
            maxHeight: StringType.title('Max высота').optional(),
            minWidth: StringType.title('Min ширина').optional(),
            minHeight: StringType.title('Min высота').optional(),
            aspectRatio: NumberType.hidden().optional(),
        }),
    });
    const initialValue = {
        width: '100px',
        height: '50%',
        maxWidth: '120px',
        minHeight: '100px',
        aspectRatio: 2,
    };

    describe('changeSizeHandler', () => {
        it('change without metaType', async () => {
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValue);

                return { value, setValue };
            });
            const onChange = (newValue: TValue) =>
                act(async () => stateResult.current.setValue(newValue));
            const initialProps = {
                value: stateResult.current.value,
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            await act(async () => hookResult.current.changeSizeHandler(BaseSizes.width, '150px'));
            rerender({ ...initialProps, value: stateResult.current.value });

            expect(hookResult.current.value).toEqual({
                width: '150px',
                height: '75px',
                aspectRatio: 2,
            });
            expect(hookResult.current.activeSizeTypes).toEqual([BaseSizes.width, BaseSizes.height]);
            expect(hookResult.current.inactiveSizeTypes).toEqual([]);
        });

        it('change with metaType', async () => {
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValue);

                return { value, setValue };
            });
            const onChange = (newValue: TValue) =>
                act(async () => stateResult.current.setValue(newValue));
            const initialProps = {
                value: stateResult.current.value,
                metaType,
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            await act(async () => hookResult.current.changeSizeHandler(BaseSizes.width, '150px'));
            rerender({ ...initialProps, value: stateResult.current.value });

            expect(hookResult.current.value).toEqual({
                width: '150px',
                height: '75px',
                maxWidth: '150px',
                minHeight: '75px',
                aspectRatio: 2,
            });
            expect(hookResult.current.activeSizeTypes).toEqual([
                BaseSizes.width,
                BaseSizes.height,
                LimitSizes.maxWidth,
                LimitSizes.minHeight,
            ]);
            expect(hookResult.current.inactiveSizeTypes).toEqual([
                LimitSizes.minWidth,
                LimitSizes.maxHeight,
            ]);
        });

        it('change base size type without existing size', async () => {
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValue);

                return { value, setValue };
            });
            const onChange = (newValue: TValue) =>
                act(async () => stateResult.current.setValue(newValue));
            const initialProps = {
                value: stateResult.current.value,
                metaType,
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            await act(async () => hookResult.current.changeSizeHandler(BaseSizes.width, ''));
            rerender({ ...initialProps, value: stateResult.current.value });

            expect(hookResult.current.value).toEqual({
                ...initialValue,
                width: '',
            });
            expect(hookResult.current.activeSizeTypes).toEqual([
                BaseSizes.width,
                BaseSizes.height,
                LimitSizes.maxWidth,
                LimitSizes.minHeight,
            ]);
            expect(hookResult.current.inactiveSizeTypes).toEqual([
                LimitSizes.minWidth,
                LimitSizes.maxHeight,
            ]);
        });

        it('change limit size type without existing size', async () => {
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValue);

                return { value, setValue };
            });
            const onChange = (newValue: TValue) =>
                act(async () => stateResult.current.setValue(newValue));
            const initialProps = {
                value: stateResult.current.value,
                metaType,
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            await act(async () => hookResult.current.changeSizeHandler(LimitSizes.maxWidth, ''));
            rerender({ ...initialProps, value: stateResult.current.value });

            const { maxWidth, ...expectedValue } = initialValue;

            expect(hookResult.current.value).toEqual(expectedValue);
            expect(hookResult.current.activeSizeTypes).toEqual([
                BaseSizes.width,
                BaseSizes.height,
                LimitSizes.minHeight,
            ]);
            expect(hookResult.current.inactiveSizeTypes).toEqual([
                LimitSizes.minWidth,
                LimitSizes.maxWidth,
                LimitSizes.maxHeight,
            ]);
        });
    });

    describe('addSizeHandler', () => {
        it('without size in meta type properties', async () => {
            const initialProps = {
                value: initialValue,
            };
            const { result: hookResult } = renderHook(useComplexSizeEditor, { initialProps });

            await act(async () => hookResult.current.addSizeHandler(LimitSizes.maxWidth));

            expect(hookResult.current.value).toEqual({
                width: initialValue.width,
                height: initialValue.height,
                aspectRatio: 2,
            });
            expect(hookResult.current.isActiveAspectRatio).toBeTruthy();
            expect(hookResult.current.activeSizeTypes).toEqual([BaseSizes.width, BaseSizes.height]);
            expect(hookResult.current.inactiveSizeTypes).toEqual([]);
        });

        it('with size in meta type properties', async () => {
            const initialProps = {
                value: {
                    width: initialValue.width,
                    height: initialValue.height,
                },
                metaType,
            };
            const { result: hookResult } = renderHook(useComplexSizeEditor, { initialProps });

            await act(async () => hookResult.current.addSizeHandler(LimitSizes.maxWidth));

            expect(hookResult.current.value).toEqual({
                width: initialValue.width,
                height: initialValue.height,
                maxWidth: '',
                aspectRatio: 0,
            });
            expect(hookResult.current.isActiveAspectRatio).toBeFalsy();
            expect(hookResult.current.activeSizeTypes).toEqual([
                BaseSizes.width,
                BaseSizes.height,
                LimitSizes.maxWidth,
            ]);
            expect(hookResult.current.inactiveSizeTypes).toEqual([
                LimitSizes.minWidth,
                LimitSizes.minHeight,
                LimitSizes.maxHeight,
            ]);
        });
    });

    describe('delSizeHandler', () => {
        it('size type exists', async () => {
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValue);

                return { value, setValue };
            });
            const onChange = (value: TValue) =>
                act(async () => stateResult.current.setValue(value));
            const initialProps = {
                value: stateResult.current.value,
                metaType,
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            act(() => hookResult.current.delSizeHandler(LimitSizes.maxWidth));
            rerender({ ...initialProps, value: stateResult.current.value });

            const { maxWidth, ...expectedValue } = initialValue;

            expect(hookResult.current.value).toEqual(expectedValue);
            expect(hookResult.current.activeSizeTypes).toEqual([
                BaseSizes.width,
                BaseSizes.height,
                LimitSizes.minHeight,
            ]);
            expect(hookResult.current.inactiveSizeTypes).toEqual([
                LimitSizes.minWidth,
                LimitSizes.maxWidth,
                LimitSizes.maxHeight,
            ]);
        });

        it('size type does not exists', async () => {
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValue);

                return { value, setValue };
            });
            const onChange = (value: TValue) =>
                act(async () => stateResult.current.setValue(value));
            const initialProps = {
                value: stateResult.current.value,
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            await act(async () => hookResult.current.delSizeHandler(LimitSizes.maxWidth));
            rerender({ ...initialProps, value: stateResult.current.value });

            expect(hookResult.current.value).toEqual({
                width: initialValue.width,
                height: initialValue.height,
                aspectRatio: initialValue.aspectRatio,
            });
            expect(hookResult.current.activeSizeTypes).toEqual([BaseSizes.width, BaseSizes.height]);
            expect(hookResult.current.inactiveSizeTypes).toEqual([]);
        });

        it('base size type', async () => {
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValue);

                return { value, setValue };
            });
            const onChange = (value: TValue) =>
                act(async () => stateResult.current.setValue(value));
            const initialProps = {
                value: stateResult.current.value,
                metaType,
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            await act(async () => hookResult.current.delSizeHandler(BaseSizes.width));
            rerender({ ...initialProps, value: stateResult.current.value });

            expect(hookResult.current.value).toEqual(initialValue);
            expect(hookResult.current.activeSizeTypes).toEqual([
                BaseSizes.width,
                BaseSizes.height,
                LimitSizes.maxWidth,
                LimitSizes.minHeight,
            ]);
            expect(hookResult.current.inactiveSizeTypes).toEqual([
                LimitSizes.minWidth,
                LimitSizes.maxHeight,
            ]);
        });
    });

    describe('toggleAspectRatio', () => {
        it('value with aspectRatio', async () => {
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValue);

                return { value, setValue };
            });
            const onChange = (value: TValue) =>
                act(async () => stateResult.current.setValue(value));
            const initialProps = {
                value: stateResult.current.value,
                metaType,
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            await act(async () => hookResult.current.toggleAspectRatio());
            rerender({ ...initialProps, value: stateResult.current.value });

            expect(hookResult.current.value).toEqual({
                ...initialValue,
                aspectRatio: 0,
            });
        });

        it('value without aspectRatio and meta type with default value', async () => {
            const { aspectRatio, ...initialValueWithoutAspectRatio } = initialValue;
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValueWithoutAspectRatio);

                return { value, setValue };
            });
            const onChange = (value: TValue) =>
                act(async () => stateResult.current.setValue(value));
            const initialProps = {
                value: stateResult.current.value,
                metaType: ObjectType.properties({
                    ...metaType.getProperties(),
                    aspectRatio: NumberType.defaultValue(2).optional(),
                }),
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            await act(async () => hookResult.current.toggleAspectRatio());
            rerender({ ...initialProps, value: stateResult.current.value });

            expect(hookResult.current.value).toEqual({
                width: initialValue.width,
                height: '50px',
                maxWidth: '120px',
                minHeight: '50px',
                aspectRatio: 2,
            });
        });

        it('value without aspectRatio and meta type without default value', async () => {
            const { aspectRatio, ...initialValueWithoutAspectRatio } = initialValue;
            const { result: stateResult } = renderHook(() => {
                const [value, setValue] = useState<TValue>(initialValueWithoutAspectRatio);

                return { value, setValue };
            });
            const onChange = (value: TValue) =>
                act(async () => stateResult.current.setValue(value));
            const initialProps = {
                value: stateResult.current.value,
                metaType: ObjectType.properties({
                    ...metaType.getProperties(),
                    aspectRatio: NumberType.optional(),
                }),
                onChange,
            };
            const { result: hookResult, rerender } = renderHook(useComplexSizeEditor, {
                initialProps,
            });

            await act(async () => hookResult.current.toggleAspectRatio());
            rerender({ ...initialProps, value: stateResult.current.value });

            expect(hookResult.current.value).toEqual({
                ...initialValue,
                aspectRatio: 0,
            });
        });
    });
});
