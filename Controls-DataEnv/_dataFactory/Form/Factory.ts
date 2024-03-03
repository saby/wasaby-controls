import { IFormDataFactoryArguments } from './IFormDataFactory';
import { default as FormSlice } from './Slice';
import { createLoader } from './createLoader';

const loadData = (config: IFormDataFactoryArguments): Promise<any> => {
    const loader = createLoader(config);

    if (!config.id) {
        return loader.create(config.createMetaData);
    }

    // @ts-ignore
    return loader.read(config.id, config.readMetaData || config.sourceOptions);
};

export default {
    loadData,
    slice: FormSlice,
};
