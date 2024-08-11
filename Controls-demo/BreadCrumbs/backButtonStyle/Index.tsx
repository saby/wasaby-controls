import * as React from 'react';
import { Model } from 'Types/entity';
import { TInternalProps } from 'UICore/Executor';
import { HeadingPath } from '../../../Controls/breadcrumbs';

const data = [
    { id: 1, title: 'Первая папка', parent: null },
    { id: 2, title: 'Вторая папка', parent: 1 },
    { id: 3, title: 'Третья папка', parent: 2 },
].map((item) => {
    return new Model({
        rawData: item,
        keyProperty: 'id',
    });
});

export default React.forwardRef(function BackButtonFontColorStyle(
    _props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth1000 controls-background-contrast"
        >
            <HeadingPath
                keyProperty="id"
                items={data}
                backgroundStyle="contrast"
                backButtonStyle="default"
                backButtonFontColorStyle="primary"
                backButtonIconViewMode="functionalButton"
            />
        </div>
    );
});
