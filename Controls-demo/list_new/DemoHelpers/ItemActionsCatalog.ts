import { IItemAction, TActionDisplayMode, TItemActionShowType } from 'Controls/itemActions';

function getActionsForContacts(): IItemAction[] {
    return [
        {
            id: 1,
            title: 'Прочитано',
            showType: TItemActionShowType.TOOLBAR,
        },
        {
            id: 2,
            icon: 'icon-PhoneNull',
            title: 'Позвонить',
            showType: TItemActionShowType.MENU_TOOLBAR,
        },
        {
            id: 3,
            icon: 'icon-EmptyMessage',
            title: 'Написать',
            'parent@': true,
            showType: TItemActionShowType.TOOLBAR,
        },
        {
            id: 4,
            icon: 'icon-Chat',
            title: 'Диалог',
            showType: TItemActionShowType.MENU_TOOLBAR,
            parent: 3,
        },
        {
            id: 5,
            icon: 'icon-Email',
            title: 'Email',
            showType: TItemActionShowType.MENU,
            parent: 3,
        },
        {
            id: 6,
            icon: 'icon-Profile',
            title: 'Профиль пользователя',
            showType: TItemActionShowType.MENU,
        },
        {
            id: 7,
            title: 'Удалить',
            showType: TItemActionShowType.MENU,
            icon: 'icon-Erase',
            iconStyle: 'danger',
        },
    ];
}

function getActionsWithSVG(): IItemAction[] {
    return [
        {
            id: 8,
            icon: 'Controls-demo/icons:icon-Successful',
            title: 'Успешно',
            showType: TItemActionShowType.MENU_TOOLBAR,
        },
        ...getActionsForContacts(),
    ];
}

function getActionsWithDisplayMode(): IItemAction[] {
    return [
        {
            id: 1,
            icon: 'icon-Email',
            title: 'Email',
            displayMode: TActionDisplayMode.BOTH,
            tooltip: 'Электронная почта',
            showType: TItemActionShowType.TOOLBAR,
        },
        {
            id: 2,
            icon: 'icon-Profile',
            title: 'Профиль пользователя',
            displayMode: TActionDisplayMode.TITLE,
            showType: TItemActionShowType.TOOLBAR,
        },
        {
            id: 3,
            title: 'Удалить',
            showType: TItemActionShowType.TOOLBAR,
            displayMode: TActionDisplayMode.ICON,
            icon: 'icon-Erase',
            iconStyle: 'danger',
        },
    ];
}

function getMoreActions(): IItemAction[] {
    return [
        {
            id: 10,
            icon: 'icon-Erase icon-error',
            title: 'delete pls',
            showType: TItemActionShowType.TOOLBAR,
            handler: () => {
                // eslint-disable-next-line
                console.log('click to error-icon');
            },
        },
        {
            id: 12,
            icon: 'icon-View',
            title: 'view',
            showType: TItemActionShowType.TOOLBAR,
            handler: () => {
                // eslint-disable-next-line
                console.log('click to View-icon');
            },
        },
        {
            id: 13,
            icon: 'icon-Motion',
            title: 'motion',
            showType: TItemActionShowType.TOOLBAR,
            handler: () => {
                // eslint-disable-next-line
                console.log('click to Motion-icon');
            },
        },
    ];
}

function getActionsWithViewMode(): IItemAction[] {
    return [
        {
            id: 'delete',
            icon: 'icon-Erase',
            title: 'Удалить',
            showType: TItemActionShowType.MENU_TOOLBAR,
            viewMode: 'link',
            iconStyle: 'danger',
        },
        {
            id: 'redirect',
            icon: 'icon-Redirect',
            title: 'Перевести',
            showType: TItemActionShowType.MENU_TOOLBAR,
            viewMode: 'filled',
            iconStyle: 'secondary',
        },
        {
            id: 'forward',
            icon: 'icon-DayForward',
            title: 'Старт',
            showType: TItemActionShowType.MENU_TOOLBAR,
            viewMode: 'filled',
            style: 'success',
            iconStyle: 'contrast',
        },
        {
            id: 'profile',
            icon: 'icon-Profile',
            title: 'Профиль пользователя',
            showType: TItemActionShowType.MENU_TOOLBAR,
            iconStyle: 'secondary',
            viewMode: 'link',
        },
        {
            id: 'email',
            icon: 'icon-Email',
            title: 'Email',
            showType: TItemActionShowType.MENU_TOOLBAR,
            iconStyle: 'secondary',
            viewMode: 'link',
            displayMode: TActionDisplayMode.BOTH,
        },
        {
            id: 'phoneCell',
            icon: 'icon-PhoneCell',
            title: 'Звонок',
            showType: TItemActionShowType.MENU_TOOLBAR,
            viewMode: 'link',
            displayMode: TActionDisplayMode.TITLE,
        },
    ];
}

export {
    getActionsForContacts,
    getActionsWithDisplayMode,
    getMoreActions,
    getActionsWithViewMode,
    getActionsWithSVG,
};
