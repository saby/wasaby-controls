import { IObjectTypeEditorProps } from 'Controls-editors/object-type';
import { ComponentProps } from 'react';
import ObjectEditorGridEditorLayout from './ObjectEditorGridEditorLayout';
import ObjectEditorGridHeader from './ObjectEditorGridHeader';

export type IObjectEditorGridProps<RuntimeInterface extends object> = Pick<
    IObjectTypeEditorProps<
        RuntimeInterface,
        ComponentProps<typeof ObjectEditorGridHeader>,
        ComponentProps<typeof ObjectEditorGridEditorLayout>
    >,
    'metaType' | 'sort' | 'value' | 'onChange'
>;

export interface IObjectEditorPopupProps<RuntimeInterface extends object>
    extends IObjectEditorGridProps<RuntimeInterface> {
    className?: string;
    onClose: () => void;
}
