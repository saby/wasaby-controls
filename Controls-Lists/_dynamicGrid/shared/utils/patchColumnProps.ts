import { IColumnConfig, IHeaderConfig, TGetCellPropsCallback } from 'Controls/gridReact';
import { DYNAMIC_GRID_CELL_BASE_CLASS_NAME } from '../constants';

const HAS_DYNAMIC_GRID_PROPS_SYMBOL = Symbol('DynamicGrid_GetCellProps');

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
 */
export function patchColumnProps(
    column: IHeaderConfig | IColumnConfig,
    getCellPropsStable: TCustomGetCellPropsCallback
): void {
    if (!column[HAS_DYNAMIC_GRID_PROPS_SYMBOL]) {
        const origin = column.getCellProps;
        column.getCellProps = (...args) => {
            const originResult = origin?.(...args);
            return {
                ...originResult,
                ...getCellPropsStable(originResult, ...args),
            };
        };
        column[HAS_DYNAMIC_GRID_PROPS_SYMBOL] = true;
    }
}

export function addDefaultClassNameToAllDynamicColumns(columns): void {
    columns.forEach((config) => {
        patchColumnProps(config, (superProps) => {
            return {
                className:
                    (superProps?.className ? `${superProps.className} ` : '') +
                    DYNAMIC_GRID_CELL_BASE_CLASS_NAME,
            };
        });
    });
}
