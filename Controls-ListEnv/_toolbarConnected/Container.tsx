import * as React from 'react';
import { useSlice, DataContext } from 'Controls-DataEnv/context';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { IActionOptions, Container } from 'Controls/actions';
import { ListSlice } from 'Controls/dataFactory';

export interface IToolbarContainerConnectedProps extends React.PropsWithChildren<any> {
    storeId: string;
    actions: string;
    permissionResolver?: string;
}

interface IZone {
    isModify: () => string;
}

interface IPermissionsResolver {
    get: (zones: string[]) => IZone[];
}

function permissionsRequired(items: IActionOptions[]): boolean {
    return items.some((item) => {
        return !!item.permissions?.length;
    });
}

function getActionsByPermissions(
    items: IActionOptions[] = [],
    permissionsResolverModule: string
): IActionOptions[] {
    if (!permissionsResolverModule) {
        throw new Error(
            'Controls-ListEnv/toolbar:Container::Отсутствует permissionsResolver для получения прав доступа'
        );
    } else if (!isLoaded(permissionsResolverModule)) {
        throw new Error(
            `Controls-ListEnv/toolbar:Container::Резолвер получения прав ${permissionsResolverModule} не загружен`
        );
    } else {
        const permissionsResolver = loadSync<IPermissionsResolver>(permissionsResolverModule);
        const hasPermission = (
            zone: IZone,
            requiredLevel: string = 'Read',
            item: IActionOptions
        ): boolean => {
            const permission = zone[`is${requiredLevel}`]();
            if (permission && !zone.isModify()) {
                // Блокируем элементы которые недоступны для редактирования
                item.readOnly = true;
            }
            return permission;
        };

        const filteredItems: IActionOptions[] = [];
        items.forEach((item: IActionOptions) => {
            let permission;
            if (!item.permissions) {
                permission = true;
            } else if (item.permissionsMode === 0) {
                permission = permissionsResolver.get(item.permissions).some((zone) => {
                    return hasPermission(zone, item.requiredLevel, item);
                });
            } else {
                permission = permissionsResolver.get(item.permissions).every((zone) => {
                    return hasPermission(zone, item.requiredLevel, item);
                });
            }
            if (permission) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    }
}

function getActions(actions: string | IActionOptions[]): IActionOptions[] {
    if (typeof actions === 'string') {
        return loadSync(actions);
    }
    return actions || [];
}

function ToolbarContainerConnected(
    props: IToolbarContainerConnectedProps,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    const slice = useSlice<ListSlice>(props.storeId);
    const context = React.useContext(DataContext);
    const actions = React.useMemo(() => {
        let resolvedActions = getActions(props.actions);
        if (permissionsRequired(resolvedActions)) {
            resolvedActions = getActionsByPermissions(resolvedActions, props.permissionsResolver);
        }
        return resolvedActions;
    }, [props.actions, props.permissionResolver]);
    return (
        <Container
            {...props}
            prefetchData={context}
            forwardedRef={ref}
            operationsController={slice?.state?.operationsController}
            sourceController={slice?.state?.sourceController}
            slice={slice}
            content={props.content}
            actions={actions}
        />
    );
}

const forwardedToolbarContainerConnected = React.forwardRef(ToolbarContainerConnected);
forwardedToolbarContainerConnected.defaultProps = {
    storeId: 0,
    permissionsResolver: 'Permission/access:Permission',
};

export default forwardedToolbarContainerConnected;
