import {
    default as EditingComponent,
    IEditingComponentProps,
} from 'Controls/_baseList/EditInPlace/EditingComponent';
import * as React from 'react';
import { CollectionItemContext } from 'Controls/_baseList/CollectionItemContext';

function EditingTemplate(props: IEditingComponentProps) {
    // Приоритетнее пробовать взять props.item, т.к. EditingTemplate может использоваться в старой схеме, где
    // прокидывается вся область видимости, но не создается отдельный контекст записи. Например, Controls/list:View
    // внутри рендера элемента Controls/grid:View.
    // Код станет неактуальным, когда все списки переедут на react.
    // Ошибка: https://online.sbis.ru/opendoc.html?guid=83e11a57-1c7f-415e-b782-864e72eeaf4c

    const item = props.item || React.useContext(CollectionItemContext);

    if (item?.isReactView?.()) {
        return <EditingComponent {...props} item={item} />;
    }

    return <EditingComponent {...props} />;
}

export default EditingTemplate;
