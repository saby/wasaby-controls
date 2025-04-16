import { Memory } from 'Types/source';

const getConfig = () => {
    const source = new Memory({
        data: [
            {
                id: 0,
                title: 'Запись 1',
            },
            {
                id: 1,
                title: 'Запись 2',
            },
        ],
        keyProperty: 'id',
    });
    return {
        source,
        keyProperty: 'id',
        displayProperty: 'title',
    };
};

export { getConfig };
