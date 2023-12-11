import { IFormSlice } from 'Controls-DataEnv/_dataFactory/Form/Slice';
import { Model } from 'Types/entity';
import Store from 'Controls-DataEnv/_context/Store';

const SLICE = 'FormData';
const KEY = '1111';
const TEST_VALUE = 'Тестовое значение';

type TGetSliceOptions = {
    mockData: Record<string, unknown>;
    factoryArgs?: Record<string, unknown>;
    onDataSave?: () => void;
    onDataLoad?: () => void;
    onDataChange?: () => void;
};

/*
 * Создаёт экземпляр слайса формы
 */
export function getSlice(args: TGetSliceOptions): IFormSlice {
    const loadResults = {
        [SLICE]: new Model({
            rawData: args.mockData,
        }),
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
    return store[SLICE];
}

export { getSlice, TGetSliceOptions, mockData, KEY, TEST_VALUE };
