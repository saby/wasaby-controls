import { IFormDataFactoryResult, IFormDataFactoryArguments } from './IFormDataFactory';
import { default as FormSlice } from './Slice';
import { createLoader } from './createLoader';

const loadData = (
    config: IFormDataFactoryArguments,
    dependenciesResults?: Record<string, unknown>,
    loadDataTimeout?: number
): Promise<IFormDataFactoryResult> => {
    const loader = createLoader(config);

    return loader.read(config.id, config.sourceOptions);
};

export default {
    loadData,
    slice: FormSlice,
};
