import { ObjectMeta } from 'Meta/types';
import { pipeline, IPipelineResult } from './pipeline/pipeline';
import { IMetaTypeEditors } from './pipeline/IEditorDesscription';
import { ObjectTypeSlice } from './ObjectTypeSlice';
import { ICategories } from 'Controls-editors/_object-type/factory/pipeline/ICategories';

/**
 * Параметры фабрики для показа редактирования типа
 * @public
 */
export interface IObjectTypeFactoryArguments {
    /**
     * Метатип, для которого нужно выполнить загрузку редакторов
     */
    metaType: ObjectMeta<object>;

    /**
     * Коллекция дефолтных редакторов для типов, которые необходимо загрузить и использовать
     */
    defaultEditors?: Record<string, string>;

    /**
     * Переопределение редакторов, указанных на типах
     */
    overridenEditors?: IMetaTypeEditors;

    /**
     * Временный параметр до появления такого атрибута на метатипе
     */
    _categories: ICategories;
}

/**
 * Фабрика для загрузки данных для редактора типа
 * @public
 */
export class ObjectTypeFactory {
    static loadData(dataFactoryArguments: IObjectTypeFactoryArguments): Promise<IPipelineResult> {
        const { metaType } = dataFactoryArguments;

        return pipeline({
            metaType,
            defaultEditors: dataFactoryArguments.defaultEditors,
            overridenEditors: dataFactoryArguments.overridenEditors,
            categories: dataFactoryArguments._categories,
        });
    }
    static slice = ObjectTypeSlice;
}
