import * as React from 'react';
import { Model } from 'Types/entity';
import { Path } from '../../../Controls/breadcrumbs';
import { SyntheticEvent } from '../../../application/UICommon/Events';
import Record from '../../../application/Types/_entity/Record';

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

export default React.forwardRef(function ItemClick(props, ref) {
    const [curItemTitle, setCurItemTitle] = React.useState<string>('');
    const handleItemClick = (e: SyntheticEvent, item: Record) => {
        setCurItemTitle(item.get('title'));
    };
    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth1000'}>
            <div className={'controls-text-primary'}>Click on any item</div>
            <div>
                You clicked on item with title:
                <span className={'controls-text-primary'}>{curItemTitle}</span>
            </div>
            <Path
                keyProperty={'id'}
                items={data}
                customEvents={['onItemClick']}
                onItemClick={handleItemClick}
            ></Path>
        </div>
    );
});
