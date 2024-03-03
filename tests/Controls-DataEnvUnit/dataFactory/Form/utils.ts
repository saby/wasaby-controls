import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { Model } from 'Types/entity';
import Store from 'Controls-DataEnv/_context/Store';

const SLICE = 'FormData';
const KEY = '1111';
const TEST_VALUE = 'Тестовое значение';

type TGetSliceOptions = {
    mockRecord: Model;
    factoryArgs?: Record<string, unknown>;
    onDataSave?: () => void;
    onDataLoad?: () => void;
    onDataChange?: () => void;
};

/*
 * Создаёт экземпляр слайса формы
 */
function getSlice(args: TGetSliceOptions): FormSlice {
    const loadResults = {
        [SLICE]: args.mockRecord,
    };

    const configs = {
        [SLICE]: {
            dataFactoryName: 'Controls-DataEnv/dataFactory:Form',
            dataFactoryArguments: {
                id: KEY,
                onDataSave: args.onDataSave,
                onDataLoad: args.onDataLoad,
                onDataChange: args.onDataChange,
                ...args.factoryArgs,
            },
        },
    };

    const store = new Store({ loadResults, configs, onChange: () => {} }).getState();
    return store[SLICE] as FormSlice;
}

export { getSlice, TGetSliceOptions, KEY, TEST_VALUE };
