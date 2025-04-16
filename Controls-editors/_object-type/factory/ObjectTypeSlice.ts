import { Slice } from 'Controls-DataEnv/slice';
import { IPipelineResult } from './pipeline/pipeline';
import { ObjectMeta } from 'Meta/types';
import { getBaseEditor, getEditorModuleName } from './pipeline/getAllEditors';
import { IEditorComponent } from 'Controls-editors/_object-type/factory/Factory';

export class ObjectTypeSlice extends Slice<IPipelineResult> {
    isEditorLoaded = (editorName: string): boolean => {
        return this.state.loadedEditors.includes(editorName);
    };

    getEditor = (meta: ObjectMeta<object>): IEditorComponent | undefined => {
        let editorProps = meta.getEditor().props;

        const overridenEditor = this.state.overridenEditors[meta.getId()];

        const editorModuleName = getEditorModuleName(meta);
        if (editorModuleName) {
            if (this.isEditorLoaded(editorModuleName)) {
                const editorName = editorModuleName;
                if (
                    !!overridenEditor &&
                    (!overridenEditor.editor || overridenEditor.editor === editorName)
                ) {
                    editorProps = overridenEditor.editorProps;
                }

                return {
                    Component: editorName,
                    editorProps,
                };
            }
            return undefined;
        }

        if (!!overridenEditor && !!overridenEditor.editor) {
            return {
                Component: overridenEditor.editor,
                editorProps: overridenEditor.editorProps,
            };
        }

        const defaultEditor = getBaseEditor(meta, this.state.defaultEditors);
        if (!!defaultEditor) {
            let editorProps = meta.getEditor().props;

            const overridenEditor = this.state.overridenEditors[meta.getId()];
            if (
                !!overridenEditor &&
                (!overridenEditor.editor || overridenEditor.editor === defaultEditor)
            ) {
                editorProps = overridenEditor.editorProps;
            }

            if (this.isEditorLoaded(defaultEditor)) {
                return {
                    Component: defaultEditor,
                    editorProps,
                };
            }
        }
        return undefined;
    };
}
