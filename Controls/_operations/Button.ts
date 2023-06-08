/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import {
    IExpandableOptions,
    IExpandable,
    TIconSize,
    TStoreImport,
} from 'Controls/interface';
import { IViewMode } from 'Controls/buttons';
import ButtonTemplate = require('wml!Controls/_operations/Button/Button');
import { DependencyTimer, isLeftMouseButton } from 'Controls/popup';
import { IoC } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'css!Controls/operations';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface IOperationsButtonHeight {
    inlineHeight: 's' | 'm' | 'l' | 'operationsButton';
}

export interface IOperationsButtonOptions
    extends IControlOptions,
        IExpandableOptions {
    useStore?: boolean;
    inlineHeight?: IOperationsButtonHeight;
    iconSize?: TIconSize;
    viewMode?: IViewMode;
}

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

/**
 * Контрол-кнопка, использующийся для показа и скрытия панели действий {@link Controls/operations:Panel}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @class Controls/_operations/Button
 * @extends UI/Base:Control
 * @implements Controls/interface:IExpandable
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IHeight
 * @demo Controls-demo/OperationsPanelNew/PanelWithList/Default/Index
 * @public
 *
 */

/*
 * Control for changing the extensibility of the "Controls/_operations/Panel".
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/list/actions/operations/'>here</a>.
 *
 * @class Controls/_operations/Button
 * @extends UI/Base:Control
 * @implements Controls/interface:IExpandable
 *
 * @author Михайлов С.Е.
 * @public
 *
 */

export default class OperationsButton
    extends Control<IOperationsButtonOptions>
    implements IExpandable
{
    '[Controls/_toggle/interface/IExpandable]': true;
    // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
    protected _template: TemplateFunction = ButtonTemplate;
    protected _expanded: boolean = false;
    protected _expandedCallbackId: string;

    private _dependenciesTimer: DependencyTimer = null;
    private _loadOperationsPanelPromise: Promise<unknown> = null;

    protected _expandedChanged(value: boolean): void {
        if (this._expanded !== !!value) {
            this._expanded = !!value;
        }
    }
    protected _afterMount(options: IOperationsButtonOptions): void {
        if (options.useStore) {
            this._expandedCallbackId = getStore().onPropertyChanged(
                'operationsPanelExpanded',
                (expanded: boolean) => {
                    return this._expandedChanged(expanded);
                }
            );
        }
    }
    protected _beforeUnmount(): void {
        if (this._expandedCallbackId) {
            getStore().unsubscribe(this._expandedCallbackId);
        }
    }
    protected _handleMouseDown(event: SyntheticEvent<MouseEvent>): void {
        if (!isLeftMouseButton(event)) {
            return;
        }
        if (!this._options.readOnly) {
            this._notify('expandedChanged', [!this._options.expanded]);
            if (this._options.useStore) {
                getStore().dispatch('operationsPanelExpanded', !this._expanded);
            }
        }
    }
    protected _handleMouseEnter(): void {
        if (!this._options.readOnly) {
            if (!this._dependenciesTimer) {
                this._dependenciesTimer = new DependencyTimer();
            }
            this._dependenciesTimer.start(this._loadDependencies);
        }
    }
    protected _handleMouseLeave(): void {
        this._dependenciesTimer?.stop();
    }
    private _loadDependencies(): Promise<unknown> {
        try {
            if (!this._loadOperationsPanelPromise) {
                this._loadOperationsPanelPromise = Promise.all([
                    import('Controls/operationsPanel').then(
                        ({ OperationsPanel }) => {
                            return OperationsPanel.loadCSS();
                        }
                    ),
                    import('Controls/checkbox').then(({ Checkbox }) => {
                        return Checkbox.loadCSS();
                    }),
                ]);
            }
            return this._loadOperationsPanelPromise;
        } catch (e) {
            IoC.resolve('ILogger').error('_operations:Button', e);
        }
    }

    static getDefaultOptions(): object {
        return {
            iconSize: 'operationsButton',
            inlineHeight: 's',
            viewMode: 'link',
        };
    }
}

/**
 * @name Controls/_operations/Button#viewMode
 * @cfg {String} Режим отображения кнопки.
 * @variant outlined В виде обычной кнопки по-умолчанию.
 * @variant filled В виде обычной кнопки c заливкой.
 * @variant link В виде гиперссылки.
 * @variant ghost В виде кнопки для панели инструментов.
 * @default link
 * @demo Controls-demo/Buttons/ViewModes/Index
 * @example
 */
