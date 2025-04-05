const PULSE_CLASS_NAME = 'pulse';

const PULSE_COLOR = '242, 55, 44';

const PULSE_STYLE = `.${PULSE_CLASS_NAME} {
  box-shadow: 0 0 0 rgba(${PULSE_COLOR}, 0.4);
  animation: ${PULSE_CLASS_NAME} 1s infinite;
}

@-webkit-keyframes ${PULSE_CLASS_NAME} {
 0% {
    -webkit-box-shadow: 0 0 0 0 rgba(${PULSE_COLOR}, 0.4);
  }
 70% {
   -webkit-box-shadow: 0 0 0 10px rgba(${PULSE_COLOR}, 0);
 }
 100% {
    -webkit-box-shadow: 0 0 0 0 rgba(${PULSE_COLOR}, 0);
  }
}

@keyframes ${PULSE_CLASS_NAME} {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(${PULSE_COLOR}, 0.4);
   box-shadow: 0 0 0 0 rgba(${PULSE_COLOR}, 0.4);
  }
 70% {
   -moz-box-shadow: 0 0 0 10px rgba(${PULSE_COLOR}, 0);
    box-shadow: 0 0 0 10px rgba(${PULSE_COLOR}, 0);
 }
 100% {
    -moz-box-shadow: 0 0 0 0 rgba(${PULSE_COLOR}, 0);
   box-shadow: 0 0 0 0 rgba(${PULSE_COLOR}, 0);
  }
}`;

export const getPulseAnimation = () => ({
    pulseClassName: PULSE_CLASS_NAME,
    pulseStyle: PULSE_STYLE,
});
