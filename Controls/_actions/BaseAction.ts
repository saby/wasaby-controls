/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { showType } from 'Controls/toolbars';
import { mixin, object } from 'Types/util';
import { RecordSet } from 'Types/collection';
import { EventRaisingMixin, ObservableMixin, Model } from 'Types/entity';
import { merge } from 'Types/object';
import { IAction, IActionState, IActionExecuteParams } from './interface/IAction';
import { IActionOptions } from 'Controls/_actions/interface/IActionOptions';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { Query } from 'Types/source';
import { IMenuControlOptions } from 'Controls/menu';
import { TKey, IFontColorStyle } from 'Controls/interface';

/**
 * Класс базового экшена.
 * @class Controls/_actions/BaseAction
 * @implements Controls/_actions/interface/IAction
 * @public
 */

const TOOLBAR_PROPS = [
    'icon',
    'menuIcon',
    'iconStyle',
    'menuIconStyle',
    'title',
    'tooltip',
    'visible',
    'viewMode',
    'parent',
    'parent@',
    'showType',
    'template',
    'order',
    'iconSize',
    'readOnly',
    'handler',
    'buttonStyle',
    'caption',
    'inlineHeight',
    'contrastBackground',
    'additional',
    'group',
    'templateOptions',
    'hintText',
    'hintBackgroundStyle',
    'hintBorderStyle',
    'inlineHeight',
    'reloadOnOpen',
    'fontColorStyle',
    'subMenuTemplate',
    'subMenuTemplateOptions',
];

export default abstract class BaseAction<
        T extends IActionOptions = IActionOptions,
        V extends IActionExecuteParams = IActionExecuteParams,
    >
    extends mixin<ObservableMixin>(ObservableMixin)
    implements IAction<T>
{
    protected _options: T = null;
    private _iconSize: string;
    readonly id: string;
    readonly order: number;
    readonly template: string | Function;
    readonly templateOptions: object;
    readonly parent: string | number;
    readonly showType: showType;
    readonly additional: boolean;
    readonly group: string;
    readonly reloadOnOpen: boolean;
    'parent@': boolean;
    readonly onExecuteHandler: Function;
    readonly handler: Function;
    commandName: string;
    fontColorStyle: IFontColorStyle;
    commandOptions: Record<string, any>;
    viewCommandName: string;
    viewCommandOptions: Record<string, any>;
    inlineHeight: string;
    private _iconStyle: string;
    private _menuIconStyle: string;
    private _viewMode: string;
    private _buttonStyle: string;
    private _icon: string;
    private _menuIcon: string;
    private _title: string;
    private _tooltip: string;
    private _visible: boolean;
    private _readOnly: boolean;
    private _hintText: string;
    private _caption: string;
    private _subMenuTemplateOptions: object;

    get icon(): string {
        return this._icon;
    }

    protected set icon(value: string) {
        this._setProperty('_icon', value);
    }

    protected set menuIcon(value: string) {
        this._setProperty('_menuIcon', value);
    }

    get menuIcon(): string {
        return this._menuIcon;
    }

    protected set menuIconStyle(value: string) {
        this._setProperty('_menuIconStyle', value);
    }

    get menuIconStyle(): string {
        return this._menuIconStyle;
    }

    get title(): string {
        return this._title;
    }

    protected set title(value: string) {
        this._setProperty('_title', value);
    }

    get caption(): string {
        return this._caption;
    }

    protected set caption(value: string) {
        this._setProperty('_caption', value);
    }

    get iconSize(): string {
        return this._iconSize;
    }

    protected set iconSize(value: string) {
        this._setProperty('_iconSize', value);
    }

    get tooltip(): string {
        return this._tooltip;
    }

    protected set tooltip(value: string) {
        this._setProperty('_tooltip', value);
    }

    get visible(): boolean {
        return this._visible;
    }

    protected set visible(value: boolean) {
        this._setProperty('_visible', value);
    }

    get iconStyle(): string {
        return this._iconStyle;
    }

    protected set iconStyle(value: string) {
        this._setProperty('_iconStyle', value);
    }

    get hintText(): string {
        return this._hintText;
    }

    protected set hintText(value: string) {
        this._setProperty('_hintText', value);
    }

    get viewMode(): string {
        return this._viewMode;
    }

    protected set viewMode(value: string) {
        this._setProperty('_viewMode', value);
    }

    get buttonStyle(): string {
        return this._buttonStyle;
    }

    protected set buttonStyle(value: string) {
        this._setProperty('_buttonStyle', value);
    }

    get readOnly(): boolean {
        return this._readOnly;
    }

    protected set readOnly(value: boolean) {
        this._setProperty('_readOnly', value);
    }

    get subMenuTemplateOptions(): object {
        return this._subMenuTemplateOptions;
    }

    protected set subMenuTemplateOptions(value: boolean) {
        this._setProperty('_subMenuTemplateOptions', value);
    }

    constructor(options: T) {
        super();
        this._options = options;
        this.icon = options.icon || this.icon;
        this.title = options.title || this.title;
        this.tooltip = options.tooltip || this.tooltip || this.title;
        this.visible = options.hasOwnProperty('visible')
            ? (options.visible as boolean)
            : this.visible;
        this.iconStyle = options.iconStyle || this.iconStyle;
        this.viewMode = options.viewMode || this.viewMode;
        this.buttonStyle = options.buttonStyle || this.buttonStyle;
        this.order = options.order || this.order;
        this.onExecuteHandler = options.onExecuteHandler;
        this.handler = options.handler;
        this.commandName = options.commandName || this.commandName;
        this.commandOptions = options.commandOptions || this.commandOptions;
        this.viewCommandName = options.viewCommandName || this.viewCommandName;
        this.viewCommandOptions = options.viewCommandOptions || this.viewCommandOptions;
        this.caption = options.caption || this.caption;
        this.inlineHeight = options.inlineHeight || this.inlineHeight;
        this.template = options.template;
        this.templateOptions = options.templateOptions;
        this.subMenuTemplate = options.subMenuTemplate || this.subMenuTemplate;
        this.subMenuTemplateOptions = options.subMenuTemplateOptions || this.subMenuTemplateOptions;
        this.showType = options.hasOwnProperty('showType') ? options.showType : this.showType;
        this.readOnly = options.hasOwnProperty('readOnly') ? options.readOnly : this.readOnly;
        this.additional = options.hasOwnProperty('additional')
            ? options.additional
            : this.additional;
        this.group = options.hasOwnProperty('group') ? options.group : this.group;
        this.parent = options.parent || this.parent;
        this.id = options.id || this.id;
        this['parent@'] = options['parent@'] || this['parent@'];
        this._iconSize = options.iconSize || 'm';
        this.reloadOnOpen = options.reloadOnOpen;
        this.fontColorStyle = options.fontColorStyle;

        EventRaisingMixin.initMixin(this);
    }

    execute(options: V): Promise<unknown> | void {
        return this._executeCommand(options);
    }

    updateContext(newContext: T['context']): void {
        // for override;
    }

    setContext(newContext: T['context']): void {
        this._options.context = newContext;
    }

    canExecute(item: Model): boolean {
        return true;
    }

    isAllowEmptySelection(): boolean {
        return !!this._options.allowEmptySelection;
    }

    getChildren(root: number | string, query?: Query): Promise<RecordSet> {
        const menuOptions = this.getMenuOptions();
        if (menuOptions.historyId) {
            query.getWhere().$_history = true;
        }
        if (menuOptions.source) {
            return new SourceController({
                keyProperty: menuOptions.keyProperty || menuOptions.source.getKeyProperty(),
                source: menuOptions.source,
            }).load('down', root, query.getWhere());
        }
        return null;
    }

    getToolbarItem(): IActionState {
        return this.getState();
    }

    getMenuItem(): IActionState {
        return this.getState();
    }

    getValue(): TKey[] {
        return undefined;
    }

    private _executeCommand(options: T): Promise<unknown> | void {
        if (this.commandName) {
            const commandOptions = this._getCommandOptions(options);
            return this._createCommand(commandOptions, this.commandName).then((commandClass) => {
                if (this.viewCommandName) {
                    return this._createCommand(
                        {
                            ...commandOptions,
                            command: commandClass,
                            sourceController: options.sourceController,
                            ...this.viewCommandOptions,
                        },
                        this.viewCommandName
                    ).then((viewCommandClass) => {
                        return this._actionExecute(commandOptions, viewCommandClass);
                    });
                } else {
                    return this._actionExecute(commandOptions, commandClass);
                }
            });
        } else if (this.onExecuteHandler) {
            if (typeof this.onExecuteHandler === 'string') {
                return loadAsync(this.onExecuteHandler).then((handler: Function) => {
                    handler(this._getCommandOptions(options));
                });
            } else {
                return this.onExecuteHandler(this._getCommandOptions(options));
            }
        }
    }

    private _getCommandOptions(commandParams: V): object {
        const commandOptions = object.clone(this.commandOptions) || {};
        merge(commandOptions, {
            source: commandParams.sourceController?.getSource(),
            filter: commandParams.sourceController?.getFilter(),
            keyProperty: commandParams.sourceController?.getKeyProperty(),
            parentProperty: commandParams.sourceController?.getParentProperty(),
            nodeProperty: commandParams.nodeProperty,
            navigation: commandParams.navigation,
            selection: commandParams.selection,
            sourceController: commandParams.sourceController,
            operationsController: commandParams.operationsController,
            selectedKeysCount: commandParams.selectedKeysCount,
            target: commandParams.target,
            event: commandParams.event,
            toolbarItem: commandParams.toolbarItem,
            toolbarSelectedKeys: commandParams.toolbarSelectedKeys,
            opener: commandParams.opener,
            storeId: commandParams.storeId,
            ...this._options,
        });
        return commandOptions;
    }

    private _createCommand(commandOptions: V, commandName: string): Promise<IAction> {
        return loadAsync(commandName).then((command) => {
            return new command(commandOptions);
        });
    }

    protected _actionExecute(commandOptions: V, command: IAction<T>): Promise<unknown> | void {
        return command.execute(commandOptions);
    }

    getMenuOptions(): Partial<IMenuControlOptions> {
        return {};
    }

    getState(): IActionState {
        const config: IActionState = { id: this.id };
        const menuOptions = { ...this.getMenuOptions() };
        TOOLBAR_PROPS.forEach((prop) => {
            config[prop] = this[prop];
        });
        const value = this.getValue();
        if (value !== undefined) {
            menuOptions.selectedKeys = value instanceof Array ? value : [value];
            menuOptions.markerVisibility = 'visible';
        }
        if (menuOptions.historyId) {
            menuOptions.allowPin = true;
            menuOptions.keyProperty = 'copyOriginalId';
            menuOptions.historyRoot = this.id;
        }
        config.menuOptions = menuOptions;
        return config;
    }

    destroy(): void {
        // for override;
    }

    private _setProperty(prop: string, value: unknown): void {
        if (this[prop] !== value) {
            this[prop] = value;
            this._notify('itemChanged', this.getState());
        }
    }
}

Object.assign(BaseAction.prototype, {
    visible: true,
    'parent@': false,
    showType: showType.MENU_TOOLBAR,
    readOnly: false,
    parent: null,
});
