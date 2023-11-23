import { Text } from 'Controls/input';
import { NameType } from 'Controls-meta/controls';
import { PropsDemoEditorPopup } from '../PropsDemoEditorPopup';

function TextInputPropsEditor() {
    return <PropsDemoEditorPopup metaType={NameType} control={Text} />;
}

export default TextInputPropsEditor;
