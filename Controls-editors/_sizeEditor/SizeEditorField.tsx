import { FC, useCallback, memo, useMemo, useEffect, useState } from 'react';
import clsx from 'clsx';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Button as DropdownButton } from 'Controls/dropdown';
import { Number as NumberEditor } from 'Controls/input';
import { Button } from 'Controls/buttons';
import { useInputEditorValue } from 'Controls-editors/input';
import { TSizeEditorAspectRatioToggler } from './AspectRatioToggler';

import * as rk from 'i18n!Controls-editors';

export interface IConstraint {
    min: number;
    max: number;
}

interface IUnitItems {
    key: string;
    title: string;
}

export interface ISizeEditorField extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    showName?: boolean;
    value: string;
    defaultValue?: string;
    showUnit?: boolean;
    unitItems?: IUnitItems[];
    showBorder?: boolean;
    inputAlign?: 'left' | 'right' | 'center';
    showIterateButtons?: boolean;
    units?: KeyUnits[];
    constraints?: Record<string, IConstraint>;
    absoluteValue?: number;
    percentValue?: number;
    title?: string;
    afterEditorContent?: FC<TSizeEditorAspectRatioToggler>;
}

export enum KeyUnits {
    pixel = 'px',
    percent = '%',
    fit = 'fit',
    fill = 'fill',
}
export const BASE_UNITS = [KeyUnits.pixel, KeyUnits.percent];
export const ALL_UNITS = Object.values(KeyUnits);

const keyUnitToStringMap = (unit: KeyUnits): string => {
    if (unit === KeyUnits.fit) return rk('По контенту');

    if (unit === KeyUnits.fill) return rk('Заполнить');

    return unit;
};

const DEFAULT_RADIX = 10;
const DEFAULT_UNITS = [KeyUnits.pixel, KeyUnits.percent];
const UNIT_ITEMS_DEFAULT: IUnitItems[] = [
    { key: KeyUnits.pixel, title: rk('Фиксированная (px)') },
    { key: KeyUnits.percent, title: rk('Относительная (%)') },
    { key: KeyUnits.fit, title: rk('По контенту') },
    { key: KeyUnits.fill, title: rk('Заполнить') },
];

const DEFAULT_CONSTRAINT = { min: 0, max: Infinity };
const DEFAULT_CONSTRAINTS: Record<KeyUnits, IConstraint> = {
    [KeyUnits.pixel]: DEFAULT_CONSTRAINT,
    [KeyUnits.percent]: DEFAULT_CONSTRAINT,
};

const FILL_UNIT_STYLE = '100%';
const FIT_UNIT_STYLE = 'auto';

export interface ISplitResult {
    baseUnits: KeyUnits;
    baseSize: string;
}

export function parseStyleValue(value: string, units?: KeyUnits[]): ISplitResult | void {
    const match = value.match(/(\d+\.*\d*)(\D*)/);

    if (!match) {
        if (units?.length && !units.includes(KeyUnits.fit)) return;

        return {
            baseSize: value,
            baseUnits: KeyUnits.fit,
        };
    }

    if (value === FILL_UNIT_STYLE && (!units?.length || units.includes(KeyUnits.fill))) {
        return {
            baseSize: match[1],
            baseUnits: KeyUnits.fill,
        };
    }

    return {
        baseSize: match[1],
        baseUnits: match[2] as KeyUnits,
    };
}
// fix
export const convertSizeToStyle = (
    size: string,
    unit: KeyUnits,
    constrains?: Record<string, IConstraint>
): string => {
    if (unit === KeyUnits.fit) return FIT_UNIT_STYLE;

    if (unit === KeyUnits.fill) return FILL_UNIT_STYLE;

    return `${constrainValue(size, unit, constrains)}${unit}`;
};

const checkChangeableUnit = (unit: KeyUnits): boolean =>
    [KeyUnits.pixel, KeyUnits.percent].includes(unit);

function constrainValue(
    value: string,
    unit: string,
    constraints: Record<string, IConstraint>
): string {
    if (!constraints?.[unit]) return value;

    const { min, max } = constraints?.[unit];

    if (+value < min) {
        return min.toString();
    }

    if (+value > max) {
        return max.toString();
    }

    return value;
}

interface IButtonsReadOnly {
    readOnlyAdd: boolean;
    readOnlySubtract: boolean;
}

function getButtonsReadOnly(
    inputValue: string,
    unit: KeyUnits,
    constraints: Record<string, IConstraint>
): IButtonsReadOnly {
    const value = +inputValue;
    const { min, max } = constraints[unit] || DEFAULT_CONSTRAINT;
    const addAvailable = value + 1 <= max && value + 1 >= min;
    const subtractAvailable = value - 1 <= max && value - 1 >= min;
    const isChangeableUnit = checkChangeableUnit(unit);

    return {
        readOnlyAdd: !isChangeableUnit && !addAvailable,
        readOnlySubtract: !isChangeableUnit && !subtractAvailable,
    };
}

export const SizeEditorField = memo(
    ({
        value,
        defaultValue = '',
        LayoutComponent,
        onChange,
        name = '',
        showName = false,
        title = '',
        unitItems,
        showBorder = false,
        showUnit = true,
        showIterateButtons = false,
        inputAlign = 'left',
        units = DEFAULT_UNITS,
        constraints = DEFAULT_CONSTRAINTS,
        absoluteValue,
        percentValue,
        metaType,
        // TODO: временное решение, так как в гриде отобразить сложно
        afterEditorContent,
    }: ISizeEditorField) => {
        const inputBorder = showBorder ? 'partial' : 'hidden';
        const unitSelectorClass = clsx({
            'controls-PropertyGrid-sizeEditor__select_border': showBorder,
        });
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
                baseUnits: KeyUnits.pixel,
            };
        }, [value, units, absoluteValue]);

        const [selectedUnit, setSelectedUnit] = useState<KeyUnits>(baseUnits);

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
        const onLocalValueChange = useCallback(
            (val) => {
                const newValue = constrainValue(val, selectedUnit, constraints);

                setInputValue(newValue);
            },
            [setInputValue, constraints, selectedUnit]
        );

        useEffect(() => {
            const newValue = value ? `${parseInt(value, DEFAULT_RADIX)}` : '';
            setInputValue(newValue);
        }, [value]);

        const isChangeableUnit = useMemo(() => checkChangeableUnit(selectedUnit), [selectedUnit]);
        const actualValue = useMemo(() => {
            if (isChangeableUnit) return inputValue;

            return absoluteValue?.toString() || '0';
        }, [isChangeableUnit, inputValue, absoluteValue]);

        const onChangeValue = useCallback(
            (newSize: string, newUnits: KeyUnits) => {
                if (typeof onChange === 'function') {
                    onChange(convertSizeToStyle(newSize, newUnits, constraints));
                }
            },
            [onChange, constraints]
        );

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
            [onChangeValue, actualValue, constraints, setInputValue]
        );

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
            <div
                className={
                    'ws-flexbox controls-PropertyGrid-sizeEditor__input ws-align-items-baseline'
                }
            >
                {showName && (
                    <span className="controls-PropertyGrid-sizeEditor__inputLabel">{name}</span>
                )}
                <div
                    className={clsx('ws-flexbox', {
                        'controls-PropertyGrid-sizeEditor__input_border': !showBorder,
                    })}
                >
                    <NumberEditor
                        textAlign={inputAlign}
                        value={actualValue}
                        valueChangedCallback={onLocalValueChange}
                        onInputCompleted={onChangeSize}
                        borderVisibility={inputBorder}
                        className="controls-Input__width-6ch"
                        placeholder="Auto"
                        onlyPositive={true}
                        precision={0}
                        integersLength={5}
                        readOnly={!isChangeableUnit}
                        fontColorStyle={isChangeableUnit ? 'default' : 'readonly'}
                    />
                    {showUnit ? (
                        <UnitSelector
                            caption={keyUnitToStringMap(selectedUnit)}
                            items={unitItems}
                            units={units}
                            className={unitSelectorClass}
                            onChange={onChangeUnits}
                        />
                    ) : null}
                    {showIterateButtons ? (
                        <IterateButtons
                            readOnlyAdd={readOnlyAdd}
                            readOnlySubtract={readOnlySubtract}
                            onAdd={onAddClick}
                            onSubtract={onSubtractClick}
                        />
                    ) : null}
                    {afterEditorContent}
                </div>
            </div>
        );

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
    }
);

const DROPDOWN_EVENTS = ['onSelectedKeyChanged'];

interface IUnitSelectorProps {
    caption: string;
    items: IUnitItems[] | undefined;
    units: string[];
    className: string;
    onChange: (newUnit: string) => void;
}

function UnitSelector({
    caption,
    items,
    units,
    className,
    onChange,
}: IUnitSelectorProps): JSX.Element {
    const unitItems = useMemo(() => {
        const rawData = items ? items : UNIT_ITEMS_DEFAULT.filter(({ key }) => units.includes(key));

        return new RecordSet({
            keyProperty: 'key',
            rawData,
        });
    }, [items, units]);

    const readOnly = useMemo(() => unitItems.getCount() <= 1, [unitItems]);

    const onMenuItemActivate = useCallback(
        (item: Model) => {
            onChange(item.getKey());
        },
        [onChange]
    );

    return (
        // @ts-ignore
        <DropdownButton
            className={`controls-PropertyGrid-sizeEditor__select ${className}`}
            items={unitItems}
            caption={caption}
            keyProperty="key"
            displayProperty="title"
            customEvents={DROPDOWN_EVENTS}
            viewMode="link"
            closeButtonVisibility={false}
            headerTemplate={null}
            buttonStyle="unaccented"
            fontColorStyle="unaccented"
            inlineHeight="m"
            readOnly={readOnly}
            onMenuItemActivate={onMenuItemActivate}
        />
    );
}

interface ISizeIteratorProps {
    readOnlyAdd?: boolean;
    readOnlySubtract?: boolean;
    onAdd: () => void;
    onSubtract: () => void;
}

function IterateButtons({
    readOnlyAdd = false,
    readOnlySubtract = false,
    onAdd,
    onSubtract,
}: ISizeIteratorProps): JSX.Element {
    return (
        <div>
            <Button
                viewMode="filled"
                buttonStyle="pale"
                icon="icon-Subtraction"
                className="controls-margin_left-s controls-margin_right-2xs"
                data-qa="SizeEditorField__subtractionButton"
                readOnly={readOnlySubtract}
                onClick={onSubtract}
            />
            <Button
                viewMode="filled"
                buttonStyle="pale"
                icon="icon-Addition"
                data-qa="SizeEditorField__additionButton"
                readOnly={readOnlyAdd}
                onClick={onAdd}
            />
        </div>
    );
}
