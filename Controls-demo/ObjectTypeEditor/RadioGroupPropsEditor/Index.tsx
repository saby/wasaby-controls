import { Control as RadioGroup } from 'Controls/RadioGroup';
import { RadioGroupType } from 'Controls-meta/controls';
import { PropsDemoEditor } from '../PropsDemoEditor';

function RadioGroupPropsEditor() {
    return <PropsDemoEditor metaType={RadioGroupType} control={RadioGroup} />;
}

export default RadioGroupPropsEditor;
