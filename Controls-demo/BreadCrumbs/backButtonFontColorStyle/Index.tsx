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

const buttonStyleTypes = ['primary', 'success', 'danger', 'link', 'unaccented', 'label'];

export default React.forwardRef(function BackButtonFontColorStyle(props, ref): JSX.Element {
    const [fontColorStyle, setFontColorStyle] = React.useState('primary');
    const handleChange = (e: Event) => {
        setFontColorStyle(e.target.value);
    };
    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth1000'}>
            <div>
                <HeadingPath
                    keyProperty="id"
                    items={data}
                    backButtonFontColorStyle={fontColorStyle}
                />
            </div>
            <div>
                <span>Choose Style: </span>
                <select value={fontColorStyle} onChange={handleChange}>
                    {buttonStyleTypes.map((item) => {
                        return <option value={item}>{item}</option>;
                    })}
                </select>
            </div>
        </div>
    );
});
