import { Factory } from 'Controls-ListEnv/filterDataFactory';
import { Memory } from 'Types/source';
import { IRouter } from 'Router/router';
import { IFilterItem } from 'Controls/filter';

describe('Controls-ListEnv/filterDataFactory:Factory loadData', () => {
    it('Данные для редакторов фильтра загружены после вызова loadData', async () => {
        const filterDescription: IFilterItem[] = [
            {
                name: 'filter',
                value: [],
                resetValue: [],
                type: 'list',
                editorOptions: {
                    keyProperty: 'key',
                    source: new Memory({
                        data: [
                            {
                                key: 0,
                                city: 'Ярославль',
                            },
                        ],
                        keyProperty: 'key',
                    }),
                },
            },
        ];

        const Router = {} as IRouter;
        const result = await Factory.loadData({ filterDescription }, {}, Router);
        expect(result.filterDescription[0].editorOptions.items.getCount()).toBe(1);
    });
});
