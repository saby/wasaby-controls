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
            name: 'AnotherUser',
            value: createTypedModel(
                {
                    ФИО: 'Другой пользователь',
                },
                'User'
            ),
        },
        {
            name: 'CurrentUser',
            value: createTypedModel(
                {
                    ФИО: 'Текущий пользователь',
                },
                'User'
            ),
        },
    ],
    findObjectInNestedModels: [
        {
            name: 'Filter',
            value: createTypedModel(
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
        {
            name: 'AnotherUser',
            value: createTypedModel(
                {
                    ФИО: 'Другой пользователь',
                },
                'User'
            ),
        },
        {
            name: 'CurrentUser',
            value: createTypedModel(
                {
                    ФИО: 'Текущий пользователь',
                },
                'User'
            ),
        },
    ],
    getValueByName: [
        {
            name: 'CurrentUser',
            value: createTypedModel(
                {
                    ФИО: 'Текущий пользователь',
                },
                'User'
            ),
        },
        {
            name: 'AnotherUser',
            value: createTypedModel(
                {
                    ФИО: 'Другой пользователь',
                },
                'User'
            ),
        },
        {
            name: 'UserWithContractor',
            value: createTypedModel(
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
    ],
};
