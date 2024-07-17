import { Fragment, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';
import { Button } from 'Controls/dropdown';
import { Number as NumberEditor } from 'Controls/input';
import { useInputEditorValue } from 'Controls-editors/input';

import * as rk from 'i18n!Controls-editors';

interface ISizeEditor extends IPropertyEditorProps<String> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
}

enum IKeyUnits {
    pixel = 'px',
    percent = '%',
}

const MAX_PERCENT_SIZE = 100;
const MIN_VALUE = 1;
const UNITS_ITEMS_DEFAULT = [
    { key: IKeyUnits.pixel, title: rk('Пиксели (px)') },
    { key: IKeyUnits.percent, title: rk('Проценты (%)') },
];

const splitSize = (value: string) => {
    const result: { baseUnits: string; baseSize: string } = { baseUnits: '', baseSize: '' };
    const stringValue = String(value);

    if (stringValue.includes(IKeyUnits.percent)) {
        result.baseUnits = IKeyUnits.percent;
        result.baseSize = stringValue.replace(IKeyUnits.percent, '');
    } else if (stringValue.includes(IKeyUnits.pixel)) {
        result.baseUnits = IKeyUnits.pixel;
        result.baseSize = stringValue.replace(IKeyUnits.pixel, '');
    }

    return result;
};

export const SizeEditorField = (props: ISizeEditor) => {
    const {
        value,
        LayoutComponent = Fragment,
        type,
        onChange,
        name = '',
        showName = false,
    } = props;

    const { baseUnits, baseSize } = splitSize(value);

    const items: RecordSet = new RecordSet({
        keyProperty: 'key',
        rawData: UNITS_ITEMS_DEFAULT,
    });

    const onChangeValue = useCallback(
        (newSize = baseSize, newUnits = baseUnits) => {
            onChange(`${newSize}${newUnits}`);
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
        (value: unknown) => {
            let currentValue = value;
            if (Number(value) < MIN_VALUE) {
                currentValue = MIN_VALUE;
            }
            changeHandler(currentValue as string);
        },
        [changeHandler]
    );

    return (
        <LayoutComponent>
            <div className="ws-flexbox controls-PropertyGrid-sizeEditor__input ws-align-items-baseline">
                {showName && (
                    <span className="controls-PropertyGrid-sizeEditor__inputLabel">{name}</span>
                )}
                <div className="controls-PropertyGrid-sizeEditor__inputContainer ws-flexbox">
                    <NumberEditor
                        textAlign={'right'}
                        value={localValue ?? ''}
                        valueChangedCallback={onChangeLocal}
                        onInputCompleted={onChangeSize}
                        placeholder={'Auto'}
                        borderVisibility="hidden"
                        className="controls-Input__width-4ch"
                        onlyPositive={true}
                    />
                    <Button
                        className="controls-PropertyGrid-sizeEditor__select"
                        items={items}
                        caption={baseUnits}
                        keyProperty="key"
                        displayProperty="title"
                        customEvents={['onSelectedKeyChanged']}
                        viewMode="link"
                        closeButtonVisibility={false}
                        headerTemplate={null}
                        buttonStyle="unaccented"
                        fontColorStyle="unaccented"
                        onMenuItemActivate={onChangeUnits}
                    />
                </div>
            </div>
        </LayoutComponent>
    );
};
