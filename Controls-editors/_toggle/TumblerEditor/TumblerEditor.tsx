import { memo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import { TumblerEditorBase } from './TumblerEditorBase';

export type TumblerEditorItem = { id: string; title: string; icon?: string };

interface ITumblerEditorProps extends IPropertyGridPropertyEditorProps<string> {
    options?: RecordSet<TumblerEditorItem>;
}

export const TumblerEditor = memo((props: ITumblerEditorProps) => {
    return <TumblerEditorBase {...props} />;
});
