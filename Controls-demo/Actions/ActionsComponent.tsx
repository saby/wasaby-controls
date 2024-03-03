import * as React from 'react';
import { ActionsComponent, IAction } from 'Controls/itemActions';
import { Sticky } from 'Controls/popup';
import { Memory } from 'Types/source';

const ACTIONS: IAction[] = [
    {
        id: 'read',
        caption: 'Прочитано',
        viewMode: 'link',
        style: 'secondary',
    },
    {
        id: 'phone',
        icon: 'icon-PhoneNull',
        tooltip: 'Позвонить',
    },
    {
        id: 'message',
        icon: 'icon-EmptyMessage',
        tooltip: 'Написать',
        isMenu: true,
    },
    {
        id: 'settings',
        icon: 'icon-SettingsNew',
        isMenu: true,
    },
];

const ACTIONS_IN_MENU: IAction[] = [
    {
        id: 'phone',
        icon: 'icon-PhoneNull',
        title: 'Позвонить',
    },
    {
        id: 'profile',
        icon: 'icon-Profile',
        title: 'Профиль пользователя',
    },
    {
        id: 'remove',
        title: 'Удалить',
        icon: 'icon-Erase',
        iconStyle: 'danger',
    },
];

const ACTIONS_IN_MESSAGE: IAction[] = [
    {
        id: 'chat',
        icon: 'icon-Chat',
        title: 'Диалог',
    },
    {
        id: 'email',
        icon: 'icon-Email',
        title: 'Email',
    },
];

export default function (): React.ReactElement {
    const onActionClick = (event: React.MouseEvent, action: IAction) => {
        if (action.isMenu) {
            const source = new Memory({
                data: action.id === 'message' ? ACTIONS_IN_MESSAGE : ACTIONS_IN_MENU,
                keyProperty: 'id',
            });
            const headConfig =
                action.id === 'message'
                    ? {
                          caption: 'Написать',
                          icon: 'icon-EmptyMessage',
                          iconSize: 'm',
                      }
                    : null;
            Sticky.openPopup({
                target: event.target,
                opener: this,
                closeOnOutsideClick: true,
                eventHandlers: {
                    onResult: (eventName, item) => {
                        return (
                            eventName === 'itemClick' &&
                            window.alert(`Click on action ${item.getKey()}`)
                        );
                    },
                },
                template: 'Controls/menu:Popup',
                templateOptions: {
                    keyProperty: 'id',
                    iconSize: 'm',
                    source,
                    showHeader: action.id === 'message',
                    headConfig,
                },
            });
        } else {
            window.alert(`Click on action ${action.id}`);
        }
    };

    return (
        <div>
            <ActionsComponent
                actions={ACTIONS}
                iconSize={'m'}
                iconStyle={'secondary'}
                onActionClick={onActionClick}
            />
        </div>
    );
}
