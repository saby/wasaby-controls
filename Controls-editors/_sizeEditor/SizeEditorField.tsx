import { FC, useCallback, memo, useMemo, useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { Number as NumberEditor } from 'Controls/input';
import { Button } from 'Controls/buttons';
import { useInputEditorValue } from 'Controls-editors/input';
import { TSizeEditorAspectRatioToggler } from './AspectRatioToggler';
import SizeEditorUnit, { IUnitItems } from './SizeEditorUnit';
import SizeEditorIterateButtons, { getButtonsReadOnly } from './SizeEditorIterateButtons';
import { IConstraint, constrainValue, DEFAULT_CONSTRAINTS } from './_utils/constraint';
import { parseStyleValue, convertSizeToStyle, ISplitResult } from './_utils/convert';
import { checkIsBaseSize, checkIsBaseUnit, splitSizeType } from './_utils/functions';
import { keyUnitToStringMap } from './_utils/maps';
import { KeyUnits, LimitSizePrefix, DEFAULT_RADIX, BASE_UNITS, FIT_UNIT_STYLE } from './constants';

import * as rk from 'i18n!Controls-editors';

export interface ISizeEditorField extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    showName?: boolean;
    value: string;
    defaultValue?: string;
    defaultUnit?: KeyUnits;
    showUnit?: boolean;
    unitItems?: IUnitItems[];
    inputAlign?: 'left' | 'right' | 'center';
    showIterateButtons?: boolean;
    units?: KeyUnits[];
    constraints?: Record<string, IConstraint>;
    absoluteValue?: number;
    percentValue?: number;
    title?: string;
    afterEditorContent?: FC<TSizeEditorAspectRatioToggler>;
    onDelete?: Function;
    autoFocus?: boolean;
}

export const SizeEditorField = memo((props: ISizeEditorField) => {
    const {
        value,
        defaultValue = '',
        defaultUnit,
        LayoutComponent,
        onChange,
        name = '',
        showName = false,
        title = '',
        unitItems,
        showUnit = true,
        showIterateButtons = false,
        inputAlign = 'left',
        units = BASE_UNITS,
        constraints = DEFAULT_CONSTRAINTS,
        absoluteValue,
        percentValue,
        metaType,
        // TODO: временное решение, так как в гриде отобразить сложно
        afterEditorContent,
        onDelete,
        autoFocus = false,
    } = props;

    const numberEditorRef = useRef();
    const localValueRef = useRef<string>();
    // TODO: позже менять локальным стэйтом baseUnits, когда появится absoluteValue (название другое может быть)
    const { baseUnits, baseSize } = useMemo<ISplitResult>(() => {
        const parsedSize = parseStyleValue(value, units);

        if (parsedSize) {
            return {
                baseSize: parsedSize.baseSize,
                baseUnits: parsedSize.baseUnits,
            };
        }

        return {
            baseSize: absoluteValue?.toString() || '',
            baseUnits: defaultUnit || KeyUnits.pixel,
        };
    }, [value, units, absoluteValue]);

    const [selectedUnit, setSelectedUnit] = useState<KeyUnits>(baseUnits);

    const isChangeableUnit = useMemo(() => checkIsBaseUnit(selectedUnit), [selectedUnit]);

    const { defaultUnits, defaultSize } = useMemo(() => {
        const parsedDefaultSize = defaultValue && parseStyleValue(defaultValue, units);

        if (parsedDefaultSize) {
            return {
                defaultSize: parsedDefaultSize.baseSize,
                defaultUnits: parsedDefaultSize.baseUnits,
            };
        }

        return {
            defaultSize: '',
            defaultUnits: '',
        };
    }, [defaultValue, units, absoluteValue]);
    const { changeHandler: setInputValue, localValue: inputValue } = useInputEditorValue({
        value: baseSize,
    });

    const onChangeValue = useCallback(
        (newSize: string, newUnits: KeyUnits) => {
            if (typeof onChange === 'function') {
                onChange(convertSizeToStyle(newSize, newUnits, constraints));
                setSelectedUnit(newUnits);
            }
        },
        [onChange, constraints]
    );

    const onLocalValueChange = useCallback(
        (val) => {
            const newUnit = isChangeableUnit ? selectedUnit : KeyUnits.pixel;

            setSelectedUnit(newUnit);
            setInputValue(val);
        },
        [setInputValue, selectedUnit, isChangeableUnit]
    );

    const actualValue = useMemo(() => {
        if (isChangeableUnit) return inputValue;

        return '';
    }, [isChangeableUnit, inputValue, absoluteValue]);

    const onChangeSize = useCallback(
        (newSize: string | null) => {
            if (newSize) {
                onChangeValue(newSize, selectedUnit);
            } else {
                onChangeValue(defaultSize, defaultUnits);
            }
        },
        [selectedUnit, onChangeValue, defaultSize, defaultUnits]
    );

    const onChangeUnits = useCallback(
        (newUnits: KeyUnits): void => {
            if (newUnits === selectedUnit) return;

            let newValue = constrainValue(actualValue, newUnits, constraints);

            if (percentValue && newUnits === KeyUnits.percent) {
                newValue = percentValue.toString();
            } else if (absoluteValue && newUnits === KeyUnits.pixel) {
                newValue = absoluteValue.toString();
            }

            setSelectedUnit(newUnits);
            setInputValue(newValue);

            onChangeValue(newValue, newUnits);
        },
        [baseUnits, onChangeValue, actualValue, constraints, setInputValue]
    );

    const placeholderValue = useMemo(() => {
        if (selectedUnit === KeyUnits.percent) return percentValue;

        return absoluteValue;
    }, [selectedUnit, absoluteValue, percentValue]);

    // need tests on autofocus and change value on blur
    const onBlur = useCallback(() => {
        const sizeType = metaType?.getOrigin()?.key;
        const { limitPrefix } = splitSizeType(sizeType);

        if (checkIsBaseSize(sizeType) || value || inputValue) return;

        if (limitPrefix === LimitSizePrefix.min) {
            return onChangeValue(placeholderValue?.toString() || '0', KeyUnits.pixel);
        }

        onChangeValue('100', KeyUnits.percent);
        setSelectedUnit(KeyUnits.percent);
    }, [value, inputValue, absoluteValue, autoFocus, metaType, onChangeValue, setSelectedUnit]);

    const onAddClick = useCallback(() => {
        onChangeSize(String(+inputValue + 1));
    }, [inputValue, onChangeSize]);

    const onSubtractClick = useCallback(() => {
        onChangeSize(String(+inputValue - 1));
    }, [inputValue, onChangeSize]);

    const { readOnlyAdd, readOnlySubtract } = getButtonsReadOnly(
        inputValue,
        selectedUnit,
        constraints
    );

    const content = (
        <div className={'ws-flexbox controls-PropertyGrid-sizeEditor__input ws-align-items-center'}>
            {showName && (
                <span className="controls-PropertyGrid-sizeEditor__inputLabel">{name}</span>
            )}
            <div className={clsx('ws-flexbox', 'controls-PropertyGrid-sizeEditor__input_border')}>
                <NumberEditor
                    ref={numberEditorRef}
                    textAlign={inputAlign}
                    value={actualValue}
                    valueChangedCallback={onLocalValueChange}
                    onInputCompleted={onChangeSize}
                    borderVisibility="hidden"
                    className="controls-Input__width-6ch"
                    placeholder={Math.trunc(placeholderValue || 0).toString()}
                    onlyPositive={true}
                    changeValueByArrows
                    precision={0}
                    integersLength={5}
                    onBlur={onBlur}
                />
                {showUnit ? (
                    <SizeEditorUnit
                        caption={keyUnitToStringMap(selectedUnit)}
                        items={unitItems}
                        units={units}
                        activeUnit={selectedUnit}
                        onChange={onChangeUnits}
                    />
                ) : null}
                {showIterateButtons ? (
                    <SizeEditorIterateButtons
                        readOnlyAdd={readOnlyAdd}
                        readOnlySubtract={readOnlySubtract}
                        onAdd={onAddClick}
                        onSubtract={onSubtractClick}
                    />
                ) : null}
                {afterEditorContent}
            </div>
            {onDelete && (
                <Button
                    viewMode="link"
                    icon="icon-Close"
                    iconSize="s"
                    iconStyle="unaccented"
                    className="controls-margin_left-xs"
                    onClick={onDelete}
                />
            )}
        </div>
    );

    // нужно для правильного изменения value извне
    useEffect(() => {
        localValueRef.current = convertSizeToStyle(inputValue, selectedUnit, constraints);
    }, [inputValue, selectedUnit, constraints]);

    useEffect(() => {
        if (!localValueRef.current || value === localValueRef.current) return;

        setInputValue(baseSize);
        setSelectedUnit(baseUnits);
    }, [value]);

    useEffect(() => {
        // lifehack for activate added size type
        if (autoFocus) numberEditorRef.current?.activate();
    }, [autoFocus]);

    if (!!LayoutComponent) {
        const props = {};
        if (!!title) {
            props.title = title;
        }
        if (!!metaType) {
            props.metaType = metaType;
        }
        return <LayoutComponent {...props}>{content}</LayoutComponent>;
    }

    return content;
});
