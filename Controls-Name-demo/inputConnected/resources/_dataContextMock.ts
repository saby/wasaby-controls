import { Model } from 'Types/entity';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';

export const CONTEXT_OBJ = 'Data';

const FIELD_TYPES = [
    'Name',
    'Empty'
] as const;
export type TField = (typeof FIELD_TYPES)[number];

class DataMapLoader {
    read(): Promise<any> {
        const data = new Model<TField>({
            rawData: {
                Name: {
                    firstName: 'Иван',
                    middleName: 'Иванович',
                    lastName: 'Иванов'
                },
                Empty: undefined
            },
        });

        return Promise.resolve(data);
    }

    update(): void {
    }
}

const getLoadConfig = (): Record<string, IDataConfig<unknown>> => {
    return {
        [CONTEXT_OBJ]: {
            dataFactoryName: 'Controls-DataEnv/dataFactory:Form',
            dataFactoryArguments: {
                id: '5d65a308-ac09-4e09-8fe2-2ff7d1b2464b',
                source: DataMapLoader,
                sourceOptions: {
                    mode: 'Runtime',
                },
            },
        },
    };
};

const getBinding = (field: TField): string[] => {
    return [CONTEXT_OBJ, field];
};

export { getLoadConfig, getBinding };
