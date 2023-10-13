import { Button } from 'Controls/buttons';
import { ButtonType } from 'Controls-meta/controls';
import { PropsDemoEditorPopup } from '../PropsDemoEditorPopup';

function ButtonPropsEditorPopup() {
    return <PropsDemoEditorPopup metaType={ButtonType} control={Button} />;
}

export default ButtonPropsEditorPopup;
