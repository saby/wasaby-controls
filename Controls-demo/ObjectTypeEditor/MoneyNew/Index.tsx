import { MoneyNew } from 'Controls/input';
import { InputMoneyType } from 'Controls-meta/controls';
import { PropsDemoEditorPopup } from '../PropsDemoEditorPopup';

function TextInputPropsEditor() {
    return (
        <PropsDemoEditorPopup metaType={InputMoneyType} control={MoneyNew} />
    );
}

export default TextInputPropsEditor;
