'use strict';

import { EventEmitter } from 'events';
import systeminfo from 'systeminformation';

export default class Text extends EventEmitter {
  constructor(options, output) {
    super();
    options = options || {};
    this.output = output || {};
  }

  update() {
    let msg = ':)';
    this.output.critical = true;

    systeminfo.battery(info => {
      msg = info.percent + '%';
      if (!info.ischarging) {
        msg += ' (' + this.formatMinutes(info.timeremaining) + ')';
      }

      this.output.critical = false;

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
    return `${h}:${min}`;
  }
}

