import { createContext, useContext } from 'react';

/**
 * Размеры контрола
 * @public
 */
export interface ISize {
    /**
     * Положение слева относительно родителя
     */
    left: number;

    /**
     * Положение сверху относительно родителя
     */
    top: number;

    /**
     * Ширина
     */
    width: number;

    /**
     * Высота
     */
    height: number;
}

/**
 * Контекст доступа к размерам контрола
 * @public
 */
export interface IControlSizeContext {
    /**
     * Получение размера контрола
     */
    getSize(): ISize;

    /**
     * Получение размера родительского контрола
     */
    getParentSize(): ISize | undefined;
}

export const ControlSizeContext = createContext<IControlSizeContext | undefined>(undefined);
ControlSizeContext.displayName = 'Controls-editors/object-type:ControlSizeContext';

/**
 * Доступ к методам получения размеров контрола
 * @public
 */
export function useControlSize(): IControlSizeContext | undefined {
    return useContext(ControlSizeContext);
}
