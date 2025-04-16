import * as React from 'react';
import { Button } from 'Controls/dropdown';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import { Title } from 'Controls/heading';

const source = new SearchMemory({
    data: [
        {
            key: '1',
            title: 'Доверенность на обработку заказов',
        },
        {
            key: '2',
            title: 'Право подписи',
        },
        {
            key: '3',
            title: 'Сдача отчетности',
        },
        {
            key: '4',
            title: 'Доверенность на сдачу отчетности',
        },
    ],
    keyProperty: 'key',
});

export default React.forwardRef(function DropdownMenuModeSelectorIconsDemo(props, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    keyProperty="key"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    source={source}
                    menuPopupComponent="Controls/selectorSticky:Template"
                    headerTemplate={HeaderTpl}
                    menuHeaderBackgroundStyle="unaccented"
                    icon="icon-AddButtonNew"
                    menuHeadingCaption="Сменить регламент"
                    searchParam="title"
                />
            </div>
        </div>
    );
});

function HeaderTpl(props) {
    return (
        <div className="tw-flex tw-flex-col">
            <Title
                caption="Доверенность на сдачу отчетности"
                fontSize="3xl"
                fontWeight="bold"
                readOnly={true}
            />
            <span className="controls-text-label controls-fontsize-xs controls-margin_top-xs">
                Документ, на основании которого представитель вправе сдавать отчетность от имени
                доверителя.
            </span>
        </div>
    );
}
