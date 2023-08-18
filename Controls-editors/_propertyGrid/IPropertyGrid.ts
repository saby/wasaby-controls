import { IPropertyEditorLayoutProps, IPropertyEditorProps } from 'Types/meta';
import { ComponentProps } from 'react';
import { IObjectTypeEditorProps } from 'Controls-editors/object-type';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';

export type IPropertyGrid<RuntimeInterface extends object> = Pick<
  IObjectTypeEditorProps<
    RuntimeInterface,
    ComponentProps<typeof PropertyGridGroupHeader>,
    ComponentProps<typeof PropertyGridEditorLayout>
  >,
  'metaType' | 'sort' | 'value' | 'onChange'
  >;


export interface IPropertyGridEditorLayout extends IPropertyEditorLayoutProps {
  /**
   * Определяет расположение заголовка редактора (по умолчанию 'left')
   */
  titlePosition: 'left' | 'top' | 'none' | 'float';
}

export interface IPropertyGridPropertyEditorProps<RuntimeInterface> extends
  IPropertyEditorProps<RuntimeInterface, IPropertyGridEditorLayout> {}