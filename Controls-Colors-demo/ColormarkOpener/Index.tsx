import { forwardRef, LegacyRef, ReactElement, useState, useCallback } from 'react';
import { useTheme } from 'UICore/Contexts';
import { itemsWithCustom, palette } from '../data';
import { DialogOpener } from 'Controls-Colors/colormarkOpener';
import { ItemsView } from 'Controls/list';
import { list } from './resources/data';
import { Model } from 'Types/entity';
import ItemTemplate from './templates/ItemTemplate';
import 'css!Controls-Colors-demo/Style';

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

    const [listMarkedKey, setListMarkedKey] = useState('1');

    const [colormarkItems, setColormarkItems] = useState(itemsWithCustom);

    const onBeforeEndEditHandler = useCallback((item: Model, commit: boolean, isAdd: boolean) => {
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
        return commit ? item : null;
    }, []);

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
                    onBeforeEndEdit: onBeforeEndEditHandler,
                    changeTypeButtonVisibility: true,
                },
                width: theme === 'default' ? 252 : 405,
                eventHandlers: {
                    onResult(res: string[]) {
                        item.set('keys', res);
                    },
                },
            });
        },
        [theme, colormarkItems, onBeforeEndEditHandler]
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
