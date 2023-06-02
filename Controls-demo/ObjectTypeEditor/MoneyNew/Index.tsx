import { Money } from 'Controls/input';
import { InputMoneyType } from 'Controls-meta/controls';
import { PropsDemoEditorPopup } from '../PropsDemoEditorPopup';

function TextInputPropsEditor() {
    return (
        <PropsDemoEditorPopup metaType={InputMoneyType} control={Money} />
    );
}

export default TextInputPropsEditor;
