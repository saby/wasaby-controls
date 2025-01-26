import { ContinueSearchTemplate, IterativeLoadingTemplate } from 'Controls/baseList';
import * as React from 'react';

function Demo() {
    return (
        <div className="tw-flex tw-flex-col controlsDemo_fixedWidth400 controlsDemo__wrapper">
            <IterativeLoadingTemplate
                loadingIndicatorCaption="Остановить поиск"
                footerTemplate="Дополнительная информация при итеративном поиске"
            />
            <ContinueSearchTemplate
                continueSearchCaption="Возобновить поиск"
                footerTemplate="Дополнительная информация при итеративном поиске"
            />
        </div>
    );
}

export default React.forwardRef(Demo);
