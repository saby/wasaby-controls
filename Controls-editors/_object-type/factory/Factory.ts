import { ObjectMeta } from 'Meta/types';
import { Slice } from 'Controls-DataEnv/slice';
import { pipeline, IPipelineResult } from './pipeline/pipeline';
import { getBaseEditor, getEditorModuleName } from './pipeline/getAllEditors';
import { IMetaTypeEditors } from './pipeline/IEditorDesscription';

/**
 * Параметры фабрики для показа редактирования типа
 * @public
 */
export interface IObjectTypeFactoryArguments {
    /**
     * Метатип, для которого нужно выполнить загрузку редакторов
     */
    metaType?: ObjectMeta<object>;

    /**
     * Коллекция дефолтных редакторов для типов, которые необходимо загрузить и использовать
     */
    defaultEditors?: Record<string, string>;

    /**
     * Переопределение редакторов, указанных на типах
     */
    overridenEditors?: IMetaTypeEditors;
}

export interface IEditorComponent {
    Component: string;

    editorProps?: Record<string, unknown>;
}

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

/**
 * Фабрика для загрузки данных для редактора типа
 * @public
 */
export class ObjectTypeFactory {
    static loadData(dataFactoryArguments: IObjectTypeFactoryArguments): Promise<IPipelineResult> {
        const { metaType } = dataFactoryArguments;

        if (!metaType) {
            return Promise.resolve({
                loadedEditors: [],
                overridenEditors: {},
                defaultEditors: {},
            });
        }

        return pipeline({
            metaType,
            defaultEditors: dataFactoryArguments.defaultEditors,
            overridenEditors: dataFactoryArguments.overridenEditors,
        });
    }
    static slice = ObjectTypeSlice;
}
