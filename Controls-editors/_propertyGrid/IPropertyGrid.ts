import { IPropertyEditorProps } from 'Meta/types';
import { ComponentProps } from 'react';
import { IObjectTypeEditorProps, IEditorLayoutProps } from 'Controls-editors/object-type';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';

/**
 * Интерфейс пропсов компонента PropertyGrid
 * @public
 */
export interface IPropertyGrid<RuntimeInterface extends object>
    extends Pick<
        IObjectTypeEditorProps<
            RuntimeInterface,
            ComponentProps<typeof PropertyGridGroupHeader>,
            ComponentProps<typeof PropertyGridEditorLayout>
        >,
        'metaType' | 'sort' | 'value' | 'onChange'
    > {
    /**
     * Позволяет строго задать ширину колонки с меткой
     */
    captionColumnWidth?: string;

    /**
     * Идентификатор слайса, в котором находятся загруженные редакторы
     */
    storeId?: string;

    /**
     * css класс
     */
    className?: string;
}

/**
 * Интерфейс пропсов компонента-обертки раскладки редакторов проперти грида
 * @interface IPropertyGridEditorLayout
 * @name IPropertyGridEditorLayout
 * @author Парамонов В.С.
 */
export interface IPropertyGridEditorLayout extends IEditorLayoutProps {
    /**
     * Определяет расположение заголовка редактора (по умолчанию 'left')
     */
    titlePosition: 'left' | 'top' | 'none' | 'float';

    /**
     * Название редактируемого атрибута
     */
    attributeName?: string;
}

export interface IPropertyGridPropertyEditorProps<RuntimeInterface>
    extends IPropertyEditorProps<RuntimeInterface> {}
