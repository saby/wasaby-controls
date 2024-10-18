import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { Model } from 'Types/entity';

const loadData = () => {
    const data = new Model({
        rawData: {
            'Пользователь.Фамилия': 'Иванов',
            'Пользователь.Имя': 'Иван',
            'Пользователь.Отчество': 'Иванович',
            'Контакт.Телефон': '+79991234567',
        },
    });

    return Promise.resolve(data);
};

const slice = FormSlice;

export { loadData, slice };
