import { forwardRef } from 'react';
import { StickyTemplate } from 'Controls/filterPanelPopup';
import { Text } from 'Controls/input';

export default forwardRef(function FilterPanelStickyTemplateDemo(_, ref) {
    return (
        <div className="controlsDemo__wrapper">
            <StickyTemplate
                width="b"
                orientation="horizontal"
                headerContentTemplate={HeaderContentTemplate}
                bodyContentTemplate={BodyContentTemplate}
            />
        </div>
    );
});

function HeaderContentTemplate() {
    return <Text />;
}

function BodyContentTemplate() {
    return (
        <div className="ws-flexbox ws-justify-content-center controls-margin_top-m controls-margin_bottom-m controls-margin_left-m  controls-margin_right-m">
            Прикладной шаблон окна фильтров
        </div>
    );
}
