import { Text } from 'Controls/input';
import { InputTextType } from 'Controls-meta/controls';
import { PropsDemoEditorPopup } from '../PropsDemoEditorPopup';

function TextInputPropsEditor() {
    return <PropsDemoEditorPopup metaType={InputTextType} control={Text} />;
}

export default TextInputPropsEditor;
