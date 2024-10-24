import { memo } from 'react';
import { RecordSet } from 'Types/collection';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { RadioGroupEditorBase } from './RadioGroupBase';

export type RadioGroupEditorItem = { id: string; title: string };

interface IRadioGroupEditorProps extends IPropertyGridPropertyEditorProps<string> {
    options?: RecordSet<RadioGroupEditorItem>;
}

export const RadioGroupEditor = memo((props: IRadioGroupEditorProps) => {
    return <RadioGroupEditorBase {...props} />;
});
