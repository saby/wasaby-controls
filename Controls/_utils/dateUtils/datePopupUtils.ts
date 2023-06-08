import { Control, IControlOptions } from 'UI/Base';

export function getCommonOptions(
    self: Control<IControlOptions, unknown>,
    opener?: Control<IControlOptions, unknown> | HTMLElement
): object {
    return {
        opener: opener || self,
        direction: { horizontal: 'right' },
        targetPoint: { horizontal: 'left' },
        fittingMode: 'overflow',
        eventHandlers: {
            onClose: self._onClose?.bind(self),
            onResult: self._onResult.bind(self),
        },
    };
}

export function getTemplateOptions(
    self: Control<IControlOptions, unknown>
): object {
    return {
        ...this.getCommonTemplateOptions(self),
        startValue:
            self.rangeModel?.startValue || self._startValue || self.props.value,
        endValue:
            self.rangeModel?.endValue || self._endValue || self.props.value,
    };
}

export function getDateRangeTemplateOptions(
    self: Control<IControlOptions, unknown>
): object {
    return {
        ...this.getCommonTemplateOptions(self),
        startValue: self._rangeModel?.startValue,
        endValue: self._rangeModel?.endValue,
        startValueValidators: self.props.startValueValidators,
        endValueValidators: self.props.endValueValidators,
    };
}

export function getCommonTemplateOptions(
    self: Control<IControlOptions, unknown>
): object {
    return {
        closeButtonVisible: true,
        mask: self.props.mask,
        readOnly: self.props.readOnly,
        dateConstructor: self.props.dateConstructor,
    };
}

export const getFormattedSingleSelectionValue = (value) => {
    // Если передать null в datePopup в качестве начала и конца периода, то он выделит
    // период от -бесконечности до +бесконечности.
    // В режиме выбора одного дня мы не должны выбирать ни один день.
    let formattedValue = value;
    if (value === null) {
        formattedValue = undefined;
    }
    return {
        startValue: formattedValue,
        endValue: formattedValue,
    };
};
