import { Button } from 'Controls/buttons';
import { ButtonType } from 'Controls-meta/controls';
import { PropsDemoEditor } from '../PropsDemoEditor';

function ButtonPropsEditor() {
    return <PropsDemoEditor metaType={ButtonType} control={Button} />;
}

export default ButtonPropsEditor;
