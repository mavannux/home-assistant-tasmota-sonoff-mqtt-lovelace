//https://github.com/custom-cards/boilerplate-card/blob/master/src/boilerplate-card.ts

import {
    LitElement,
    html,
    customElement,
    property,
    CSSResult,
    TemplateResult,
    css,
    query,
    PropertyValues,
  } from "lit-element";

import { HomeAssistant } from "custom-card-helpers";

import { closePopUp } from "card-tools/src/popup";

import { editDialogStyle } from './styles';

export const CARD_TYPE = "tasmota-sonoff-dialog-mqtt-card";


(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type:  CARD_TYPE,
  name: "Test Card",
  description: "A test-card",
});

export class TimerDialogConfig {
  public Id: string = '0';
  public Action: number = 0; // 1 - 0
  public Arm: number = 0; // 1-0
  public Days: string = '0000000'; //"0111110"
  public Mode: number = 0; //0
  public Output: number = 0;
  public Repeat: number = 0;
  public Time: string = "00:00";// "06:00"
  public Window:number = 0;// 0
}

interface TimerDialogStatus {
  Id: string;
  Action: number; // 1 - 0
  Arm: number; // 1-0
  Days: Array<string>; //"0111110"
  Mode: number; //0
  Output: number;
  Repeat: number;
  Time: string;// "06:00"
  Window: number;// 0
}

class TestDialogCard extends LitElement {

  @property()
  private config: TimerDialogConfig = new TimerDialogConfig();

  @property() 
  private hass?: HomeAssistant;

  private _status: TimerDialogStatus = {
    Action:0,
    Arm:0,
    Days:[],
    Id:'0',
    Mode:0,
    Output:0,
    Repeat:0,
    Time:'',
    Window:0
  };

  public setConfig(config: TimerDialogConfig): void {
    this.config = config;
    var days : Array<string> = [];
    for(var i=0 ; i<config.Days.length ; i++)
      days.push(config.Days.charAt(i));

    this._status = {
      Id: config.Id,
      Action: config.Action, // 1 - 0
      Arm: config.Arm, // 1-0
      Days: days, //"0111110"
      Mode: config.Mode, //0
      Output: config.Output,
      Repeat: config.Repeat,
      Time: config.Time, // "06:00"
      Window: config.Window// 0
    };

  }

  static get styles() : CSSResult {
    return editDialogStyle;
  }
  
  protected render(): TemplateResult | void {

    if (!this._status) return html`<b>Status null`;

    var hours : Array<string> = [];
    for(var i=0 ; i < 24 ; i++) {
      hours.push( (i < 10 ? '0':'') + i + ':00');
    }

    return html`
    <div id="edit-timer-dlg" class="edit-timer-dlg">

      <div class="">Abilitato: 
        <ha-switch style="float:right" 
          @change=${this.onEditDlgArm}
          .checked=${this._status.Arm} />
      </div>

      <div>Ripeti: 
        <ha-switch style="float:right" 
          @change=${this.onEditDlgRepeat}
          .checked=${this._status.Repeat} />
      </div>

      <div>Ora: 
        <select style="float: right;border-color: lightgray;border-radius: 5px;font-size: 1em;"
          @change=${this.onEditDlgTime}
          >
          ${hours
            .map(i => html`<option value="${i}" ?selected=${this._status.Time == i}>${i}</option>`)}
        </select>
      </div>

      <div>Azione: 
        <select style="float: right;border-color: lightgray;border-radius: 5px;font-size: 1em;"
          @change=${this.onEditDlgAction}
          >
        <option value="1" ?selected=${this._status.Action == 1}>Accendi</option>
        <option value="0" ?selected=${this._status.Action == 0}>Spegni</option>
        </select>
      </div>

      <div>Giorni:</div>
      <div>
      ${['Dom','Lun','Mar','Mer','Gio','Ven','Sab']
      .map((day,index) => html`
        <input type="checkbox" 
          .checked=${this._status.Days[index]=='1'} 
          @click=${() => this.toggleCheck(index)} />${day} 
      `)}
      </div>
      <div class="actions">
        <mwc-button slot="primaryAction" dialogAction="ok" @click="${this.confirmTimer}">Ok</mwc-button>
        <mwc-button slot="secondaryAction" dialogAction="cancel" @click="${closePopUp}">Annulla</mwc-button>
      </div>
    </div>
    `;
  }

  private toggleCheck(i) {
    this._status.Days[i] = this.config.Days[i]=='1' ? '0' : '1';
    this.requestUpdate();
  }

  private onEditDlgArm() {
    this._status.Arm = this.config.Arm == 0 ? 1 : 0;
    this.requestUpdate();
  }

  private onEditDlgRepeat() {
    this._status.Repeat = this.config.Repeat == 0 ? 1 : 0;
    this.requestUpdate();
  }

  private onEditDlgTime(e) {
    var a :HTMLSelectElement = e.target;
    this._status.Time = a.value;
    this.requestUpdate();
  }

  private onEditDlgAction(e) {
    var a :HTMLSelectElement = e.target;
    this._status.Action = parseInt(a.value);
    this.requestUpdate();
  }

  private confirmTimer() {
    var days = '';
    this._status.Days.forEach(x=> days += x);
      
    this.hass?.callService("tasmota_sonoff_mqtt", "set_timer", <TimerDialogConfig> {
      Id: this._status.Id,
      Arm : this._status.Arm,
      Action: this._status.Action,
      Days: days,
      Mode: this._status.Mode,
      Output: this._status.Output,
      Repeat: this._status.Repeat,
      Time: this._status.Time,
      Window: this._status.Window
    });
    
    closePopUp();
  }
  
}

customElements.define(CARD_TYPE, TestDialogCard);
