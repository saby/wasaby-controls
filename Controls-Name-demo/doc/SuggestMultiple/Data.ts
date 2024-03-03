import { Memory } from 'Types/source';

const getSuggestSource = (): Memory => {
    return new Memory({
        keyProperty: 'id',
        data: [
            {
                id: 1,
                suggestValue: {
                    lastName: 'Алексеев',
                    firstName: 'Алексей',
                    middleName: 'Владимирович',
                },
                position: 'Исполнительный директор',
                displayValue: 'Алексеев Алексей Владимирович',
                type: 'person',
            },
            {
                id: 2,
                suggestValue: {
                    lastName: 'Петров',
                    firstName: 'Андрей',
                    middleName: 'Юрьевич',
                },
                position: 'Главный бухгалтер',
                displayValue: 'Петров Андрей Юрьевич',
                type: 'person',
            },
            {
                id: 3,
                suggestValue: 'Алексей',
                displayValue: 'Алексей',
                type: 'firstName',
            },
            {
                id: 4,
                suggestValue: 'Александр',
                displayValue: 'Александр',
                type: 'firstName',
            },
            {
                id: 5,
                suggestValue: 'Андрей',
                displayValue: 'Андрей',
                type: 'firstName',
            },
            {
                id: 6,
                suggestValue: 'Владимир',
                displayValue: 'Владимир',
                type: 'firstName',
            },
            {
                id: 7,
                suggestValue: 'Иван',
                displayValue: 'Иван',
                type: 'firstName',
            },
            {
                id: 8,
                suggestValue: 'Илья',
                displayValue: 'Илья',
                type: 'firstName',
            },
            {
                id: 9,
                suggestValue: 'Алексеев',
                displayValue: 'Алексеев',
                type: 'lastName',
            },
            {
                id: 10,
                suggestValue: 'Александров',
                displayValue: 'Александров',
                type: 'lastName',
            },
            {
                id: 11,
                suggestValue: 'Иванов',
                displayValue: 'Иванов',
                type: 'lastName',
            },
            {
                id: 12,
                suggestValue: 'Алексеевич',
                displayValue: 'Алексеевич',
                type: 'middleName',
            },
            {
                id: 13,
                suggestValue: 'Александрович',
                displayValue: 'Александрович',
                type: 'middleName',
            },
            {
                id: 14,
                suggestValue: 'Андреевич',
                displayValue: 'Андреевич',
                type: 'middleName',
            },
            {
                id: 15,
                suggestValue: 'Иванович',
                displayValue: 'Иванович',
                type: 'middleName',
            },
            {
                id: 16,
                suggestValue: 'Ильич',
                displayValue: 'Ильич',
                type: 'middleName',
            },
            {
                id: 17,
                suggestValue: 'Владимирович',
                displayValue: 'Владимирович',
                type: 'middleName',
            },
        ],
        filter: (item, queryFilter: Record<string, string | unknown>) => {
            let addToData = true;
            // В демо всегда возвращаем персону
            if (item.get('type') === 'person') {
                return true;
            }
            // значение контрола
            const filterValue = queryFilter.value;
            // какое из полей ФИО редактируется
            const hintFieldType = queryFilter.hintFieldType as string;
            // Значение в редактируемом поле
            const hintFieldValue = filterValue[hintFieldType || 'firstName'];

            if (
                hintFieldValue &&
                item.get('suggestValue').toLowerCase().indexOf(hintFieldValue.toLowerCase()) !== 0
            ) {
                addToData = false;
            }
            if (hintFieldType && item.get('type') !== hintFieldType) {
                addToData = false;
            }
            return addToData;
        },
    });
};

export { getSuggestSource };
