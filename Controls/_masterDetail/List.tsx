import { cloneElement, ForwardedRef, forwardRef, useRef, ReactElement } from 'react';
import { __notifyFromReact } from 'UI/Events';

const CUSTOM_EVENTS = ['onMarkedKeyChanged'];

interface IListProps {
    onSelectedMasterValueChanged?: (key: string) => void;
    children: JSX.Element;
}

/**
 * Контрол используют в качестве контейнера для списочного контрола, который добавлен в шаблон {@link Controls/masterDetail:Base#master master}.
 * Он обеспечивает передачу текущей отмеченной записи в списке между списком и master'ом через всплывающее событие selectedMasterValueChanged.
 * @public
 * @class Controls/_masterDetail/List
 * @demo Controls-demo/MasterDetail/Demo
 */
function List(props: IListProps, ref: ForwardedRef<HTMLDivElement>): ReactElement {
    const localRef = useRef(null);
    const setRefs = (element) => {
        localRef.current = element;
        if (ref) {
            ref(element);
        }
    };

    const mergedMarkedKeyChangedHandler = (key) => {
        if (localRef?.current) {
            __notifyFromReact(localRef.current, 'selectedMasterValueChanged', [key], true);
        }
    };

    return cloneElement(props.children, {
        ...props,
        onMarkedKeyChanged: mergedMarkedKeyChangedHandler,
        customEvents: CUSTOM_EVENTS,
        forwardedRef: setRefs,
    });
}

List.displayName = 'MasterDetail:List';

export default forwardRef(List);
/**
 * @name Controls/_masterDetail/List#markedKey
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Types/source:ICrud#CrudEntityKey} Ключ выбранного элемента в мастере
 */

/**
 * @name Controls/_masterDetail/List#selectedMasterValueChanged
 * @event Происходит при смене выбранной записи.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} key Ключ выбранного элемента.
 */
