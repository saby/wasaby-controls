import { Selector } from 'Controls/dropdown';
import { Number as InputNumber } from 'Controls/input';
import * as React from 'react';
import { useMemo } from 'react';
import { Memory } from 'Types/source';
import 'css!Controls-Lists-editors/_columnsEditor/styles/designTimeEditor';
import { DEFAULT_COLUMN_PARAMS } from 'Controls-Lists-editors/_columnsEditor/constants';
import { validateColumnWidth } from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';

interface IColumnWidth {
    mode: 'fixed' | 'auto';
    amount?: number;
    units?: '%' | 'px';
}

/**
 * Функция парсит строку с шириной
 * @param width
 */
function parseColumnWidth(width: string): IColumnWidth {
    const result: IColumnWidth = { mode: 'auto' };
    if (width === 'max-content') {
        return result;
    } else {
        let isFixed: boolean = false;
        let units: 'px' | '%' = 'px';
        let unitPosition = width.indexOf(units);
        if (unitPosition === -1) {
            units = '%';
            unitPosition = width.indexOf(units);
            if (unitPosition !== -1) {
                isFixed = true;
            }
        } else {
            isFixed = true;
        }
        if (isFixed) {
            result.amount = Number(width.slice(0, unitPosition));
            result.units = units;
            result.mode = 'fixed';
        }
    }
    return result;
}
function buildNewWidth(newWidthConfig: IColumnWidth): string {
    const { mode, amount = DEFAULT_COLUMN_PARAMS.width, units = 'px' } = newWidthConfig;
    if (mode === 'auto') {
        return 'max-content';
    } else {
        return amount + units;
    }
}
/**
 * Редактор ширины колонки
 */
export function ColumnWidthEditor(props): JSX.Element {
    const { value, onChange, LayoutComponent } = props;
    const validateValue = parseColumnWidth(value);
    const [widthMode, setWidthMode] = React.useState(validateValue.mode);
    const [widthUnits, setWidthUnits] = React.useState(validateValue.units ?? 'px');
    const [widthValue, setWidthValue] = React.useState(
        validateValue.amount ?? DEFAULT_COLUMN_PARAMS.width
    );
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
            const acceptableWidth = validateColumnWidth(widthValue);
            setWidthValue(acceptableWidth);
            const newColumnProperties = {
                width: buildNewWidth({
                    mode: widthMode,
                    amount: acceptableWidth,
                    units: widthUnits,
                    ...updatedConfig,
                }),
            };
            onChange(newColumnProperties.width);
        },
        [widthValue, widthMode, widthUnits]
    );
    const onValueChanged = React.useCallback((newValue) => {
        setWidthValue(newValue);
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
                    <span className={'ControlsListsEditors_columnWidthEditor-width_text-color'}>
                        от
                    </span>
                    <InputNumber className={'controls-Input__width-3ch'} value={''} data-qa={'ControlsListsEditors_columnWidthEditor__value-from'}/>
                    <span className={'ControlsListsEditors_columnWidthEditor-width_text-color'}>
                        до
                    </span>
                    <InputNumber className={'controls-Input__width-3ch'} value={''} data-qa={'ControlsListsEditors_columnWidthEditor__value-to'}/>
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
