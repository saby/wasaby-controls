import { FC } from 'react';
import { IEditorLayoutProps } from '../AttributeEditor';

export interface TEditorProps {
    /**
     * Идентификатор хранилища редакторов для всего PG
     */
    propertyGridStoreId: string;
}

/**
 * Общий интерфейс для показа редактора свойств
 * @private
 */
export interface IAttributeRenderProps<TEditor = TEditorProps & any> {
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

    /**
     * Идентификатор хранилища для PG
     */
    storeId: string;
}
