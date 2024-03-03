import { Checkbox } from 'Controls/checkbox';
import { CheckboxType } from 'Controls-meta/controls';
import { PropsDemoEditor } from '../PropsDemoEditor';

function CheckboxPropsEditor() {
    return <PropsDemoEditor metaType={CheckboxType} control={Checkbox} />;
}

export default CheckboxPropsEditor;
