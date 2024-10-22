import { IFormDataFactoryArguments } from './IFormDataFactory';
import { default as FormSlice } from './Slice';
import { createLoader } from './createLoader';

/**
 * @private
 */
export default class FormFactory {
    /**
     * Фабрика данных для работы с рекордом формы.
     * @param config
     */
    static loadData(config: IFormDataFactoryArguments): Promise<any> {
        const loader = createLoader(config);

        if (config.id === undefined || (config.id === null && !config.nullableKeyIsAllowed)) {
            return loader.create(config.createMetaData);
        }

        // @ts-ignore
        return loader.read(config.id, config.readMetaData || config.sourceOptions);
    }

    static slice = FormSlice;
}
