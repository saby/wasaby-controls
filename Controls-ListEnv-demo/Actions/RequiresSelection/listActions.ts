import { IActionOptions } from 'Controls/actions';
import 'Controls-ListEnv-demo/Actions/RequiresSelection/DefaultAction';

export default [
    {
        id: 'print',
        storeId: 'actionsFilter',
        title: 'Печать',
        requiresSelection: true,
        icon: 'icon-Print',
        actionName: 'Controls-ListEnv-demo/Actions/RequiresSelection/DefaultAction',
    },
    {
        id: 'info',
        title: 'История',
        icon: 'icon-ExpandList',
        actionName: 'Controls-ListEnv-demo/Actions/RequiresSelection/DefaultAction',
    },
] as IActionOptions[];
