import { Selector } from 'Controls/dropdown';
import { Number as InputNumber } from 'Controls/input';
import * as React from 'react';
import { useMemo } from 'react';
import { Memory } from 'Types/source';
import 'css!Controls-Lists-editors/_columnsEditor/styles/designTimeEditor';
interface IColumnWidth {
    mode: 'Фиксированная' | 'Авто';
    amount?: number;
    units?: '%' | 'px';
}

/**
 * Функция парсит строку с шириной
 * @param width
 */
function validateColumnWidth(width: string): IColumnWidth {
    const result: IColumnWidth = { mode: 'Авто' };
    if (width === 'auto') {
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
            result.mode = 'Фиксированная';
        }
    }
    return result;
}
function buildNewWidth(newWidthConfig: IColumnWidth): string {
    const { mode, amount = DEFAULT_WIDTH, units = 'px' } = newWidthConfig;
    if (mode === 'Авто') {
        return 'auto';
    } else {
        return amount + units;
    }
}
const DEFAULT_WIDTH = 200;
/**
 * Редактор ширины колонки
 */
export function ColumnWidthEditor(props): JSX.Element {
    const { value, onChange, LayoutComponent } = props;
    const validateValue = validateColumnWidth(value);
    const [widthMode, setWidthMode] = React.useState(validateValue.mode);
    const [widthUnits, setWidthUnits] = React.useState(validateValue.units ?? 'px');
    const [widthValue, setWidthValue] = React.useState(validateValue.amount ?? DEFAULT_WIDTH);
    const widthModeOptions = [
        { value: 'Фиксированная', caption: 'Фиксированная' },
        { value: 'Авто', caption: 'Авто' },
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
            const newColumnProperties = {
                width: buildNewWidth({
                    mode: widthMode,
                    amount: widthValue,
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
                    source={widthModeSource}
                    closeMenuOnOutsideClick={true}
                    selectedKeys={[widthMode === undefined ? null : widthMode]}
                    displayProperty="caption"
                    keyProperty="value"
                    onSelectedKeysChanged={onModeValueChanged}
                />
                {widthMode === 'Фиксированная' ? (
                    <>
                        <InputNumber
                            value={widthValue}
                            valueChangedCallback={onValueChanged}
                            onInputCompleted={onApply}
                            textAlign={'right'}
                        />
                        <Selector
                            source={widthUnitsSource}
                            closeMenuOnOutsideClick={true}
                            selectedKeys={[widthUnits === undefined ? null : widthUnits]}
                            displayProperty="caption"
                            keyProperty="value"
                            onSelectedKeysChanged={onUnitsValueChanged}
                        />
                    </>
                ) : null}
            </div>
        </LayoutComponent>
    );
}
