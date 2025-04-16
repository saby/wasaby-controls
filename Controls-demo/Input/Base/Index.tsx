import { useState, forwardRef } from 'react';
import { Text, Area, Number, Mask } from 'Controls/input';
import { InputContainer } from 'Controls/jumpingLabel';

export default forwardRef(function Component(props, ref) {
    const [filledValue, setFilledValue] = useState('text');
    const [outlinedValue, setOutlinedValue] = useState('text');
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const [numberValue, setNumberValue] = useState(1234.56);
    const [maskValue, setMaskValue] = useState('');
    const [jumpingValue, setJumpingValue] = useState('');
    const [areaValue, setAreaValue] = useState('text');
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Виды полей ввода
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Text
                            className="controlsDemo__input"
                            value={outlinedValue}
                            onValueChanged={setOutlinedValue}
                            contrastBackground={false}
                        />
                    </div>
                    <div className="controlsDemo__cell controls-padding-m controls-background-unaccented-same">
                        <Text
                            className="controlsDemo__input"
                            value={filledValue}
                            onValueChanged={setFilledValue}
                            contrastBackground={true}
                        />
                    </div>
                </div>
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250 controls-padding_left-m">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Поле ввода числа
                    </div>
                    <Number value={numberValue} onValueChanged={setNumberValue} />
                    <div className="controls-text-label controls-margin_top-m controls-margin_bottom-xs">
                        Поле ввода с маской
                    </div>
                    <Mask
                        replacer=" "
                        mask="ddd.ddd.ddd.ddd"
                        value={maskValue}
                        onValueChanged={setMaskValue}
                    />
                </div>
            </div>
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Поле ввода с прыгающей меткой
                    </div>
                    <InputContainer className="controlsDemo__input" caption="Enter your name">
                        <Text value={jumpingValue} onValueChanged={setJumpingValue} />
                    </InputContainer>
                </div>

                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Многострочное поле ввода
                    </div>
                    <Area
                        className="controlsDemo_fixedWidth250"
                        value={areaValue}
                        onValueChanged={setAreaValue}
                        minLines={2}
                        maxLines={4}
                    />
                </div>
            </div>
        </div>
    );
});
