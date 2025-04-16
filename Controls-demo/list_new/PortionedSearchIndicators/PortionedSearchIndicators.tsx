import { ContinueSearchTemplate, IterativeLoadingTemplate } from 'Controls/baseList';
import * as React from 'react';

function Demo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div
            ref={ref}
            className="tw-flex tw-flex-col controlsDemo_fixedWidth400 controlsDemo__wrapper"
            data-qa={'controlsDemo_capture'}
        >
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
