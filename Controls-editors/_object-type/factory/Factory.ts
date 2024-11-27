import { ObjectMeta } from 'Meta/types';
import { Slice } from 'Controls-DataEnv/slice';
import { pipeline, IPipelineResult } from './pipeline/pipeline';
import { FC } from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { getBaseEditor } from './pipeline/getAllEditors';

export interface IObjectTypeFactoryArguments {
    /**
     * Метатип, для которого нужно выполнить загрузку редакторов
     */
    metaType?: ObjectMeta<object>;

    /**
     * Коллекция дефолтных редакторов для типов, которые необходимо загрузить и использовать
     */
    defaultEditors?: Record<string, string>;
}

export interface IObjectTypeSliceState {
    loadedEditors: string[];
    defaultEditors?: Record<string, string>;
}

export class ObjectTypeSlice extends Slice<IObjectTypeSliceState> {
    isEditorLoaded = (editorName: string): boolean => {
        return this.state.loadedEditors.includes(editorName);
    };

    getEditor = (meta: ObjectMeta<object>): FC<any> | undefined => {
        if (meta.getEditor()._moduleName) {
            if (this.isEditorLoaded(meta.getEditor()._moduleName)) {
                return loadSync(meta.getEditor()._moduleName) as FC<any>;
            }
            return undefined;
        }

        const defaultEditor = getBaseEditor(meta, this.state.defaultEditors);
        if (!!defaultEditor) {
            if (this.isEditorLoaded(defaultEditor)) {
                return loadSync(defaultEditor) as FC<any>;
            }
        }
        return undefined;
    };
}

export class ObjectTypeFactory {
    static loadData(dataFactoryArguments: IObjectTypeFactoryArguments): Promise<IPipelineResult> {
        const { metaType } = dataFactoryArguments;

        if (!metaType) {
            return Promise.resolve({
                loadedEditors: [],
            });
        }

        return pipeline({
            metaType,
            defaultEditors: dataFactoryArguments.defaultEditors,
        });
    }
    static slice = ObjectTypeSlice;
}
