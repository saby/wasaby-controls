import { FC } from 'react';
import { IEditorLayoutProps } from '../AttributeEditor';

/**
 * Общий интерфейс для показа редактора свойств
 * @private
 */
export interface IAttributeRenderProps<TEditor = any> {
    /**
     * Редактор
     */
    Component: FC<TEditor>;

    /**
     * Набор всех свойств для редактирования
     */
    fullValue: Record<string, unknown> | undefined;

    /**
     * Изменение значение всего объекта
     * @param val
     */
    onChange(val: object): void;

    /**
     * Значение редактора по умолчанию
     */
    defaultValue?: unknown;

    /**
     * Свойства редактора
     */
    editorProps?: Record<string, unknown>;

    /**
     * Компонент, оборачивающий редакторы, рисующий icon, title, description.
     */
    EditorLayoutComponent?: FC<IEditorLayoutProps>;
}
