import { useSlice } from 'Controls-DataEnv/context';
import { FIELD_LIST_SLICE } from 'FrameEditor/interfaces';

import { DataObjectFieldSelector } from './Selector';
import { NameEditorOld } from './NameEditorOld';

export function NameEditor(props) {
    const oldFieldsSlice = useSlice(FIELD_LIST_SLICE);

    if (oldFieldsSlice) {
        return <NameEditorOld {...props} />;
    }

    return <DataObjectFieldSelector {...props} />;
}
