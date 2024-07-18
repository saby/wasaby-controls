import * as React from 'react';
import { CollectionItemContext } from 'Controls/_baseList/CollectionItemContext';
import EditingComponent, {
    IEditingComponentProps,
} from 'Controls/_baseList/EditInPlace/EditingComponent';

function EditingComponentProvider(props: IEditingComponentProps) {
    const item = React.useContext(CollectionItemContext);
    return <EditingComponent {...props} item={item} />;
}

export default EditingComponentProvider;
