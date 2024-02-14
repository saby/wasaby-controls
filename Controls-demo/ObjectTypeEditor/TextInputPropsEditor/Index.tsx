import { Text } from 'Controls/input';
import { InputTextType } from 'Controls-meta/controls';
import { PropsDemoEditor } from '../PropsDemoEditor';

function TextInputPropsEditor() {
    return <PropsDemoEditor metaType={InputTextType} control={Text} />;
}

export default TextInputPropsEditor;
