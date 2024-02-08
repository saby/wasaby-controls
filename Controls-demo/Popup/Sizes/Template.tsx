import { Dialog } from 'Controls/popupTemplate';
import { forwardRef } from 'react';

const PopupTemplate = forwardRef((props, ref) => {
    return (
        <Dialog ref={ref} {...props} bodyContentTemplate={() => {
            return (
                <div className='controls-padding-xl'>
                    <div className='controls-fontsize-2xl controls-margin_bottom-2xl'>Lorem Ipsum</div>
                    <div className='controls-fontsize-xl'>"Neque porro quisquam est qui dolorem ipsum quia dolor sit
                        amet,
                        consectetur, adipisci velit..."
                        "Нет никого, кто любил бы боль саму по себе, кто искал бы её и кто хотел бы иметь её просто
                        потому, что
                        это боль.."
                    </div>
                </div>
            )
        }}/>
    )
})

PopupTemplate.isReact = true

export default PopupTemplate;
