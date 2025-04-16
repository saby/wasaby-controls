import * as React from 'react';
import { showType, View as ToolbarView } from 'Controls/toolbars';
import { RecordSet } from 'Types/collection';
import { data } from 'Controls-demo/Toolbar/resources/toolbarItems';

export default function ToolbarMaxVisibleItemsDemo() {
    const [items, setItems] = React.useState(() => {
        return new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    icon: 'icon-Time',
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                    title: 'Отметить время',
                },
                {
                    id: '2',
                    icon: 'icon-Linked',
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                    iconStyle: 'secondary',
                    contrastBackground: true,
                    title: 'Связанные документы',
                },
                {
                    id: '3',
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                    icon: 'icon-Link',
                    title: 'Скопировать в буфер',
                },
                {
                    id: '4',
                    icon: 'icon-EmptyMessage',
                    fontColorStyle: 'secondary',
                    showHeader: true,
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                    iconStyle: 'secondary',
                    contrastBackground: true,
                    title: 'Обсудить',
                },
                {
                    id: '5',
                    showType: showType.MENU,
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                    title: 'Видеозвонок',
                    icon: 'icon-VideoCall2',
                    iconStyle: 'info',
                },
                {
                    id: '6',
                    showType: showType.MENU,
                    title: 'Сообщение',
                    icon: 'icon-EmptyMessage',
                    iconStyle: 'warning',
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                },
                {
                    id: '7',
                    showType: showType.MENU,
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                    icon: 'icon-Groups',
                    fontColorStyle: 'secondary',
                    title: 'Совещания',
                },
                {
                    id: '8',
                    showType: showType.MENU,
                    icon: 'icon-Report',
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                    fontColorStyle: 'secondary',
                    title: 'Список задач',
                },
                {
                    id: '9',
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                    icon: 'icon-ArrangePreview',
                    title: 'Вид',
                },
            ],
        });
    });

    const itemClick = React.useCallback((item) => {
        if (item.get('isUpdateIcon')) {
            const parentId = item.get('parent');
            const itemsData = data.getItemsWithDirection();
            itemsData.forEach((itemData) => {
                if (itemData.id === parentId) {
                    itemData.icon = item.get('icon');
                }
            });
            setItems(
                new RecordSet({
                    keyProperty: 'id',
                    rawData: itemsData,
                })
            );
        }
    }, []);

    return (
        <div className="controlsDemo__wrapper controlsDemo_fixedWidth350">
            <div className="controlsDemo__cell" data-qa="controlsDemo_Toolbar__horizontal">
                <ToolbarView
                    direction="horizontal"
                    parentProperty="parent"
                    nodeProperty="@parent"
                    items={items}
                    iconSize="s"
                    keyProperty="id"
                    onItemClick={itemClick}
                    menuItemsExpandMode="toolbar"
                    inlineHeight="xl"
                    viewMode="filled"
                    menuIconSize="s"
                    menuButtonStyle="pale"
                    menuButtonViewMode="filled"
                    menuIconStyle="label"
                />
            </div>
        </div>
    );
}
