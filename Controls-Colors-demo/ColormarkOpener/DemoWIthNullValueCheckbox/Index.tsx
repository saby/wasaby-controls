import { forwardRef, LegacyRef, ReactElement, useState, useCallback } from 'react';
import { useTheme } from 'UICore/Contexts';
import { itemsWithPartialSelected, palette } from '../../data';
import { DialogOpener } from 'Controls-Colors/colormarkOpener';
import { ItemsView } from 'Controls/list';
import { list } from '../resources/data';
import { Model } from 'Types/entity';
import ItemTemplate from '../templates/ItemTemplate';
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

    const onMarkedKeyChangeHandler = useCallback((key) => {
        setListMarkedKey(key);
    }, []);

    const actionClickHandler = useCallback(
        (_: Event, item: Model<{ keys: string[] }>) => {
            helper.open({
                templateOptions: {
                    items: itemsWithPartialSelected,
                    palette,
                    selectedKeys: item.get('keys') || [],
                    isAdaptive: true,
                    multiSelect: true,
                    onSelectedKeysChanged(keys) {
                        itemsWithPartialSelected.forEach((item) => {
                            if (!keys.includes(item.id)) {
                                item.partialSelected = undefined;
                            }
                        });
                    },
                },
                width: theme === 'default' ? 252 : 405,
                eventHandlers: {
                    onResult(res: string[]) {
                        item.set('keys', res);
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
                    itemTemplateOptions={{ items: itemsWithPartialSelected }}
                />
            </div>
        </div>
    );
});
