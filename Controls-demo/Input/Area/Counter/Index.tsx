import {forwardRef, useState} from 'react';
import { Area } from 'Controls/input';

export default forwardRef(function AreaWithCounter(_, ref) {
    const [valueWithCounter, setValueWithCounter] = useState('');
    const [valueWithoutCounter, setValueWithoutCounter] = useState('');
    return (
      <div ref={ref} className='controls-margin_top-xl controls-margin_left-2xl controls-margin_bottom-xl'>
          <div className='controlsDemo__cell controls-margin_bottom-2xl'>
              <div className="controls-text-label">Отображение счётчика, maxLength=10</div>
              <Area
                  className='controlsDemo_fixedWidth300'
                  value={valueWithCounter}
                  onValueChanged={(res)=>{
                      setValueWithCounter(res);
                  }}
                  customEvents={['onValueChanged']}
                  counterVisibility={true}
                  maxLength={10} />
          </div>
          <div className='controlsDemo__cell'>
              <div className="controls-text-label">Стандартный вариант, maxLength=10</div>
              <Area
                  className='controlsDemo_fixedWidth300'
                  value={valueWithoutCounter}
                  onValueChanged={(res)=>{
                      setValueWithoutCounter(res);
                  }}
                  customEvents={['onValueChanged']}
                  maxLength={10} />
          </div>
      </div>
    );
});
