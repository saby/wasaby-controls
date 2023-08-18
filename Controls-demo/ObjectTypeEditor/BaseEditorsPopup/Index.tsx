import { BaseEditorsTypeDefaults, BaseEditorsTypeOptional, BaseEditorsTypeRequired } from './meta';
import { PropsDemoEditorPopup } from '../PropsDemoEditorPopup';

function BaseEditorsPopup() {
    return (
        <div className="ws-flexbox">
            <div>
                <h3>На всех атрибутах установленны дефолтные значения</h3>
                <PropsDemoEditorPopup metaType={BaseEditorsTypeDefaults} />
            </div>
            <div>
                <h3>Без дефолтных значений</h3>
                <PropsDemoEditorPopup metaType={BaseEditorsTypeRequired} />
            </div>
            <div>
                <h3>Все атрибуты опциональные</h3>
                <PropsDemoEditorPopup metaType={BaseEditorsTypeOptional} />
            </div>
        </div>
    );
}

export default BaseEditorsPopup;
