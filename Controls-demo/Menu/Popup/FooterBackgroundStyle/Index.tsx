import { forwardRef } from 'react';
import { Popup as MenuPopup } from 'Controls/menu';
import { Memory } from 'Types/source';

const source = new Memory({
    keyProperty: 'key',
    data: [
        { key: 1, title: 'Ярославль' },
        { key: 2, title: 'Москва' },
        { key: 3, title: 'Санкт-Петербург' },
    ],
});

export default forwardRef(function Component(props, ref) {
    const rootClass = props.className + ' controlsDemo__flexRow';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__wrapper controlsDemo__flexColumn">
                <MenuPopup
                    source={source}
                    keyProperty="key"
                    displayProperty="title"
                    footerBackgroundStyle="unaccented"
                    footerContentTemplate={FooterContentTemplate}
                />
            </div>
        </div>
    );
});

function FooterContentTemplate() {
    return <div className="ControlsDemo-Menu-Control__footerContentTemplate">+ Добавить</div>;
}
