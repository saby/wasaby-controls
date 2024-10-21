import { Memory } from 'Types/source';

const getSuggestSource = (): Memory => {
    return new Memory({
        keyProperty: 'id',
        data: [
            { id: 1, suggestValue: 'Алексей', type: 'firstName' },
            { id: 2, suggestValue: 'Александр', type: 'firstName' },
            { id: 3, suggestValue: 'Андрей', type: 'firstName' },
            { id: 4, suggestValue: 'Владимир', type: 'firstName' },
            { id: 5, suggestValue: 'Иван', type: 'firstName' },
            { id: 6, suggestValue: 'Илья', type: 'firstName' },
            { id: 7, suggestValue: 'Алексеев', type: 'lastName' },
            { id: 8, suggestValue: 'Александров', type: 'lastName' },
            { id: 9, suggestValue: 'Иванов', type: 'lastName' },
            { id: 10, suggestValue: 'Алексеевич', type: 'middleName' },
            { id: 11, suggestValue: 'Александрович', type: 'middleName' },
            { id: 12, suggestValue: 'Андреевич', type: 'middleName' },
            { id: 13, suggestValue: 'Иванович', type: 'middleName' },
            { id: 14, suggestValue: 'Ильич', type: 'middleName' },
            { id: 15, suggestValue: 'Владимирович', type: 'middleName' },
        ],
        filter: (item, queryFilter: Record<string, string | unknown>) => {
            let addToData = true;
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
