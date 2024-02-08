import * as React from 'react';
import { SyntheticEvent } from 'UI/Events';
import { ISelectionObject } from 'Controls/interface';
import { ControllerClass as OperationsController } from 'Controls/operations';
import PanelContent, { IOperationsPanelWidgetOptions } from './PanelContent';
import { IActionOptions, IExecuteOptions } from 'Controls/actions';
import { object } from 'Types/util';
import { useSlice } from 'Controls-DataEnv/context';
import { Logger } from 'UI/Utils';
import { ListSlice } from 'Controls/dataFactory';

interface ICounterConfig {
    count: number;
    isAllSelected: boolean;
}

function getPanelExpanded(
    props: IOperationsPanelWidgetOptions,
    slice: ListSlice,
    operationsController: OperationsController
): boolean {
    return operationsController.getOperationsPanelVisible() || slice.state.operationsPanelVisible;
}

/**
 * Виджет "Панели действий". Реализует UI для массовых операций над списком.
 * В основе виджета лежит интерфейсный контрол {@link Controls/operations:Panel панель массовых операций}
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/new-operations/ руководство разработчика по панели действий}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/ руководство разработчика по действиям над записями}
 *
 * @class Controls-ListEnv/_operationsPanelConnected/Panel
 * @mixes Controls/interface:IStoreId
 *
 * @public
 *
 * @demo Controls-ListEnv-demo/OperationsPanel/View/Index
 */
function OperationsPanel(props: IOperationsPanelWidgetOptions, ref) {
    function listCommandCompatibleExecute(executeParams: IExecuteOptions): void {
        const actionClick = props.onActionClick;
        actionClick(executeParams.toolbarItem, executeParams.target, executeParams.selection);
    }

    function getActions(actions: IActionOptions[]): IActionOptions[] {
        const resultActions = object.clone(actions);
        return resultActions.map((action) => {
            if (!action.actionName && !action.onExecuteHandler) {
                action.onExecuteHandler = listCommandCompatibleExecute;
            }
            action.iconSize = 's';
            return action;
        });
    }

    function getActionsByProps(
        props: IOperationsPanelWidgetOptions,
        slice: ListSlice,
        operationsController: OperationsController
    ): IActionOptions[] {
        const actions =
            operationsController.getListActions() ||
            slice?.state?.listActions ||
            props.actions ||
            [];
        return getActions(actions);
    }

    const slice = useSlice<ListSlice>(props.storeId);

    const compatibleMode = React.useMemo(() => {
        if (!props.storeId || (props.storeId && slice['[ICompatibleSlice]'])) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
            return true;
        }
        return false;
    }, [props.storeId]);

    const operationsController = React.useRef(
        props.operationsController || slice?.state?.operationsController
    );
    const [actions, setActions] = React.useState(
        getActionsByProps(props, slice, operationsController.current)
    );
    const [panelExpanded, setPanelExpanded] = React.useState(
        getPanelExpanded(props, slice, operationsController.current)
    );
    const [counterConfig, setCounterConfig] = React.useState(
        operationsController.current.getCounterConfig()
    );
    const [selectedKeys, setSelectedKeys] = React.useState(
        operationsController.current.getSelection().selected
    );
    const [excludedKeys, setExcludedKeys] = React.useState(
        operationsController.current.getSelection().excluded
    );

    const { listActionsChanged, counterChanged } = React.useMemo(() => {
        return {
            listActionsChanged: (event, actions) => {
                setActions(getActions(actions));
            },
            counterChanged: (event, counter: ICounterConfig) => {
                setCounterConfig(counter);
            },
        };
    }, []);

    const { operationsPanelOpened, operationsPanelClose, selectionChanged } = React.useMemo(() => {
        return {
            operationsPanelOpened: () => {
                operationsController.current.setOperationsPanelVisible(true);
                if (!slice?.state.operationsPanelVisible) {
                    slice?.openOperationsPanel();
                }
            },
            operationsPanelClose: () => {
                operationsController.current.setOperationsPanelVisible(false);
                if (slice?.state.operationsPanelVisible) {
                    slice?.closeOperationsPanel();
                }
            },
            selectionChanged: (e: SyntheticEvent, selection: ISelectionObject) => {
                setSelectedKeys(selection.selected);
                setExcludedKeys(selection.excluded);
                if (
                    selection.selected.length > 0 &&
                    operationsController.current.getOperationsPanelVisible()
                ) {
                    slice?.openOperationsPanel();
                }
            },
        };
    }, [props.operationsController, slice]);

    const { expandedChanged, selectedTypeChanged } = React.useMemo(() => {
        return {
            expandedChanged: (e: SyntheticEvent, expanded: boolean) => {
                if (expanded !== operationsController.current.getOperationsPanelVisible()) {
                    operationsController.current.setOperationsPanelVisible(expanded);
                }
                if (expanded) {
                    slice?.openOperationsPanel();
                } else {
                    slice?.closeOperationsPanel();
                }
                setPanelExpanded(expanded);
            },
            selectedTypeChanged: (selectedType: string) => {
                if (operationsController.current) {
                    operationsController.current.selectionTypeChanged(
                        selectedType,
                        null,
                        props.storeId
                    );
                }
                if (selectedType === 'all' || selectedType === 'selected') {
                    slice?.setSelectionViewMode(selectedType);
                }
                slice?.executeCommand(selectedType);
            },
        };
    }, [props.operationsController, slice, props.storeId]);
    const sliceActions = slice?.state?.listActions;

    React.useEffect(() => {
        function subscribeToOperationsControllerEvents(controller: OperationsController): void {
            controller.subscribe('selectionChanged', selectionChanged);
            controller.subscribe('counterChanged', counterChanged);
            controller.subscribe('operationsPanelVisibleChanged', expandedChanged);
            controller.subscribe('operationsPanelOpened', operationsPanelOpened);
            controller.subscribe('operationsPanelClose', operationsPanelClose);
            controller.subscribe('listActionsChanged', listActionsChanged);
        }

        function unsubscribeFromOperationsControllerEvents(controller: OperationsController): void {
            controller.unsubscribe('selectionChanged', selectionChanged);
            controller.unsubscribe('counterChanged', counterChanged);
            controller.unsubscribe('operationsPanelVisibleChanged', expandedChanged);
            controller.unsubscribe('operationsPanelOpened', operationsPanelOpened);
            controller.unsubscribe('operationsPanelClose', operationsPanelClose);
            controller.unsubscribe('listActionsChanged', listActionsChanged);
        }

        operationsController.current = props.operationsController || slice?.operationsController;
        subscribeToOperationsControllerEvents(operationsController.current);

        setCounterConfig(operationsController.current.getCounterConfig());
        setPanelExpanded(getPanelExpanded(props, slice, operationsController.current));

        return () => {
            unsubscribeFromOperationsControllerEvents(operationsController.current);
        };
    }, [slice?.state?.operationsPanelVisible, props.operationsController]);

    React.useEffect(() => {
        setActions(getActionsByProps(props, slice, operationsController.current));
    }, [props.operationsController, sliceActions, props.actions]);

    if (panelExpanded) {
        return (
            <PanelContent
                ref={ref}
                attrs={...props.attrs}
                onSelectedTypeChanged={selectedTypeChanged}
                onExpandedChanged={expandedChanged}
                excludedKeys={compatibleMode ? excludedKeys : slice.excludedKeys}
                selectedKeys={compatibleMode ? selectedKeys : slice.selectedKeys}
                selectedKeysCount={compatibleMode ? counterConfig?.count : slice.count}
                listCommandsSelection={
                    compatibleMode ? props.listCommandsSelection : slice.state.listCommandsSelection
                }
                showSelectedCount={
                    compatibleMode ? props.showSelectedCount : slice?.state.showSelectedCount
                }
                isAllSelected={compatibleMode ? counterConfig?.isAllSelected : slice.isAllSelected}
                countLoading={slice?.countLoading}
                multiSelectSize={props.multiSelectSize}
                selectionViewMode={
                    props.storeId ? slice.selectionViewMode : props.selectionViewMode
                }
                selectedCountConfig={compatibleMode ? props.selectedCountConfig : undefined}
                contrastBackground={props.contrastBackground}
                closeButtonVisible={props.closeButtonVisible}
                rightTemplate={props.rightTemplate}
                storeId={props.storeId}
                operationsController={operationsController.current}
                actions={actions}
                fontColorStyle={props.fontColorStyle}
                iconStyle={props.iconStyle}
                iconSize={props.iconSize}
                menuBackgroundStyle={props.menuBackgroundStyle}
            />
        );
    } else {
        return <div ref={ref}></div>;
    }
}

export default React.forwardRef<HTMLDivElement, IOperationsPanelWidgetOptions>(OperationsPanel);
/**
 * @name Controls-ListEnv/operationsPanelConnected:View#contrastBackground
 * @cfg {Boolean} Определяет контрастность контрола по отношению к его окружению.
 * @demo Controls-demo/OperationsPanelNew/PanelWithList/ContrastBackground/Index
 * @default false
 */

/**
 * @name Controls-ListEnv/operationsPanelConnected:View#closeButtonVisible
 * @cfg {Boolean} Определяет отображение кнопки закрытия.
 * @default true
 */

/**
 * @name Controls-ListEnv/operationsPanelConnected:View#rightTemplate
 * @cfg {String|TemplateFunction} Шаблон, отображаемый в правой части панели массового выбора.
 * @demo Controls-demo/OperationsPanelNew/RightTemplate/Index
 * @example
 * <pre class="brush: html">
 * <Controls-ListEnv.operationsPanelConnected:View>
 *     <ws:rightTemplate>
 *         <Controls.buttons:Button
 *             caption="Доп. операции"
 *             on:click="_onClickAddBlock()"
 *             iconSize="s"
 *             icon="icon-Settings"
 *             viewMode="link"
 *             fontColorStyle="link"
 *     </ws:rightTemplate>
 * </Controls-ListEnv.operationsPanelConnected:View>
 * </pre>
 */
