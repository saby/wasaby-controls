import { getAllEditors } from './getAllEditors';
import { loadEditors } from './loadEditors';
import { ObjectMeta } from 'Meta/types';
import { IEditorDescription, IMetaTypeEditors } from './IEditorDesscription';
import { INavigationItem } from './INavigationItem';
import { getMetaTypeNavigation } from './getMetaTypeNavigation';
import { ICategories } from './ICategories';

export interface IPipelineResult {
    loadedEditors: string[];
    defaultEditors?: Record<string, string>;
    overridenEditors: Record<string, IEditorDescription>;
    navigation?: INavigationItem[];
    metaType: ObjectMeta<object>;
    useCategories: boolean;
}

export interface IPipelineArguments {
    metaType: ObjectMeta<object>;
    defaultEditors?: Record<string, string>;
    overridenEditors?: IMetaTypeEditors;
    categories?: ICategories;
}

export async function pipeline(args: IPipelineArguments): Promise<IPipelineResult> {
    const { metaType, defaultEditors, overridenEditors, categories } = args;

    const navigation = getMetaTypeNavigation(metaType, categories);

    const editors = getAllEditors(metaType, defaultEditors);

    const preparedOverridenEditors: Record<string, IEditorDescription> = {};

    if (!!overridenEditors) {
        for (const [typeid, overridenEditor] of Object.entries(overridenEditors)) {
            let editorName: string | undefined;
            let editorProps: Record<string, unknown> | undefined;
            if (typeof overridenEditor === 'string') {
                editorName = overridenEditor;
            } else {
                editorName = overridenEditor.editor;
                editorProps = overridenEditor.editorProps;
            }

            if (!!editorName && !editors.includes(editorName)) {
                editors.push(editorName);
            }

            preparedOverridenEditors[typeid] = {
                editorProps,
                editor: editorName,
            };
        }
    }

    const complexEditors = metaType.getComplexEditors();
    if (!!complexEditors) {
        complexEditors.forEach((editor) => {
            if (!editors.includes(editor.name)) {
                editors.push(editor.name);
            }
        });
    }

    const loadedEditors = await loadEditors(editors);
    return {
        loadedEditors,
        defaultEditors,
        overridenEditors: preparedOverridenEditors,
        navigation,
        metaType,
        useCategories: !!categories,
    };
}
