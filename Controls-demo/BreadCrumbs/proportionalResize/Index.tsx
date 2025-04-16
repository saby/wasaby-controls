import * as React from 'react';
import { HeadingPath } from '../../../Controls/breadcrumbs';
import { Model } from 'Types/entity';

export default React.forwardRef(function BackButtonFontColorStyle(props, ref): JSX.Element {
    const data = [
        {
            id: 1,
            title: 'Record3',
            parent: null,
        },
        {
            id: 2,
            title: 'Record2',
            parent: 1,
        },
        {
            id: 3,
            title: 'Самая длинная запись на диком западе и за его пределами, а точнее по всему миру и в океане',
            parent: 2,
        },
        {
            id: 4,
            title: 'Назад',
            parent: 3,
        },
    ].map((item) => {
        return new Model({
            rawData: item,
            keyProperty: 'id',
        });
    });
    return (
        <div
            ref={ref}
            className={'controlsDemo__wrapper controlsDemo_fixedWidth1000'}
            style={{
                border: '2px solid black',
            }}
        >
            <div>
                <HeadingPath keyProperty="id" items={data} parentProperty={'parent'} />
            </div>
        </div>
    );
});
