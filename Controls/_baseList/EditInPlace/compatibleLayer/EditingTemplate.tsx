import {
    default as EditingComponent,
    IEditingComponentProps,
} from 'Controls/_baseList/EditInPlace/EditingComponent';
import * as React from 'react';
import { CollectionItemContext } from 'Controls/_baseList/CollectionItemContext';

function EditingTemplate(props: IEditingComponentProps) {
    const item = React.useContext(CollectionItemContext);
    if (item?.isReactView?.()) {
        return <EditingComponent {...props} item={item} />;
    }
    return <EditingComponent {...props} />;
}

export default EditingTemplate;
