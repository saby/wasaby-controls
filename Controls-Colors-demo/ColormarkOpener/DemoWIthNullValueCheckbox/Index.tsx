import { forwardRef, LegacyRef, ReactElement, useState, useCallback } from 'react';
import { useTheme } from 'UICore/Contexts';
import { itemsWithPartialSelected, palette } from '../../data';
import { DialogOpener } from 'Controls-Colors/colormarkOpener';
import { ItemsView } from 'Controls/list';
import { Model } from 'Types/entity';
import ItemTemplate from '../templates/ItemTemplate';
import 'css!Controls-Colors-demo/Style';
import { RecordSet } from 'Types/collection';

const list = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '0',
            title: 'Опросы',
        },
        {
            id: '1',
            title: 'Должности',
        },
        {
            id: '2',
            title: 'Список дел',
        },
        {
            id: '3',
            title: 'Новый документ',
        },
    ],
});

const helper = new DialogOpener({});
const itemActions = [
    {
        id: 1,
        tooltip: 'Выбрать пометку',
        icon: 'icon-Colorize',
    },
];

export default forwardRef((_: unknown, ref: LegacyRef<HTMLDivElement>): ReactElement => {
    const theme = useTheme();

    const [colormarkItems, setColormarkItems] = useState(itemsWithPartialSelected);
    const [listMarkedKey, setListMarkedKey] = useState('1');

    const onMarkedKeyChangeHandler = useCallback((key) => {
        setListMarkedKey(key);
    }, []);

    const actionClickHandler = useCallback(
        (_: Event, item: Model<{ keys: string[] }>) => {
            helper.open({
                templateOptions: {
                    items: colormarkItems,
                    palette,
                    selectedKeys: item.get('keys') || [],
                    multiSelect: true,
                    onBeforeEndEdit: (item: Model, commit, isAdd) => {
                        setColormarkItems((prev) => {
                            if (isAdd && commit) {
                                return [...prev, item.getRawData()];
                            } else if (commit) {
                                return [
                                    ...prev.filter((oldItem) => oldItem.id !== item.get('id')),
                                    item.getRawData(),
                                ];
                            }
                            return prev;
                        });
                        return commit || isAdd ? item : null;
                    },
                },
                width: theme === 'default' ? 252 : 405,
                eventHandlers: {
                    onResult(selectedKeys, excludedKeys, partialSelectedKeys) {
                        item.set(selectedKeys);
                        setColormarkItems((prev) => {
                            const newItems = [...prev];
                            newItems.forEach((colormarkItem, index) => {
                                if (
                                    colormarkItem?.partialSelected &&
                                    !partialSelectedKeys.includes(colormarkItem.id)
                                ) {
                                    colormarkItem.partialSelected = false;
                                }
                            });
                            return newItems;
                        });
                    },
                },
            });
        },
        [theme]
    );

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div
                className="tw-flex tw-justify-baseline controls-cursor_pointer Controls-Colors-demo_border
                                Controls-Colors-demo_list"
            >
                <ItemsView
                    items={list}
                    className="tw-w-full"
                    itemActions={itemActions}
                    markedKey={listMarkedKey}
                    onActionClick={actionClickHandler}
                    onMarkedKeyChanged={onMarkedKeyChangeHandler}
                    itemTemplate={ItemTemplate}
                    itemTemplateOptions={{ items: colormarkItems }}
                />
            </div>
        </div>
    );
});
