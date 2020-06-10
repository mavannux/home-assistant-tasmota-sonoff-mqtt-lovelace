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
  
import { HomeAssistant, hasConfigOrEntityChanged } from "custom-card-helpers";

import { styles } from './styles';

const CARD_TYPE = "tasmota-sonoff-mqtt-card";

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type:  CARD_TYPE,
  name: "tasmota-sonoff-mqtt",
  description: "tasmota-sonoff-mqtt",
});

const DAYS = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];

class TestCardConfig {
  public name?:String;
  public show_error?: boolean;
  public entity;
}

class TasmotaTimer {
  public Action: number = 0; // 1 - 0
  public Arm: number = 0; // 1-0
  public Days: String = '0000000'; //"0111110"
  public Mode: number = 0; //0
  public Output: number = 0;
  public Repeat: number = 0;
  public Time: String = "00:00";// "06:00"
  public Window:number = 0;// 0
}

class TestCard extends LitElement {

  @property() 
  public hass?: HomeAssistant;

  @property() 
  public config?: TestCardConfig;
  
  private _width: number = 100;
  private _height: number = 100;
  private _shadowHeight: number = 1;

//   static get properties() {
//     return {
//       hass: {},
//       config: {}
//     };
//   }

  public setConfig(config: TestCardConfig): void {
    if (!config || config.show_error) {
      throw new Error("Invalid configuration");
    }
    //if (!config.name) config.name = config.entity;
    this.config = config;
  }

//   set hass(hass) {
//     if (!this.content) {
//       const card = document.createElement('ha-card');
//       card.header = 'Example card';
//       this.content = document.createElement('div');
//       this.content.style.padding = '0 16px 16px';
//       card.appendChild(this.content);
//       this.appendChild(card);
//     }
//   }

  public getCardSize(): number {
    return 3;//this.config.entities.length + 1;
  }

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
    const state = this.hass.states[entityId];
    if (!state) return html`No state`;

    const timers:TemplateResult[] = [];
    
    for(var p in state.attributes) {
      
      if (/^Timer\d+$/.test(p)) {
        console.info(p);
        timers.push(this.getHtmlTimer(p, state.attributes[p]));
      }
    }

    return html`
    <ha-card id="cardroot">
      <div class="card-header">${this.config.name || this.config.entity}</div>
      <div class="card-content">
        <div class="tsm-timers-status">Timers: ${state.attributes.Timers}</div>
        <div class="tsm-timers-container">
        ${timers}
        </div>
      </div>
    </ha-card>
    `;
  }


  private getHtmlTimer(p: String, timer: TasmotaTimer) : TemplateResult {
    var nr = p.substr(5);

    var days : String = '';
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
    </div>
    `;
  }

}

customElements.define(CARD_TYPE, TestCard);
