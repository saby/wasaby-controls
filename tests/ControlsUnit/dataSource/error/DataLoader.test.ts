import { ICrud, Memory, PrefetchProxy } from 'Types/source';
import { DataLoader } from 'Controls/_dataSource/error';

describe('Controls/_dataSource/_error/DataLoader', () => {
    let memory: Memory;

    describe('load', () => {
        const getResult = async (sourcesProp, timeout = 0) => {
            const { sources, errors } = await DataLoader.load(
                sourcesProp,
                timeout
            );
            if (errors.length > 0) {
                const { status } = errors[0];
                return status;
            }
            const { source }: { source: ICrud | PrefetchProxy } = sources[0];
            if (source instanceof PrefetchProxy) {
                const { query } = source.getData();
                return query.getRawData();
            }
            return false;
        };

        const data = [
            { key: 1, title: 'Ярославль' },
            { key: 2, title: 'Москва' },
            { key: 3, title: 'Санкт-Петербург' },
        ];
        memory = new Memory({
            data: [...data],
            keyProperty: 'id',
        });

        // Минимальный набор параметров
        // Только обязательные поля
        const defaultSourcesProp = [
            {
                source: memory,
            },
        ];
        it('defaultSourcesProp', async () => {
            const wrapper = await getResult(defaultSourcesProp, 2000);
            expect(wrapper).toEqual(data);
        });
    });
});
