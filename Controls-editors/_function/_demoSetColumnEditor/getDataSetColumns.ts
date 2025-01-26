import { RecordSet } from 'Types/collection';
import { Model, adapter } from 'Types/entity';
import { BaseBindingFacade } from 'Frame/base';

const columns: {
    id: string;
    title: string;
    type: string;
}[] = [
    {
        id: 'FirstName',
        title: 'Имя',
        type: 'integer',
    },
    {
        id: 'LastName',
        title: 'Фамилия',
        type: 'string',
    },
    {
        id: 'MiddleName',
        title: 'Отчество',
        type: 'string',
    },
    {
        id: 'Age',
        title: 'Возраст',
        type: 'number',
    },
];

/**
 * Возвращает описание колонок выборки из сервиса мета-типов
 * @remark Пока возвращает мокнутые данные, как будет готов метод допилим
 * @param bindingFacade
 */
async function getDataSetColumns(bindingFacade: BaseBindingFacade): Promise<RecordSet | undefined> {
    if (!bindingFacade) {
        return;
    }
    const rs = new RecordSet({
        adapter: new adapter.Sbis(),
    });

    columns.forEach((column) => {
        rs.add(
            new Model({
                adapter: new adapter.Sbis(),
                format: {
                    Id: { type: 'string', defaultValue: column.id },
                    Title: { type: 'string', defaultValue: column.title },
                    Type: { type: 'string', defaultValue: column.type },
                },
            })
        );
    });

    return rs;
}

export { getDataSetColumns };
