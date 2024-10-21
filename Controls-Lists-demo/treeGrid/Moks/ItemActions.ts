import { TItemActionShowType } from 'Controls/itemActions';
import { IAction } from 'Controls/interface';

const itemActions: IAction[] = [
    {
        id: 5,
        title: 'прочитано',
        showType: TItemActionShowType.TOOLBAR,
        parent: null,
        actionName: 'Controls-Lists-demo/treeGrid/ItemActions/DummyAction',
    },
    {
        id: 1,
        icon: 'icon-PhoneNull',
        title: 'phone',
        parent: null,
        actionName: 'Controls-Lists-demo/treeGrid/ItemActions/DummyAction',
    },
    {
        id: 2,
        icon: 'icon-EmptyMessage',
        title: 'message',
        parent: null,
        'parent@': true,
        actionName: 'Controls-Lists-demo/treeGrid/ItemActions/DummyAction',
    },
    {
        id: 3,
        icon: 'icon-Profile',
        title: 'profile',
        showType: TItemActionShowType.MENU_TOOLBAR,
        parent: 2,
        'parent@': null,
        actionName: 'Controls-Lists-demo/treeGrid/ItemActions/DummyAction',
    },
    {
        id: 6,
        title: 'call',
        parent: 2,
        'parent@': null,
        actionName: 'Controls-Lists-demo/treeGrid/ItemActions/DummyAction',
    },
    {
        id: 'delete',
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'delete pls',
        parent: null,
        showType: TItemActionShowType.MENU_TOOLBAR,
        actionName: 'Controls/actions:Remove',
    },
];

export default itemActions;
