import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { memo } from 'react';
import type { ComponentType } from 'react';
import { IPropertyEditorProps, IComponent } from 'Types/meta';
import { IComponentLoader } from 'Types/meta';

export function createEditorLoader<E extends IPropertyEditorProps<any>>(
    editorPath: string,
    getEditorData: (data: unknown) => Record<string, any>
): IComponentLoader<E> {
    return async (data: unknown): Promise<IComponent<any>> => {
        const Editor = await loadAsync<ComponentType<E>>(editorPath);
        const editorData = await getEditorData(data);

        return memo((props: E) => {
            return <Editor {...editorData} {...props} />;
        });
    };
}