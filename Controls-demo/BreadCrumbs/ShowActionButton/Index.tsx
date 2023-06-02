import * as React from 'react';
import { HeadingPath } from '../../../Controls/breadcrumbs';
import { Model } from 'Types/entity';

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

export default React.memo(function ShowActionButton(props): JSX.Element {
    const [showActionButton, setShowActionButton] =
        React.useState<boolean>(true);
    const [caption, setCaption] = React.useState<string>('Hide action button');
    const changeCaption = (isAble: boolean) => {
        if (isAble) {
            setCaption('Hide action button');
        } else {
            setCaption('Show action button');
        }
    };

    const changeActionButtonState = () => {
        setShowActionButton(!showActionButton);
        changeCaption(!showActionButton);
    };

    return (
        <div className={'controlsDemo__wrapper controlsDemo_fixedWidth1000'}>
            <span>Change action button visibility: </span>
            <button onClick={changeActionButtonState}>{caption}</button>
            <HeadingPath
                keyProperty="id"
                items={data}
                showActionButton={showActionButton}
            />
        </div>
    );
});
