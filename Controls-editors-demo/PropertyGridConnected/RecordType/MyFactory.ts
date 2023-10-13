import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { Model } from 'Types/entity';

const loadData = () => {
    const data = Model.fromObject({
        Configuration: {
            Caption: 'Awesome object',
            Width: 180,
            Height: 100,
        },
    });

    return Promise.resolve(data);
};

const slice = FormSlice;

export { loadData, slice };
