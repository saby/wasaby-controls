import { Selector } from 'Controls/dropdown';
import { Number as InputNumber } from 'Controls/input';
import * as React from 'react';
import { useMemo } from 'react';
import { Memory } from 'Types/source';
import 'css!Controls-Lists-editors/_columnsEditor/styles/designTimeEditor';
import {
    DEFAULT_COLUMN_PARAMS,
    MAX_COLUMN_WIDTH,
    MIN_COLUMN_WIDTH,
    MAX_MAIN_COLUMN_WIDTH,
    MIN_MAIN_COLUMN_WIDTH,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import {
    validateColumnWidth,
    parseColumnWidth,
    buildNewWidth,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';

interface IColumnWidthEditorProps {
    value: string;
    // TODO разобраться с типом функции
    onChange: Function;
    LayoutComponent: JSX.Element;
    isMainColumn?: boolean;
}
/**
 * Редактор ширины колонки
 */
export function ColumnWidthEditor(props: IColumnWidthEditorProps): JSX.Element {
    const { value, onChange, LayoutComponent, isMainColumn } = props;
    const validateValue = parseColumnWidth(value);
    const maxColumnWidth = isMainColumn ? MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_WIDTH;
    const minColumnWidth = isMainColumn ? MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
    const [widthMode, setWidthMode] = React.useState(validateValue.mode);
    const [widthUnits, setWidthUnits] = React.useState(validateValue.units ?? 'px');
    const [widthValue, setWidthValue] = React.useState(
        validateValue.amount ?? DEFAULT_COLUMN_PARAMS.width
    );
    const [minLimit, setMinLimit] = React.useState(validateValue.minLimit);
    const [maxLimit, setMaxLimit] = React.useState(validateValue.maxLimit);
    const widthModeOptions = [
        { value: 'fixed', caption: 'Фиксированная' },
        { value: 'auto', caption: 'Авто' },
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
        (updatedConfig: object = {}) => {
            const newWidthConfig = {
                mode: widthMode,
                amount: widthValue,
                units: widthUnits,
                minLimit,
                maxLimit,
                ...updatedConfig,
            };
            const acceptableWidth = validateColumnWidth(newWidthConfig, isMainColumn);
            if (acceptableWidth?.amount) {
                setWidthValue(acceptableWidth.amount);
            }
            const newColumnProperties = {
                width: buildNewWidth(acceptableWidth),
            };
            onChange(newColumnProperties.width);
        },
        [widthValue, widthMode, widthUnits, minLimit, maxLimit]
    );
    const onValueChanged = React.useCallback((newValue) => {
        setWidthValue(newValue);
    }, []);
    const onMinLimitChanged = React.useCallback((newValue) => {
        setMinLimit(Number(newValue));
    }, []);
    const onMaxLimitChanged = React.useCallback((newValue) => {
        setMaxLimit(Number(newValue));
    }, []);
    const onUnitsValueChanged = React.useCallback(
        (newValue) => {
            setWidthUnits(newValue[0]);
            onApply({ units: newValue[0] });
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
                            className={'controls-Input__width-3ch'}
                            value={widthValue}
                            valueChangedCallback={onValueChanged}
                            onInputCompleted={onApply}
                            textAlign={'left'}
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
                        className={'controls-Input__width-3ch'}
                        value={minLimit && minLimit !== minColumnWidth ? minLimit : ''}
                        valueChangedCallback={onMinLimitChanged}
                        onInputCompleted={onApply}
                    />
                    <span
                        className={
                            'ControlsListsEditors_columnWidthEditor-width_text ControlsListsEditors_columnWidthEditor-width_text-padding-left ControlsListsEditors_columnWidthEditor-width_text-padding-right'
                        }
                    >
                        до
                    </span>
                    <InputNumber
                        className={'controls-Input__width-3ch'}
                        value={maxLimit && maxLimit !== maxColumnWidth ? maxLimit : ''}
                        valueChangedCallback={onMaxLimitChanged}
                        onInputCompleted={onApply}
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
