import type { ReactElement } from 'react';
import type { Model } from 'Types/entity';
import type { IBaseColumnConfig as IInteractorBaseColumnConfig } from 'Controls-DataEnv/listTypes';
import { ICellProps } from 'Controls/_gridRender/cell/interface/ICellProps';

/**
 * Тип коллбека, возвращающего параметры ячейки
 * Принимает item: {@link Types/entity:Model} возвращает {@link Controls/gridRender/ICellProps}.
 * @typedef TGetCellPropsCallback
 */
export type TGetCellPropsCallback<T extends ICellProps = ICellProps> = (item: Model) => T;

/**
 * Базовый интерфейс колонки таблицы (реакт)
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
     * Коллбэк, который возвращает {@link Controls/gridRender/ICellProps настройки ячеек}.
     * @remark Коллбэк и его результат должны быть мемоизированы.
     * Пересоздаваться по ссылке они должны только при наличии реальных изменений.
     * @cfg
     */
    getCellProps?: TGetCellPropsCallback<T>;
}
