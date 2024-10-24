import { forwardRef } from 'react';
import { Button } from 'Controls/buttons';
import { DialogOpener, TPopupWidth } from 'Controls/popup';

export default forwardRef(function DemoDialogBaseWidthSizes(_, ref) {
    const widthSizes: TPopupWidth[] = ['a', 'd', 'j', 'm'];
    return (
        <div ref={ref}>
            <div className='controls-padding-2xl'>
                <div className='controls-text-label controls-fontsize-xl'>
                    Возможность задания буквенных ширин для диалоговых окон(Dialog) из стандартной линейки размеров
                </div>
                {
                    widthSizes.map((item, index) => (
                        <div key={item} className={index !== widthSizes.length - 1 ? 'controls-margin_bottom-2xl' : ''}>
                            <Button
                                onClick={(e) => {
                                    const dialogOpener = new DialogOpener();
                                    dialogOpener.open({
                                        width: item,
                                        template: 'Controls-demo/Popup/Sizes/Template',
                                        opener: null
                                    });
                                }}
                                caption={`Dialog size=${item}`}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
});
