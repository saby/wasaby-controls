import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { memo } from 'react';
import type { ComponentType } from 'react';
import { IPropertyEditorProps, IComponent } from 'Meta/types';
import { IComponentLoader } from 'Meta/types';

export function createEditorLoader<E extends IPropertyEditorProps<any>>(
    editorPath: string,
    getEditorData: (data: unknown) => Record<string, any>
): IComponentLoader<E> {
    const createEditorLoaderInner = async (data: unknown): Promise<IComponent<any>> => {
        const Editor = await loadAsync<ComponentType<E>>(editorPath);
        const editorData = await getEditorData(data);

        return memo((props: E) => {
            return <Editor {...editorData} {...props} />;
        });
    };
    createEditorLoaderInner._fixedEditorName = 'createEditorLoaderInner';
    return createEditorLoaderInner;
}
