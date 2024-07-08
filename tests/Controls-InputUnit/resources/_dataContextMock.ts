import { Model } from 'Types/entity';
import { IDataConfig, IBaseDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

export const CONTEXT_OBJ = 'Data';

const FIELD_TYPES = [
    'Text',
    'String',
    'Mask',
    'Number',
    'Money',
    'Phone',
    'Date',
    'Time',
    'DateRange',
    'CheckboxGroup',
    'RadioGroup',
    'Combobox',
    'Empty'
] as const;
export type TField = (typeof FIELD_TYPES)[number];

const loadResults = {
    [CONTEXT_OBJ]: (new Model<TField>({
        rawData: {
            Text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis ante ac tortor molestie posuere a ut dolor.',
            String: 'Дважды в год лета не бывает.',
            Mask: 'LL 007',
            Number: 22,
            Money: 22,
            Phone: '+79999999999',
            Date: new Date(2022, 1, 2),
            Time: new Date(2022, 1, 2, 12, 12, 12),
            DateRange: {
                startDate: new Date(2022, 1, 2),
                endDate: new Date(2022, 1, 3),
            },
            CheckboxGroup: [1, 3],
            RadioGroup: 3,
            Combobox: null,
            Empty: undefined
        },
    }))
};

class DataMapLoader {
    read(): Promise<any> {
        return Promise.resolve(loadResults[CONTEXT_OBJ]);
    }

    update(): void {
    }
}

const Variants = [
    {id: 1, title: 'Иванов'},
    {id: 2, title: 'Петров'},
    {id: 3, title: 'Сидоров'},
];

const VariantsCheckbox = [
    {id: 1, title: 'Иванов', parent: null, node: false},
    {id: 2, title: 'Петров', parent: null, node: false},
    {id: 3, title: 'Сидоров', parent: null, node: false},
];

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

export { getLoadConfig, getBinding, loadResults, Variants, VariantsCheckbox };
