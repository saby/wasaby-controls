import { forwardRef, useState } from 'react';
import { RelationController, RelationWrapper, Selector, RelationButton } from 'Controls/dateRange';

const DEFAULT_VALUES = [
    [new Date(2023, 1, 20), new Date(2023, 1, 20)],
    [new Date(2023, 1, 1), new Date(2023, 2, 0)],
];

function Wrappers() {}

function ValidateInitialRanges(props, ref) {
    const [values, setValues] = useState(DEFAULT_VALUES);
    const [bindType, setBindType] = useState('normal');

    const onRangeChanged = (ranges) => {
        setValues(ranges);
    };

    const getWrappers = (props) => {
        const contentProps = {
            ...props,
        };
        delete contentProps.children;
        delete contentProps.content;
        return (
            <div>
                <RelationWrapper {...contentProps} number={0}>
                    <Selector startValue={props.ranges[0][0]} endValue={props.ranges[0][1]} />
                </RelationWrapper>
                <RelationButton
                    value={bindType}
                    onValueChanged={(type) => {
                        setBindType(type);
                    }}
                />
                <RelationWrapper {...contentProps} number={1}>
                    <Selector startValue={props.ranges[1][0]} endValue={props.ranges[1][1]} />
                </RelationWrapper>
            </div>
        );
    };

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '250px' }}>
                <RelationController
                    startValue0={values[0][0]}
                    endValue0={values[0][1]}
                    startValue1={values[1][0]}
                    endValue1={values[1][1]}
                    bindType={bindType}
                    onBindTypeChanged={(type) => {
                        setBindType(type);
                    }}
                    content={getWrappers}
                    onPeriodsChanged={onRangeChanged}
                ></RelationController>
            </div>
        </div>
    );
}

export default forwardRef(ValidateInitialRanges);
