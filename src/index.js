'use strict';

import { EventEmitter } from 'events';
import systeminfo from 'systeminformation';

export default class Text extends EventEmitter {

  constructor(options, output) {
    super();
    options = options || {};
    this.output = output || {};
    this.criticalThreshold = options.criticalThreshold || 30;
  }

  update() {
    let msg = '';

    systeminfo.battery(info => {
      msg = info.percent + '%';
      if (!info.ischarging) {
        msg += ' (' + this.formatMinutes(info.timeremaining) + ')';
      }
      if (info.timeremaining < this.criticalThreshold) {
        this.output.critical = true;
        this.output.color = '#FF4444';
      }
    }).catch(err => {
      this.output.critical = true;
      msg = err;
    }).finally(() => {
      this.output.full_text = msg;
      this.output.short_text = msg;
      this.emit('updated', this, this.output);
    })
  }

  action(action) {
    this.__logger.debug('button pressed on %s:', this.__name, action.button);
  }

  formatMinutes(min) {
    let h = 0;
    if (min > 60) {
      h = Math.floor(min / 60);
      min = min%60;
    }
    return `${this.format(h)}:${this.format(min)}`;
  }

  format(num) {
    return num < 10 ? `0${num}` : num;
  }
}

