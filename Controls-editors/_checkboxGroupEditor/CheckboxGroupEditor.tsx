import { memo } from 'react';
import { RecordSet } from 'Types/collection';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { CheckboxGroupBase, CheckboxGroupEditorItem } from './CheckboxGroupBase';

interface ICheckboxGroupEditorProps extends IPropertyGridPropertyEditorProps<string[]> {
    options?: RecordSet<CheckboxGroupEditorItem>;
}

export const CheckboxGroupEditor = memo((props: ICheckboxGroupEditorProps) => {
    return <CheckboxGroupBase {...props} />;
});
