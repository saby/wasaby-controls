import { ReactNode } from 'react';
import { IControlProps } from 'Controls/interface';
import { IWidgetProps } from 'Frame/base';

/**
 * Интерфейс элемента вкладки
 */
export interface IItem {
    /**
     * Идентификатор элемента
     */
    id: number;
    clonedId?: number;
    text?: string;
    /**
     * Текст, которое будет отображаться на вкладке
     */
    title: string;
    align?: string;
}

/**
 * Интерфейс для элементов компонента "Вкладки"
 */
export interface IItemsOptions {
    '.style'?: {
        reference?: string;
    };
    /**
     * Коллекция элементов вкладки
     */
    variants: {
        /**
         * Массив элементов вкладки
         */
        items: IItem[];
        /**
         * Текущая выбранная вкладка
         */
        selectedKeys: number[];
    };
}

/**
 * Интерфейс для компонента "Вкладки"
 * @public
 */
export interface ITabsProps extends IControlProps, IItemsOptions {
    /**
     * Массив для содержимого компонента "Вкладки"
     * @remark
     * Количество должно соответствовать количеству элементов вкладки. Отображаться будет элемент, который соответствует индексу активной вкладке.
     */
    children: ReactNode | ReactNode[];
    /**
     * Определяет режим отображения вкладок
     * @demo Controls-Containers-demo/ViewMode/Index
     */
    viewMode?: 'underlined' | 'bordered';
}

/**
 * Интерфейс для компонента "Вкладка"
 * @public
 */
export interface ITabProps extends IWidgetProps {
    /**
     * Содержимое для компонента "Вкладка"
     */
    children: ReactNode;
}
