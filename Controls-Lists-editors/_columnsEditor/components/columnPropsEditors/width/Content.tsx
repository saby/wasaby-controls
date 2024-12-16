import { Selector } from 'Controls/dropdown';
import { Number as InputNumber } from 'Controls/input';
import * as React from 'react';
import { Memory } from 'Types/source';
import {
    validateColumnWidth,
    validateColumnWidthInPercents,
    parseColumnWidth,
    buildNewWidth,
    IColumnWidth,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import { updateWidth } from 'Controls-Lists-editors/_columnsEditor/components/columnPropsEditors/width/utils';
import * as rk from 'i18n!Controls-Lists-editors';
const INTEGERS_LENGTH = 4;
const PRECISION = 0;
const WIDTH_MODE_OPTIONS = [
    { value: 'fixed', caption: rk('Фиксированная') },
    { value: 'auto', caption: rk('Авто') },
];
const WIDTH_UNITS_OPTIONS = [
    { value: 'px', caption: 'px' },
    { value: '%', caption: '%' },
];

interface IContentProps {
    initValue: string;
    onChange: (value: string) => void;
    columnRef: React.MutableRefObject<HTMLElement>;
    containerWidth: number;
    isMainColumn?: boolean;
}

export function Content(props: IContentProps) {
    const { initValue, onChange, isMainColumn, columnRef, containerWidth } = props;
    const widthModeSource = React.useMemo(() => {
        return new Memory({ keyProperty: 'value', data: WIDTH_MODE_OPTIONS });
    }, []);
    const widthUnitsSource = React.useMemo(() => {
        return new Memory({ keyProperty: 'value', data: WIDTH_UNITS_OPTIONS });
    }, []);
    const validateValue = React.useMemo(() => {
        const width = parseColumnWidth(initValue);
        const shouldRecalculateUnits = width.units === '%';
        if (shouldRecalculateUnits) {
            return validateColumnWidthInPercents(width, containerWidth, isMainColumn);
        }
        return validateColumnWidth(width, isMainColumn);
    }, [initValue, containerWidth, isMainColumn]);
    // Фактическое значение ширины редактируемого элемента. Необходим, при переключении с автоширины на фиксированную
    const actualRef = React.useMemo<React.MutableRefObject<HTMLElement>>(() => {
        return columnRef;
    }, [columnRef]);
    const [widthMode, setWidthMode] = React.useState(validateValue.mode);
    const [widthUnits, setWidthUnits] = React.useState(validateValue.units ?? 'px');
    const [widthValue, setWidthValue] = React.useState(validateValue.amount);
    const [minLimit, setMinLimit] = React.useState(validateValue.minLimit);
    const [maxLimit, setMaxLimit] = React.useState(validateValue.maxLimit);
    const onApply = React.useCallback(
        (updatedConfig: IColumnWidth = {}) => {
            const prevWidth = {
                mode: widthMode,
                amount: widthValue || actualRef.current.offsetWidth,
                units: widthUnits,
                minLimit,
                maxLimit,
            };
            const nextWidth = updateWidth(
                prevWidth,
                updatedConfig,
                isMainColumn,
                containerWidth,
                actualRef.current.offsetWidth
            );
            if (nextWidth?.amount) {
                setWidthValue(nextWidth.amount);
            }
            const newColumnProperties = {
                width: buildNewWidth(nextWidth, isMainColumn, containerWidth),
            };
            setMinLimit(nextWidth.minLimit);
            setMaxLimit(nextWidth.maxLimit);
            onChange(newColumnProperties.width);
        },
        [
            widthValue,
            widthMode,
            widthUnits,
            minLimit,
            maxLimit,
            actualRef,
            containerWidth,
            onChange,
            isMainColumn,
        ]
    );
    const onValueChanged = React.useCallback((newValue) => {
        setWidthValue(newValue);
    }, []);
    const onValueApply = React.useCallback(
        (newValue) => {
            onApply({
                amount: newValue,
            });
        },
        [onApply]
    );
    const onMinLimitChanged = React.useCallback((newValue) => {
        const newMinLimit = newValue ? Number(newValue) : undefined;
        setMinLimit(newMinLimit);
    }, []);
    const onMinLimitApply = React.useCallback(
        (newValue) => {
            onApply({
                minLimit: newValue,
            });
        },
        [onApply]
    );
    const onMaxLimitChanged = React.useCallback((newValue) => {
        const newMaxLimit = newValue ? Number(newValue) : undefined;
        setMaxLimit(newMaxLimit);
    }, []);
    const onMaxLimitApply = React.useCallback(
        (newValue) => {
            onApply({
                maxLimit: newValue,
            });
        },
        [onApply]
    );
    const onUnitsValueChanged = React.useCallback(
        (newValue) => {
            const config: IColumnWidth = {
                units: newValue[0],
            };
            onApply(config);
            setWidthUnits(newValue[0]);
        },
        [onApply]
    );
    const onModeValueChanged = React.useCallback(
        (newValue) => {
            setWidthMode(newValue[0]);
            onApply({ mode: newValue[0] });
        },
        [onApply]
    );
    return (
        <>
            <div className={'ControlsListsEditors_columnWidthEditor-wrapper'}>
                <Selector
                    className={'ControlsListsEditors_columnWidthEditor-width_mode'}
                    data-qa={'ControlsListsEditors_columnWidthEditor-width_mode'}
                    source={widthModeSource}
                    closeMenuOnOutsideClick={true}
                    selectedKeys={[widthMode === undefined ? null : widthMode]}
                    displayProperty="caption"
                    keyProperty="value"
                    onSelectedKeysChanged={onModeValueChanged}
                />
                {widthMode === 'fixed' ? (
                    <>
                        <InputNumber
                            className={'controls-Input__width-4ch'}
                            value={widthValue}
                            valueChangedCallback={onValueChanged}
                            onInputCompleted={onValueApply}
                            textAlign={'left'}
                            integersLength={INTEGERS_LENGTH}
                            precision={PRECISION}
                            useGrouping={false}
                            onlyPositive={true}
                            data-qa={'ControlsListsEditors_columnWidthEditor__value'}
                        />
                        <Selector
                            source={widthUnitsSource}
                            closeMenuOnOutsideClick={true}
                            selectedKeys={[widthUnits === undefined ? null : widthUnits]}
                            displayProperty="caption"
                            keyProperty="value"
                            onSelectedKeysChanged={onUnitsValueChanged}
                            data-qa={'ControlsListsEditors_columnWidthEditor__unit'}
                        />
                    </>
                ) : null}
            </div>
            {widthMode === 'auto' ? (
                <>
                    <span
                        className={
                            'ControlsListsEditors_columnWidthEditor-width_text ControlsListsEditors_columnWidthEditor-width_text-padding-right'
                        }
                    >
                        {rk('от')}
                    </span>
                    <InputNumber
                        className={'controls-Input__width-4ch'}
                        data-qa={'ControlsListsEditors_columnWidthEditor__value-from'}
                        value={minLimit ?? ''}
                        valueChangedCallback={onMinLimitChanged}
                        onInputCompleted={onMinLimitApply}
                        integersLength={INTEGERS_LENGTH}
                        precision={PRECISION}
                        useGrouping={false}
                        onlyPositive={true}
                    />
                    <span
                        className={
                            'ControlsListsEditors_columnWidthEditor-width_text ControlsListsEditors_columnWidthEditor-width_text-padding-left ControlsListsEditors_columnWidthEditor-width_text-padding-right'
                        }
                    >
                        {rk('до')}
                    </span>
                    <InputNumber
                        className={'controls-Input__width-4ch'}
                        data-qa={'ControlsListsEditors_columnWidthEditor__value-to'}
                        value={maxLimit ?? ''}
                        valueChangedCallback={onMaxLimitChanged}
                        onInputCompleted={onMaxLimitApply}
                        integersLength={INTEGERS_LENGTH}
                        precision={PRECISION}
                        useGrouping={false}
                        onlyPositive={true}
                    />
                    <Selector
                        source={widthUnitsSource}
                        closeMenuOnOutsideClick={true}
                        selectedKeys={[widthUnits === undefined ? null : widthUnits]}
                        displayProperty="caption"
                        keyProperty="value"
                        onSelectedKeysChanged={onUnitsValueChanged}
                        data-qa={'ControlsListsEditors_columnWidthEditor__unit'}
                    />
                </>
            ) : null}
        </>
    );
}
