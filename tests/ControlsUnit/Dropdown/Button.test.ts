import { Button, IButtonOptions } from 'Controls/dropdown';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';

describe('Controls/_dropdown:Button', () => {
    describe('openMenu', () => {
        let isSelectElement = false;
        let items;
        let source: Memory;
        let itemsRecords: RecordSet;

        let dropdownButton: Button;

        beforeEach(() => {
            items = [
                {
                    id: '1',
                    title: 'Запись 1',
                },
                {
                    id: '2',
                    title: 'Запись 2',
                },
                {
                    id: '3',
                    title: 'Запись 3',
                    icon: 'icon-medium icon-Doge icon-primary',
                },
                {
                    id: '4',
                    title: 'Запись 4',
                },
                {
                    id: '5',
                    title: 'Запись 5',
                },
                {
                    id: '6',
                    title: 'Запись 6',
                },
                {
                    id: '7',
                    title: 'Запись 7',
                },
                {
                    id: '8',
                    title: 'Запись 8',
                },
            ];
            itemsRecords = new RecordSet({
                keyProperty: 'id',
                rawData: [...items],
            });
            source = new Memory({
                keyProperty: 'id',
                data: items,
            });
        });

        afterEach(() => {
            dropdownButton = undefined;
        });

        it('Open menu with 1 element', async () => {
            const baseControlCfg: IButtonOptions = {
                source: new Memory({
                    keyProperty: 'id',
                    data: [
                        {
                            id: 1,
                            title: 'title',
                        },
                    ],
                }),
                onMenuItemActivate: () => {
                    isSelectElement = true;
                },
            };
            dropdownButton = new Button(baseControlCfg);
            isSelectElement = false;
            await dropdownButton.componentDidMount();
            await dropdownButton.openMenu();
            expect(isSelectElement).toBe(true);
        });

        it('lazy load', () => {
            const buttonConfig = {
                source,
                keyProperty: 'id',
                lazyItemsLoading: true,
            };
            dropdownButton = new Button(buttonConfig);
            dropdownButton.componentDidMount();
            expect(dropdownButton._controller._items).toBeNull();
        });

        it('check _hasItems', async () => {
            let hasItems = true;
            const buttonConfig = {
                source: new Memory({
                    data: [],
                    keyProperty: 'id',
                }),
                dataLoadCallback: (loadedItems) => {
                    hasItems = loadedItems.getCount() > 0;
                },
            };
            dropdownButton = new Button(buttonConfig);
            await dropdownButton.componentDidMount();
            expect(hasItems).toBe(false);

            dropdownButton = new Button({
                ...buttonConfig,
                source: new Memory({
                    data: [{ id: 1 }],
                    keyProperty: 'id',
                }),
            });
            await dropdownButton.componentDidMount();
            expect(hasItems).toBe(true);
        });
    });
});
