import type { ReactElement } from 'react';
import type { Model } from 'Types/entity';
import type { IBaseColumnConfig as IInteractorBaseColumnConfig } from 'Controls-DataEnv/listTypes';
import { ICellProps } from 'Controls/_gridRender/cell/interface/ICellProps';

/**
 * Тип коллбека, возвращающего параметры ячейки
 * Принимает item: {@link Types/entity:Model} возвращает {@link /page/autodoc-ts/Controls/grid/ICellProps/ Controls/gridRender/ICellProps}.
 * @typedef TGetCellPropsCallback
 */
export type TGetCellPropsCallback<T extends ICellProps = ICellProps> = (item: Model) => T;

/**
 * Базовый интерфейс колонки таблицы (React)
 * @public
 */
export interface IBaseColumnConfig<T extends ICellProps = ICellProps>
    extends IInteractorBaseColumnConfig {
    /**
     * Компонент, используемый для отрисовки кастомного контента в ячейке.
     * @cfg
     */
    render?: ReactElement;

    /**
     * Коллбэк, который возвращает {@link /page/autodoc-ts/Controls/grid/ICellProps/ настройки ячеек}.
     * @remark Коллбэк и его результат должны быть меморизированы.
     * Пересоздаваться по ссылке они должны только при наличии реальных изменений.
     * @cfg
     */
    getCellProps?: TGetCellPropsCallback<T>;
}
