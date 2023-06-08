import { memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from '../../_object-type/ObjectTypeEditor';
import { RecordSet } from 'Types/collection';
import { CheckboxGroupBase, CheckboxGroupEditorItem } from './CheckboxGroupBase';

interface ICheckboxGroupEditorProps extends IPropertyEditorProps<string[]> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: RecordSet<CheckboxGroupEditorItem>;
}

export const CheckboxGroupEditor = memo((props: ICheckboxGroupEditorProps) => {
    return <CheckboxGroupBase {...props} />;
});
