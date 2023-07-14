import { Phone } from 'Controls/input';
import { InputPhoneType } from 'Controls-meta/controls';
import { PropsDemoEditorPopup } from '../PropsDemoEditorPopup';

function TextInputPropsEditor() {
    return <PropsDemoEditorPopup metaType={InputPhoneType} control={Phone} />;
}

export default TextInputPropsEditor;
