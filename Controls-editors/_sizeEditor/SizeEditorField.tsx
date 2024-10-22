import { Fragment, useCallback, memo, useMemo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Button as DropdownButton } from 'Controls/dropdown';
import { Number as NumberEditor } from 'Controls/input';
import { Button } from 'Controls/buttons';
import { useInputEditorValue } from 'Controls-editors/input';

import * as rk from 'i18n!Controls-editors';

export interface IConstraint {
    min: number;
    max: number;
}

interface IUnitItems {
    key: string;
    title: string;
}

interface ISizeEditor extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    showName?: boolean;
    value: string;
    defaultValue?: string;
    showUnit?: boolean;
    unitItems?: IUnitItems[];
    showBorder?: boolean;
    inputAlign?: 'left' | 'right' | 'center';
    showIterateButtons?: boolean;
    units?: string[];
    constraints?: Record<string, IConstraint>;
}

enum KeyUnits {
    pixel = 'px',
    percent = '%',
}

const DEFAULT_UNITS = [KeyUnits.pixel, KeyUnits.percent];
const UNIT_ITEMS_DEFAULT: IUnitItems[] = [
    { key: KeyUnits.pixel, title: rk('Пиксели (px)') },
    { key: KeyUnits.percent, title: rk('Проценты (%)') },
];

const DEFAULT_CONSTRAINT = { min: 1, max: Infinity };
const DEFAULT_CONSTRAINTS: Record<KeyUnits, IConstraint> = {
    [KeyUnits.pixel]: DEFAULT_CONSTRAINT,
    [KeyUnits.percent]: { min: 1, max: 100 },
};

interface ISplitResult {
    baseUnits: string;
    baseSize: string;
}

function splitSize(value: string): ISplitResult {
    const result: ISplitResult = { baseUnits: '', baseSize: '' };
    const match = value.match(/(\d+\.*\d*)(\D*)/) ?? [];

    if (match) {
        result.baseSize = match[1];
        result.baseUnits = match[2];
    }

    return result;
}

function constrainValue(
    value: number,
    unit: string,
    constraints: Record<string, IConstraint>
): number {
    const { min, max } = constraints[unit] || DEFAULT_CONSTRAINT;

    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
}

interface IButtonsReadOnly {
    readOnlyAdd: boolean;
    readOnlySubtract: boolean;
}

function getButtonsReadOnly(
    inputValue: string,
    unit: string,
    constraints: Record<string, IConstraint>
): IButtonsReadOnly {
    const value = +inputValue;
    const { min, max } = constraints[unit] || DEFAULT_CONSTRAINT;
    const addAvailable = value + 1 <= max && value + 1 >= min;
    const subtractAvailable = value - 1 <= max && value - 1 >= min;

    return {
        readOnlyAdd: !addAvailable,
        readOnlySubtract: !subtractAvailable,
    };
}

export const SizeEditorField = memo(
    ({
        value,
        defaultValue = '',
        LayoutComponent = Fragment,
        onChange,
        name = '',
        showName = false,
        unitItems,
        showBorder = false,
        showUnit = true,
        showIterateButtons = false,
        inputAlign = 'right',
        units = DEFAULT_UNITS,
        constraints = DEFAULT_CONSTRAINTS,
    }: ISizeEditor) => {
        const inputBorder = showBorder ? 'partial' : 'hidden';
        const unitSelectorClass = showBorder
            ? 'controls-PropertyGrid-sizeEditor__select_border'
            : '';
        const inputClass = showBorder ? '' : 'controls-PropertyGrid-sizeEditor__input_border';
        const { baseUnits = 'px', baseSize } = splitSize(value);
        const { baseSize: defaultSize, baseUnits: defaultUnits = baseUnits } =
            splitSize(defaultValue);
        const { changeHandler: setInputValue, localValue: inputValue } = useInputEditorValue({
            value: baseSize,
        });

        const onChangeValue = useCallback(
            (newSize: string, newUnits: string) => {
                if (typeof onChange === 'function') {
                    onChange(`${newSize}${newUnits}`);
                }
            },
            [onChange]
        );

        const onChangeSize = useCallback(
            (newSize: string | null) => {
                if (newSize) {
                    const size = String(constrainValue(+newSize, baseUnits, constraints));
                    setInputValue(size);
                    onChangeValue(size, baseUnits);
                } else {
                    setInputValue(defaultSize);
                    onChangeValue(defaultSize, defaultUnits);
                }
            },
            [baseUnits, constraints, setInputValue, onChangeValue, defaultSize, defaultUnits]
        );

        const onChangeUnits = useCallback(
            (newUnits: string) => {
                const newSize = String(constrainValue(+baseSize, newUnits, constraints));
                onChangeValue(newSize, newUnits);
            },
            [baseSize, constraints, onChangeValue]
        );

        const onAddClick = useCallback(() => {
            onChangeSize(String(+inputValue + 1));
        }, [inputValue, onChangeSize]);

        const onSubtractClick = useCallback(() => {
            onChangeSize(String(+inputValue - 1));
        }, [inputValue, onChangeSize]);

        const { readOnlyAdd, readOnlySubtract } = getButtonsReadOnly(
            inputValue,
            baseUnits,
            constraints
        );

        return (
            <LayoutComponent>
                <div className="ws-flexbox controls-PropertyGrid-sizeEditor__input ws-align-items-baseline">
                    {showName && (
                        <span className="controls-PropertyGrid-sizeEditor__inputLabel">{name}</span>
                    )}
                    <div className={`${inputClass} ws-flexbox`}>
                        <NumberEditor
                            textAlign={inputAlign}
                            value={inputValue || ''}
                            valueChangedCallback={setInputValue}
                            onInputCompleted={onChangeSize}
                            placeholder={'Auto'}
                            borderVisibility={inputBorder}
                            className="controls-Input__width-6ch"
                            onlyPositive={true}
                            precision={0}
                            integersLength={5}
                        />
                        {showUnit ? (
                            <UnitSelector
                                caption={baseUnits || KeyUnits.pixel}
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
                    </div>
                </div>
            </LayoutComponent>
        );
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
