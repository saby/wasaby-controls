import {
    default as EditingComponent,
    IEditingComponentProps,
} from 'Controls/_baseList/EditInPlace/EditingComponent';
import * as React from 'react';
import { CollectionItemContext } from 'Controls/listsCommonLogic';

function EditingTemplate(props: IEditingComponentProps) {
    // Приоритетнее пробовать взять props.item, т.к. EditingTemplate может использоваться в старой схеме, где
    // прокидывается вся область видимости, но не создается отдельный контекст записи. Например, Controls/list:View
    // внутри рендера элемента Controls/grid:View.
    // Код станет неактуальным, когда все списки переедут на react.
    // Ошибка: https://online.sbis.ru/opendoc.html?guid=83e11a57-1c7f-415e-b782-864e72eeaf4c

    const itemFromContext = React.useContext(CollectionItemContext);
    const item = props.item || itemFromContext;

    // Замена проверки на item?.isReactView?(). Controls/grid переведен на react.
    // eslint-disable-next-line
    // @ts-ignore-next-line
    if (item && item['[Controls/_display/grid/Row]']) {
        return <EditingComponent {...props} item={item} />;
    }

    return <EditingComponent {...props} />;
}

export default EditingTemplate;
