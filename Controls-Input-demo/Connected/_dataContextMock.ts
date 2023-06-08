import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IDataConfig, IBaseDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

export const CONTEXT_OBJ = 'Data';

const FIELD_TYPES = [
    'Text',
    'String',
    'Number',
    'Phone',
    'Date',
    'DateRange',
    'CheckboxGroup',
    'RadioGroup',
    'Combobox',
] as const;
export type TField = (typeof FIELD_TYPES)[number];

class DataMapLoader {
    read(): Promise<any> {
        const data = new Model<TField>({
            rawData: {
                Text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis ante ac tortor molestie posuere a ut dolor.',
                String: 'Дважды в год лета не бывает.',
                Number: 22,
                Phone: '+79999999999',
                Date: new Date(2022, 1, 2),
                DateRange: {
                    startValue: new Date(2022, 1, 2),
                    endValue: new Date(2022, 1, 3),
                },
                CheckboxGroup: [1, 3],
                RadioGroup: 3,
                Combobox: 'Петров',
            },
        });

        return Promise.resolve(data);
    }

    update(): void {}
}

const Variants = new RecordSet({
    rawData: [
        { id: 1, title: 'Иванов' },
        { id: 2, title: 'Петров' },
        { id: 3, title: 'Сидоров' },
    ],
    keyProperty: 'id',
});

const getLoadConfig = (): Record<string, IDataConfig<IBaseDataFactoryArguments>> => {
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

export { getLoadConfig, getBinding, Variants };
