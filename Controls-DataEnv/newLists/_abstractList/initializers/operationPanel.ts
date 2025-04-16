import type { Initializer } from '../Initializer';
import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IOperationsPanelState } from '../interface/IAbstractListStateParts';
import type { IAbstractListState } from 'Controls-DataEnv/abstractList';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

export default function initState(
    initializer: Initializer,
    _: IAbstractListDataFactoryLoadResult,
    { operationsPanelVisible, operationsController }: IAbstractListDataFactoryArguments
): IOperationsPanelState {
    return {
        // Значение счетчика не может быть undefined
        // TLDR
        // Если счетчик undefined - пмо попытается рассчитать количество выбранных элементов само и может сделать это неправильно.
        // Если будет число, тогда пмо установит его как есть

        // --- проблемный кейс, когда  счетчик инициализируется undefined ---
        // При выборе "выбрать все" через чекбокс в пмо сначала покажется 1, затем загруженное с бл значение.
        // Суть: По команде 'selectAll' BaseControl расчитает новые ключи selectedKeys: [root] и отправит их в слайс
        // Сначала в слайс отправятся через setState selectedKeys, а затем новый count.
        // Сначала selectedKeys установятся в слайс и вызовут ререндер пмо, где он из-за undefined попытается расчитать значение сам. Т.к. selected это [root], значение получится 1.
        // А затем выполнится установка нового count с загрузкой значения из бл. Будет второй рендер, где пмо увидит число и установит уже его.
        // На сбросе выделения установится 0 и данная проблема больше не появится, потому что с числом ответственность за изменения счетчика на слайсе.
        count: 0,
        operationsPanelVisible: needOpenOperationsPanel({
            operationsPanelVisible,
            selectedKeys: initializer.getSelectionState().selectedKeys,
            listActions: initializer.getActionsState().listActions,
        }),
        operationsController: operationsController || createController(initializer),
        isAllSelected: false,
    };
}

const createController = (initializer: Initializer) => {
    if (!isLoaded('Controls/operations')) {
        return;
    }

    const { selectedKeys, excludedKeys } = initializer.getSelectionState();
    const { root } = initializer.getHierarchyState();
    const { ControllerClass } =
        loadSync<typeof import('Controls/operations')>('Controls/operations');

    return new ControllerClass({
        selectedKeys,
        excludedKeys,
        root,
    });
};

export function needOpenOperationsPanel({
    listActions,
    selectedKeys,
    operationsPanelVisible,
}: Pick<
    IAbstractListState | IAbstractListDataFactoryArguments,
    'listActions' | 'selectedKeys' | 'operationsPanelVisible'
>): boolean {
    return !!operationsPanelVisible || !!(listActions && selectedKeys && selectedKeys.length);
}
