import { css } from 'lit-element';
export const styles = css`
  .timers-status {
    padding: 15pt 0 18px;
    display: flex;
    align-items: center;
  }
  .timers-status .title {
    flex-grow: 1;
  }
  .timers-status .switch {
    flex-shrink: 1;
  }
  .timers-status .power-status {
    font-size: x-large;
    margin-right: 1em;
  }
  .timers-status .power-toggle {
    padding: 9px 16px;
    border-radius: 8px;
  }

  .card-header .refresh {
    float:right;
    width: 1.6em;
  }

  .tsm-timer {
    border:1px solid #aaa;
    _background-color: #ddd;
    height: 3em;
    position: relative;
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
    background-color: var(--success-color);
  }
  .tsm-timer-number.enabled.off {
    background-color: var(--warning-color);
  }
  .tsm-timer-number.disabled {
    _background-color: #eee;
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

  .tsm-timer-edit-btn {
    position: absolute;
    right: 0;
    top:0.5em;
    width:26px;
    color: #03a9f4;
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

export const editDialogStyle = css`
  .edit-timer-dlg {
    padding: 0 1em;
  }
  .edit-timer-dlg > div {
    padding: 0.5em 0;
  }
  .edit-timer-dlg .actions {
    float:right;
    padding: 1.3em 0;
  }
`;
