import { IColumnConfig, IHeaderConfig, TGetCellPropsCallback } from 'Controls/gridReact';
import { DYNAMIC_GRID_CELL_BASE_CLASS_NAME } from '../constants';

const HAS_DYNAMIC_GRID_PROPS_SYMBOL_PREFIX = 'DynamicGrid_GetCellProps_';

export type TCustomGetCellPropsCallback = (
    result: ReturnType<TGetCellPropsCallback>,
    ...args: Parameters<TGetCellPropsCallback>
) => ReturnType<TGetCellPropsCallback>;

/**
 * Утилита для расширения или переопределения опций колонок, получаемых через IBaseColumnConfig.TGetCellPropsCallback.
 * @param column Конфигурация колонки
 * @param getCellPropsStable Стабилизированная функция обратного вызова, возвращающая опции колонки.
 * Стабилизированная означает неизменяемая, т.е. утилита не отслеживает изменение функции и не будет перезаписывать.
 * Если перезаписывать, то становится трудно отследить, что функция уже была переопределена.
 * Так мы можем попасть в очень долгий цикл getCellPropsOverriden -> super -> getCellPropsOverriden -> super ... и т.д.
 * @param patchType - тип расширения опций, чтобы можно было без повторения применить несколько патчей
 */
export function patchColumnProps(
    column: IHeaderConfig | IColumnConfig,
    getCellPropsStable: TCustomGetCellPropsCallback,
    patchType: string
): void {
    if (!column[Symbol.for(HAS_DYNAMIC_GRID_PROPS_SYMBOL_PREFIX + patchType)]) {
        const origin = column.getCellProps;
        column.getCellProps = (...args) => {
            const originResult = origin?.(...args);
            return {
                ...originResult,
                ...getCellPropsStable(originResult, ...args),
            };
        };
        column[Symbol.for(HAS_DYNAMIC_GRID_PROPS_SYMBOL_PREFIX + patchType)] = true;
    }
}

export function addDefaultClassNameToAllDynamicColumns(
    columns: IHeaderConfig[] | IColumnConfig[]
): void {
    columns.forEach((config) => {
        patchColumnProps(
            config,
            (superProps) => {
                return {
                    className:
                        (superProps?.className ? `${superProps.className} ` : '') +
                        DYNAMIC_GRID_CELL_BASE_CLASS_NAME,
                    multiSelectClassName: DYNAMIC_GRID_CELL_BASE_CLASS_NAME,
                };
            },
            'defaultClassName'
        );
    });
}
