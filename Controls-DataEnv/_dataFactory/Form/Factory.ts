import { IFormDataFactoryResult, IFormDataFactoryArguments } from './IFormDataFactory';
import { default as FormSlice } from './Slice';
import { createLoader } from './createLoader';

const loadData = (
    config: IFormDataFactoryArguments,
    dependenciesResults?: Record<string, unknown>,
    loadDataTimeout?: number
): Promise<IFormDataFactoryResult> => {
    const loader = createLoader(config);

    if (!config.id) {
        return loader.create(config.createMetaData);
    }

    return loader.read(config.id, config.readMetaData || config.sourceOptions);
};

export default {
    loadData,
    slice: FormSlice,
};
