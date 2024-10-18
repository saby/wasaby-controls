/**
 * Интерфейс свойств базового редактора типа (React-компонента).
 * @public
 */
import { IPropertyEditorProps, Meta } from 'Meta/types';

// TODO: Придумать, как можно избавиться от Omit
export interface IBasePropertyEditorProps<T, MT extends Meta<unknown>>
    extends Omit<IPropertyEditorProps<T>, 'type' | 'metaType'> {
    type?: MT;
    metaType?: MT;
}
