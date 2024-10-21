import { forwardRef, LegacyRef } from 'react';
import { Title } from 'Controls/heading';
import {
    BaseEditorsTypeDefaults,
    BaseEditorsTypeOptional,
    BaseEditorsTypeRequired,
} from './resources/meta';
import { PropsDemoEditorPopup } from './resources/PropsDemoEditor';

export default forwardRef(function Index(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="ws-flexbox controls-margin-m">
            <div className="controls-margin_right-l">
                <Title
                    caption="Установлены дефолтные значения"
                    className="controls-margin_bottom-m"
                />
                <PropsDemoEditorPopup
                    metaType={BaseEditorsTypeDefaults}
                    dataQA="Controls-demo_ObjectTypeEditor_BaseEditorsPopup__defaults"
                />
            </div>
            <div className="controls-margin_right-l">
                <Title caption="Без дефолтных значений" className="controls-margin_bottom-m" />
                <PropsDemoEditorPopup
                    metaType={BaseEditorsTypeRequired}
                    dataQA="Controls-demo_ObjectTypeEditor_BaseEditorsPopup__required"
                />
            </div>
            <div>
                <Title caption="Все атрибуты опциональные" className="controls-margin_bottom-m" />
                <PropsDemoEditorPopup
                    metaType={BaseEditorsTypeOptional}
                    dataQA="Controls-demo_ObjectTypeEditor_BaseEditorsPopup__optional"
                />
            </div>
        </div>
    );
});
