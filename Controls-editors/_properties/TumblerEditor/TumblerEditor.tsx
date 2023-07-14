import { memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from '../../_object-type/ObjectTypeEditor';
import { RecordSet } from 'Types/collection';
import { TumblerEditorBase } from './TumblerEditorBase';

export type TumblerEditorItem = { id: string; title: string; icon?: string };

interface ITumblerEditorProps extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: RecordSet<TumblerEditorItem>;
}

export const TumblerEditor = memo((props: ITumblerEditorProps) => {
    return <TumblerEditorBase {...props} />;
});
