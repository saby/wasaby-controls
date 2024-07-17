import { Selector } from 'Controls/dropdown';
import { Number as InputNumber } from 'Controls/input';
import * as React from 'react';
import { useMemo } from 'react';
import { Memory } from 'Types/source';
import 'css!Controls-Lists-editors/_columnsEditor/styles/designTimeEditor';
import {
    MIN_COLUMN_WIDTH,
    DEFAULT_MAX_MAIN_COLUMN_WIDTH,
    MAX_COLUMN_AUTO,
    DEFAULT_MIN_MAIN_COLUMN_WIDTH,
    HUNDRED_PERCENT,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import {
    validateColumnWidth,
    parseColumnWidth,
    buildNewWidth,
    IColumnWidth,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import * as rk from 'i18n!Controls-Lists-editors';

interface IColumnWidthEditorProps {
    value: string;
    // TODO разобраться с типом функции
    onChange: Function;
    LayoutComponent: JSX.Element;
    isMainColumn?: boolean;
    columnRef: React.MutableRefObject<HTMLElement>;
    containerWidth: number;
}

function pixelsToPercents(widthInPixels: number, totalWidthInPixels: number): number {
    return Math.round((widthInPixels / totalWidthInPixels) * HUNDRED_PERCENT);
}

function percentsToPixels(widthInPercents: number, totalWidthInPixels: number): number {
    return Math.round((widthInPercents * totalWidthInPixels) / HUNDRED_PERCENT);
}

function updateWidth(
    prevWidth: IColumnWidth,
    updatedConfig: IColumnWidth,
    isMainColumn: boolean,
    containerWidth: number,
    actualWidthAmount: number
): IColumnWidth {
    const nextWidth = {
        ...prevWidth,
        ...updatedConfig,
    };
    const maxColumnWidth = isMainColumn ? DEFAULT_MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_AUTO;
    // Если переключили % на px. Или если ввели величину в %. Переведем все в пиксели
    if ((!updatedConfig.units && prevWidth.units === '%') || updatedConfig.units === 'px') {
        if ((prevWidth.mode === 'fixed' && !updatedConfig.mode) || updatedConfig.mode === 'fixed') {
            nextWidth.amount = updatedConfig.amount
                ? percentsToPixels(updatedConfig.amount, containerWidth)
                : actualWidthAmount;
        } else if (
            (prevWidth.mode === 'auto' && !updatedConfig.mode) ||
            updatedConfig.mode === 'auto'
        ) {
            if (updatedConfig.minLimit) {
                nextWidth.minLimit = percentsToPixels(updatedConfig.minLimit, containerWidth);
            } else if (prevWidth.minLimit) {
                nextWidth.minLimit = percentsToPixels(prevWidth.minLimit, containerWidth);
            }
            if (prevWidth.maxLimit !== maxColumnWidth) {
                if (updatedConfig.maxLimit) {
                    nextWidth.maxLimit = percentsToPixels(updatedConfig.maxLimit, containerWidth);
                } else if (prevWidth.maxLimit) {
                    nextWidth.maxLimit = percentsToPixels(prevWidth.maxLimit, containerWidth);
                }
            }
        }
        nextWidth.units = 'px';
    }
    const acceptableWidth = validateColumnWidth(nextWidth, isMainColumn);
    // Если сменили px на % или ввели величину в %. Сначала проверим правильность введенных значений в px, потом переведем в %
    if ((!updatedConfig.units && prevWidth.units === '%') || updatedConfig.units === '%') {
        if ((prevWidth.mode === 'fixed' && !updatedConfig.mode) || updatedConfig.mode === 'fixed') {
            acceptableWidth.amount = pixelsToPercents(acceptableWidth.amount, containerWidth);
        } else if (
            (prevWidth.mode === 'auto' && !updatedConfig.mode) ||
            updatedConfig.mode === 'auto'
        ) {
            if (acceptableWidth.minLimit) {
                acceptableWidth.minLimit = pixelsToPercents(
                    acceptableWidth.minLimit,
                    containerWidth
                );
            }
            if (acceptableWidth.maxLimit && prevWidth.maxLimit !== maxColumnWidth) {
                acceptableWidth.maxLimit =
                    acceptableWidth.maxLimit !== maxColumnWidth
                        ? pixelsToPercents(acceptableWidth.maxLimit, containerWidth)
                        : maxColumnWidth;
            }
        }
        acceptableWidth.units = '%';
    }
    return acceptableWidth;
}

const INTEGERS_LENGTH = 4;
const PRECISION = 0;

/**
 * Редактор ширины колонки
 */
export function ColumnWidthEditor(props: IColumnWidthEditorProps): JSX.Element {
    const { value, onChange, LayoutComponent, isMainColumn, columnRef, containerWidth } = props;
    const validateValue = React.useMemo(() => {
        return parseColumnWidth(value);
    }, [value]);
    // Фактическое значение ширины редактируемого элемента. Необходим, при переключении с автоширины на фиксированную
    const actualRef = React.useMemo<React.MutableRefObject<HTMLElement>>(() => {
        return columnRef;
    }, [columnRef]);
    const maxColumnWidth = isMainColumn ? DEFAULT_MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_AUTO;
    const minColumnWidth = isMainColumn ? DEFAULT_MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
    const [widthMode, setWidthMode] = React.useState(validateValue.mode);
    const [widthUnits, setWidthUnits] = React.useState(validateValue.units ?? 'px');
    const [widthValue, setWidthValue] = React.useState(validateValue.amount);
    const [minLimit, setMinLimit] = React.useState(validateValue.minLimit);
    const [maxLimit, setMaxLimit] = React.useState(validateValue.maxLimit);
    React.useEffect(() => {
        setWidthMode(validateValue.mode);
        setWidthUnits(validateValue.units ?? 'px');
        setWidthValue(validateValue.amount);
        setMinLimit(validateValue.minLimit);
        setMaxLimit(validateValue.maxLimit);
    }, [validateValue, actualRef]);
    const widthModeOptions = [
        { value: 'fixed', caption: rk('Фиксированная') },
        { value: 'auto', caption: rk('Авто') },
    ];
    const widthUnitsOptions = [
        { value: 'px', caption: 'px' },
        { value: '%', caption: '%' },
    ];
    const widthModeSource = useMemo(() => {
        return new Memory({ keyProperty: 'value', data: widthModeOptions });
    }, []);
    const widthUnitsSource = useMemo(() => {
        return new Memory({ keyProperty: 'value', data: widthUnitsOptions });
    }, []);
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
                width: buildNewWidth(nextWidth),
            };
            onChange(newColumnProperties.width);
        },
        [widthValue, widthMode, widthUnits, minLimit, maxLimit, actualRef]
    );
    const onValueChanged = React.useCallback((newValue) => {
        setWidthValue(newValue);
    }, []);
    const onMinLimitChanged = React.useCallback((newValue) => {
        const newMinLimit = newValue ? Number(newValue) : undefined;
        setMinLimit(newMinLimit);
    }, []);
    const onMaxLimitChanged = React.useCallback((newValue) => {
        const newMaxLimit = newValue ? Number(newValue) : undefined;
        setMaxLimit(newMaxLimit);
    }, []);
    const onUnitsValueChanged = React.useCallback(
        (newValue) => {
            const config: IColumnWidth = {
                units: newValue[0],
            };
            onApply(config);
            setWidthUnits(newValue[0]);
        },
        [onApply, actualRef]
    );
    const onModeValueChanged = React.useCallback(
        (newValue) => {
            setWidthMode(newValue[0]);
            onApply({ mode: newValue[0] });
        },
        [onApply]
    );
    return (
        <LayoutComponent>
            <div className={'ControlsListsEditors_columnWidthEditor-wrapper'}>
                <Selector
                    className={'ControlsListsEditors_columnWidthEditor-width_mode'}
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
                            onInputCompleted={(newValue) => {
                                onApply({
                                    amount: newValue,
                                });
                            }}
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
                        от
                    </span>
                    <InputNumber
                        className={'controls-Input__width-4ch'}
                        value={minLimit && minLimit !== minColumnWidth ? minLimit : ''}
                        valueChangedCallback={onMinLimitChanged}
                        onInputCompleted={(newValue) => {
                            onApply({
                                minLimit: newValue,
                            });
                        }}
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
                        до
                    </span>
                    <InputNumber
                        className={'controls-Input__width-4ch'}
                        value={maxLimit && maxLimit !== maxColumnWidth ? maxLimit : ''}
                        valueChangedCallback={onMaxLimitChanged}
                        onInputCompleted={(newValue) => {
                            onApply({
                                maxLimit: newValue,
                            });
                        }}
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
        </LayoutComponent>
    );
}
