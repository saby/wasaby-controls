import { TemplateFunction, Control, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_toolbar/Container';
import { IActionOptions } from 'Controls/actions';
import { loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { IContextValue } from 'Controls/context';

interface IToolbarWrapperOptions extends IControlOptions {
    actions: IActionOptions[];
    storeId: number;
    _dataOptionsValue: IContextValue;
    permissionsResolver?: string;
}

interface IZone {
    isModify: () => string;
}

interface IPermissionsResolver {
    get: (zones: string[]) => IZone[];
}

export default class ToolbarWrapper extends Control<IToolbarWrapperOptions> {
    protected _template: TemplateFunction = template;
    protected _actions: IActionOptions[] = [];

    private _permissionsRequired(items: IActionOptions[]): boolean {
        return items.some((item) => {
            return !!item.permissions?.length;
        });
    }

    protected _getActionsByPermissions(
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
            const permissionsResolver = loadSync<IPermissionsResolver>(
                permissionsResolverModule
            );
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
                    permission = permissionsResolver
                        .get(item.permissions)
                        .some((zone) => {
                            return hasPermission(
                                zone,
                                item.requiredLevel,
                                item
                            );
                        });
                } else {
                    permission = permissionsResolver
                        .get(item.permissions)
                        .every((zone) => {
                            return hasPermission(
                                zone,
                                item.requiredLevel,
                                item
                            );
                        });
                }
                if (permission) {
                    filteredItems.push(item);
                }
            });
            return filteredItems;
        }
    }

    protected _getActions(
        actions: string | IActionOptions[]
    ): IActionOptions[] {
        if (typeof actions === 'string') {
            return loadSync(actions);
        }
        return actions || [];
    }

    protected _beforeMount(options?: IToolbarWrapperOptions): void {
        let actions = this._getActions(options.actions);
        if (this._permissionsRequired(actions)) {
            actions = this._getActionsByPermissions(
                actions,
                options.permissionsResolver
            );
        }
        this._actions = actions;
    }

    protected _beforeUpdate(options: IToolbarWrapperOptions): void {
        if (options.actions !== this._options.actions) {
            let actions = this._getActions(options.actions);
            if (this._permissionsRequired(actions)) {
                actions = this._getActionsByPermissions(
                    actions,
                    options.permissionsResolver
                );
            }
            this._actions = actions;
        }
    }

    static defaultProps: Partial<IToolbarWrapperOptions> = {
        storeId: 0,
        permissionsResolver: 'Permission/access:Permission',
    };
}
