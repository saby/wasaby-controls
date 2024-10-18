import * as React from 'react';
import { HeadingPath } from '../../../Controls/breadcrumbs';
import { Model } from 'Types/entity';
import { SyntheticEvent } from '../../../application/UICommon/Events';

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

export default React.forwardRef(function ArrowActivated(props, ref) {
    const [clickCount, setClickCount] = React.useState<number>(0);
    const handleArrowActivated = (e: SyntheticEvent) => {
        setClickCount(clickCount + 1);
    };
    return (
        <div ref={ref}>
            <div className={'controls-text-primary'}>Click on the arrow button</div>
            <div>
                You clicked <span className={'controls-text-primary'}>{clickCount} </span>
                times
            </div>
            <HeadingPath
                keyProperty={'id'}
                items={data}
                customEvents={['onArrowClick']}
                onArrowClick={handleArrowActivated}
            />
        </div>
    );
});
