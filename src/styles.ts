import { css } from 'lit-element';
export const styles = css`

.tsm-timers-status {
}

.tsm-timers-container {
  xborder:1px solid #aaa;
}

.tsm-timer {
  border:1px solid #aaa;
  background-color: #ddd;
  height: 3em;
}

.tsm-timer-number {
  width: 3em;
  border: 1px solid #555;
  _text-align: center;
  height: 100%;
  align-content: center;
  position: relative;
  vertical-align: middle;
  float: left;
  margin: 0 5px 0 0;
}
.tsm-timer-number.enabled.on {
  background-color: #7fffd4;
}
.tsm-timer-number.enabled.off {
  background-color: #ff7f50;
}
.tsm-timer-number.disabled {
  background-color: #eee;
}

.tsm-timer-number-n {
  padding: 10px 0 0 7px;
}

.tsm-timer-number-onoff {
  position: absolute;
  right: 1px;
  top: -3px;
  font-size: 10px;
  text-transform: uppercase;
}

.tsm-timer-number-repeat {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 15px;
}

ha-icon {
  display: inline-block;
  margin: auto;
  --mdc-icon-size: 100%;
  --iron-icon-width: 100%;
  --iron-icon-height: 100%;
}

.tsm-time {

}
.tsm-days {
  font-size: x-small;
}
`;

export default styles;