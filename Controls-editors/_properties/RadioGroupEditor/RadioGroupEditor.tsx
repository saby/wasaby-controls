import { memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from '../../_object-type/ObjectTypeEditor';
import { RecordSet } from 'Types/collection';
import { RadioGroupEditorBase } from './RadioGroupBase';

export type RadioGroupEditorItem = { id: string; title: string };

interface IRadioGroupEditorProps extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: RecordSet<RadioGroupEditorItem>;
}

export const RadioGroupEditor = memo((props: IRadioGroupEditorProps) => {
    return <RadioGroupEditorBase {...props} />;
});
