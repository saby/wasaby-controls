import { forwardRef} from 'react';
import { BaseEditorsTypeDefaults, BaseEditorsTypeOptional, BaseEditorsTypeRequired } from './meta';
import { PropsDemoEditorPopup } from '../PropsDemoEditorPopup';

function BaseEditorsPopup(_, ref) {
    return (
        <div ref={ref} className="ws-flexbox">
            <div>
                <h3>На всех атрибутах установленны дефолтные значения</h3>
                <PropsDemoEditorPopup metaType={BaseEditorsTypeDefaults} dataQA="Controls-demo_ObjectTypeEditor_BaseEditorsPopup__defaults"/>
            </div>
            <div>
                <h3>Без дефолтных значений</h3>
                <PropsDemoEditorPopup metaType={BaseEditorsTypeRequired} dataQA="Controls-demo_ObjectTypeEditor_BaseEditorsPopup__required"/>
            </div>
            <div>
                <h3>Все атрибуты опциональные</h3>
                <PropsDemoEditorPopup metaType={BaseEditorsTypeOptional} dataQA="Controls-demo_ObjectTypeEditor_BaseEditorsPopup__optional"/>
            </div>
        </div>
    );
}

export default forwardRef(BaseEditorsPopup);
