import { dataObjectFeatureEnabled } from 'Frame-DataEnv/dataFactory';
import { DataObjectFieldSelector } from './Selector';
import { NameEditorOld } from './NameEditorOld';

export function NameEditor(props) {
    if (dataObjectFeatureEnabled()) {
        return <DataObjectFieldSelector {...props} />;
    }

    return <NameEditorOld {...props} />;
}
