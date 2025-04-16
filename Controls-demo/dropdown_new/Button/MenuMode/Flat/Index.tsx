import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { Memory } from 'Types/source';
import { companies } from 'Controls-demo/dropdown_new/Data';
import { HeaderTemplate as SelectorHeaderTemplate } from 'Controls/selectorSticky';

const source = new Memory({
    data: companies.getRawData(),
    keyProperty: 'key',
});

export default React.forwardRef(function DropdownDemo(props, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    keyProperty="key"
                    displayProperty="title"
                    source={source}
                    searchParam="title"
                    menuPopupComponent="Controls/selectorSticky:Template"
                    headerContentTemplate={HeaderContentTpl}
                    icon="icon-AddButtonNew"
                />
            </div>
            <div className="controlsDemo__ml2">
                <Button
                    keyProperty="key"
                    displayProperty="title"
                    source={source}
                    searchParam="title"
                    menuPopupComponent="Controls/selectorSticky:Template"
                    menuHeadingCaption="Выберите"
                    icon="icon-AddButtonNew"
                />
            </div>
        </div>
    );
});

function HeaderContentTpl(props) {
    return (
        <SelectorHeaderTemplate
            {...props}
            rightTemplate={() => (
                <div className="tw-cursor-pointer icon-UnloadNew controls-icon controls-icon_size-m controls-icon_style-secondary controls-margin_left-xs"></div>
            )}
        />
    );
}
