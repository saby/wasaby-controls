import { Fragment, useCallback, memo, useMemo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';
import { Button as DropdownButton } from 'Controls/dropdown';
import { Number as NumberEditor } from 'Controls/input';
import { Button } from 'Controls/buttons';
import { useInputEditorValue } from 'Controls-editors/input';

import * as rk from 'i18n!Controls-editors';

interface IUnitItems {
    key: string;
    title: string;
}

interface ISizeEditor extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    showName?: boolean;
    value: string;
    showUnit?: boolean;
    unitItems?: IUnitItems[];
    showBorder?: boolean;
    inputAlign?: 'left' | 'right' | 'center';
    showIterateButtons?: boolean;
    units?: string[];
}

enum IKeyUnits {
    pixel = 'px',
    percent = '%',
}

const MAX_PERCENT_SIZE = 100;
const MIN_VALUE = 1;
const UNIT_ITEMS_DEFAULT: IUnitItems[] = [
    { key: IKeyUnits.pixel, title: rk('Пиксели (px)') },
    { key: IKeyUnits.percent, title: rk('Проценты (%)') },
];

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

export const SizeEditorField = memo(
    ({
        value,
        LayoutComponent = Fragment,
        onChange,
        name = '',
        showName = false,
        unitItems,
        showBorder = false,
        showUnit = true,
        showIterateButtons = false,
        inputAlign = 'right',
        units = [IKeyUnits.pixel, IKeyUnits.percent],
    }: ISizeEditor) => {
        const inputBorder = showBorder ? 'partial' : 'hidden';
        const unitSelectorClass = showBorder
            ? 'controls-PropertyGrid-sizeEditor__select_border'
            : '';
        const inputClass = showBorder ? '' : 'controls-PropertyGrid-sizeEditor__input_border';
        const { baseUnits, baseSize } = splitSize(value);

        const onChangeValue = useCallback(
            (newSize = baseSize, newUnits = baseUnits) => {
                if (typeof onChange === 'function') {
                    onChange(`${newSize}${newUnits}`);
                }
            },
            [onChange, baseSize, baseUnits]
        );

        const onChangeSize = useCallback(
            (newSize) => {
                let currentUnits = baseUnits;
                let currentSize = newSize;
                if (Number(currentSize) < MIN_VALUE) {
                    currentSize = MIN_VALUE;
                }
                if (currentSize && !currentUnits) {
                    currentUnits = IKeyUnits.pixel;
                }
                if (currentUnits === IKeyUnits.percent && Number(currentSize) > MAX_PERCENT_SIZE) {
                    currentSize = MAX_PERCENT_SIZE;
                }
                onChangeValue(currentSize, currentUnits);
            },
            [onChangeValue, baseUnits]
        );

        const onChangeUnits = useCallback(
            (newUnits) => {
                let currentSize = baseSize;
                const currentUnits = newUnits.getId();
                if (
                    currentUnits === IKeyUnits.percent &&
                    (Number(currentSize) > MAX_PERCENT_SIZE || !currentSize)
                ) {
                    currentSize = `${MAX_PERCENT_SIZE}`;
                }

                onChangeValue(currentSize, currentUnits);
            },
            [baseSize, onChangeValue]
        );

        const { changeHandler, localValue } = useInputEditorValue({
            value: baseSize,
        });

        const onChangeLocal = useCallback(
            (newValue: unknown) => {
                let currentValue = newValue;
                if (Number(newValue) < MIN_VALUE) {
                    currentValue = MIN_VALUE;
                }
                changeHandler(currentValue as string);
            },
            [changeHandler]
        );

        const onAddClick = useCallback(() => {
            onChangeSize(+localValue + 1);
        }, [localValue, onChangeSize]);

        const onSubtractClick = useCallback(() => {
            onChangeSize(+localValue - 1);
        }, [localValue, onChangeSize]);

        return (
            <LayoutComponent>
                <div className="ws-flexbox controls-PropertyGrid-sizeEditor__input ws-align-items-baseline">
                    {showName && (
                        <span className="controls-PropertyGrid-sizeEditor__inputLabel">{name}</span>
                    )}
                    <div className={`${inputClass} ws-flexbox`}>
                        <NumberEditor
                            textAlign={inputAlign}
                            value={localValue ?? ''}
                            valueChangedCallback={onChangeLocal}
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
                                caption={baseUnits}
                                items={unitItems}
                                units={units}
                                className={unitSelectorClass}
                                onChange={onChangeUnits}
                            />
                        ) : null}
                        {showIterateButtons ? (
                            <IterateButtons onAdd={onAddClick} onSubtract={onSubtractClick} />
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
            onMenuItemActivate={onChange}
        />
    );
}

interface ISizeIteratorProps {
    onAdd: () => void;
    onSubtract: () => void;
}

function IterateButtons({ onAdd, onSubtract }: ISizeIteratorProps): JSX.Element {
    return (
        <div>
            <Button
                viewMode="filled"
                buttonStyle="pale"
                icon="icon-Subtraction"
                className="controls-margin_left-s controls-margin_right-2xs"
                onClick={onSubtract}
            />
            <Button viewMode="filled" buttonStyle="pale" icon="icon-Addition" onClick={onAdd} />
        </div>
    );
}
