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
  

//import { HassEntity, HassConfig, Auth, Connection, MessageBase, HassServices } from "home-assistant-js-websocket";
import { HassEntity } from "home-assistant-js-websocket";
import { HomeAssistant, hasConfigOrEntityChanged } from "custom-card-helpers";
import { popUp } from "card-tools/src/popup";
import { styles } from './styles';
import { TimerDialogConfig, CARD_TYPE as CARD_DIALOG_TYPE } from './editdialog';

const CARD_TYPE = "tasmota-sonoff-mqtt-card";

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type:  CARD_TYPE,
  name: "Tasmota sonoff mqtt",
  description: "Tasmota sonoff mqtt",
});

const DAYS = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];

class TasmotaSonoffMqttCardConfig {
  public name?:string;
  public show_error?: boolean;
  public entity;
}

class TasmotaTimer extends TimerDialogConfig {}

class TasmotaSonoffMqttCard extends LitElement {

  @property() 
  public hass?: HomeAssistant;

  @property() 
  public config?: TasmotaSonoffMqttCardConfig;
  
  private state : HassEntity = { entity_id:'', attributes:{}, context:{id:'', user_id:''}, state:'', last_changed:'', last_updated:''};

  public setConfig(config: TasmotaSonoffMqttCardConfig): void {
    if (!config || config.show_error) {
      throw new Error("Invalid configuration");
    }
    //if (!config.name) config.name = config.entity;
    this.config = config;
  }  

  // set hass(hass:HomeAssistant) {
  //   if (!this.content) {
  //     const card = document.createElement('ha-card');
  //     card.header = 'Example card';
  //     this.content = document.createElement('div');
  //     this.content.style.padding = '0 16px 16px';
  //     card.appendChild(this.content);
  //     this.appendChild(card);
  //   }
  // }

  static get styles() : CSSResult {
    return styles;
  }

  protected render(): TemplateResult | void {
    if (!this.config) {
      return html`Invalid configuration`;
    }
    if (!this.hass) {
      return html`Loading`;
    }
    const entityId = this.config.entity; // tasmota_sonoff_mqtt.boiler
    this.state = this.hass.states[entityId];
    if (!this.state) return html`No state`;

    const timers:TemplateResult[] = [];
    
    for(var p in this.state.attributes.Timers) {
        timers.push(this.getHtmlTimer(p, this.state.attributes.Timers[p]));
    }

    return html`
    <ha-card id="cardroot">
      <div class="card-header">${this.config.name || this.config.entity}</div>
      <div class="card-content">
        <div class="tsm-timers-status">Timers: ${this.state.attributes.TimersStatus}</div>
        <div class="tsm-timers-container">
        ${timers}
        </div>
      </div>
    </ha-card>
    `;
  }


  /**
   * Timer row
   * @param p Timer3
   * @param timer object
   */
  private getHtmlTimer(p: string, timer: TasmotaTimer) : TemplateResult {
    var nr = p.substr(5);

    var days : string = '';
    for(var i=0 ; i<timer.Days.length ; i++)
      if(timer.Days[i] == '1') days += (days.length>0?', ':'') + DAYS[i];

    var turnOnOff = timer.Action == 0 ? 'off' : 'on';

    var isEnabled = timer.Arm == 1;
      
    var repeat = timer.Repeat == 1;
      
    return html`
    <div class="tsm-timer">
      <div class="tsm-timer-number ${isEnabled?'enabled':'disabled'} ${turnOnOff}">
        <div class="tsm-timer-number-onoff">${turnOnOff}</div>
        <div class="tsm-timer-number-n">${nr}</div>
        ${repeat?html`<div class="tsm-timer-number-repeat">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </div>`: ''}
      </div>
      <div class="tsm-content">
        <div class="tsm-time">${timer.Time}</div>
        <div class="tsm-days">${days}</div>
      </div>
      <div class="tsm-timer-edit-btn">
        <ha-icon icon="mdi:pencil" @click="${()=>this.onEditTimer(p)}"></ha-icon>
      </div>
    </div>
    `;
  }

  private onEditTimer(timerId: string) {

    var timer:TasmotaTimer = this.state.attributes.Timers[timerId];
        
    // timer.Days = "1000001"
    var days :Array<string> = [];
    for(var i=0 ; i<timer.Days.length ; i++){
      days.push(timer.Days[i]);
    }

    // timer.Time = "07:00"

    var dialogConfig : TimerDialogConfig = {
      Id : timerId,
      Arm: timer.Arm,
      Repeat: timer.Repeat,
      Action: timer.Action,
      Time: timer.Time,
      Days: timer.Days,
      Mode: timer.Mode,
      Output: timer.Output,
      Window: timer.Window
    }

    popUp('Timer ' + i, {
      type: `custom:${CARD_DIALOG_TYPE}`,
      ...dialogConfig
      }); 
      //,false, {'background-color': '#03a9f4'});
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    // Map(3) {"editTimerDlg" => undefined, "config" => undefined, "hass" => undefined}
    // {"editTimerDlg" => TimerDialog}
    // shouldUpdate Map(0) {}
    // {"hass" => {…}}
    if (changedProps.has("hass") && !!changedProps["hass"]) {
      this.hass = <HomeAssistant>changedProps["hass"];
      var state = this.hass.states[this.config?.entity];
      if (this.state.state != state.state) return true;
    }
    var r = hasConfigOrEntityChanged(this, changedProps, false)
    return r;
  }

  // protected updated(changedProps: PropertyValues): void {
  //   console.log("** updated", changedProps);
  //   // Map(3) {"editTimerDlg" => undefined, "config" => undefined, "hass" => undefined}
  //   // {"editTimerDlg" => undefined, "config" => undefined, "hass" => undefined}
  //   super.updated(changedProps);
  // }
}

customElements.define(CARD_TYPE, TasmotaSonoffMqttCard);
