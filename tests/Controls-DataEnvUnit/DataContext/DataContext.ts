import { Model } from 'Types/entity';

function createTypedModel(rawData: Record<string, unknown>, type: string): Model {
    return new Model({
        rawData,
        typeName: type,
    });
}

export const testCases = {
    findObjectByName: [
        {
            id: 'root',
            data: {
                CurrentUser: createTypedModel(
                    {
                        ФИО: 'Текущий пользователь',
                    },
                    'User'
                ),
            },
        },
        {
            id: 'frame',
            data: {
                AnotherUser: createTypedModel(
                    {
                        ФИО: 'Другой пользователь',
                    },
                    'User'
                ),
            },
            parent: 'root',
        },
    ],
    findObjectInNestedModels: [
        {
            id: 'root',
            data: {
                CurrentUser: createTypedModel(
                    {
                        ФИО: 'Текущий пользователь',
                    },
                    'User'
                ),
            },
        },
        {
            id: 'frame',
            data: {
                AnotherUser: createTypedModel(
                    {
                        ФИО: 'Другой пользователь',
                    },
                    'User'
                ),
                Filter: createTypedModel(
                    {
                        FilteredUser: createTypedModel(
                            {
                                ФИО: 'Пользователь из фильтра',
                            },
                            'User'
                        ),
                    },
                    'Filter'
                ),
            },
            parent: 'root',
        },
    ],
    getValueByName: [
        {
            id: 'root',
            data: {
                CurrentUser: createTypedModel(
                    {
                        ФИО: 'Текущий пользователь',
                    },
                    'User'
                ),
            },
        },
        {
            id: 'frame',
            data: {
                AnotherUser: createTypedModel(
                    {
                        ФИО: 'Другой пользователь',
                    },
                    'User'
                ),
                UserWithContractor: createTypedModel(
                    {
                        Контрагент: createTypedModel(
                            {
                                ФИО: 'ФИО Контрагента',
                            },
                            'Contractor'
                        ),
                    },
                    'ContractorUser'
                ),
            },
            parent: 'root',
        },
    ],
};
