const MODULE_ID = 'attribute-bar-colors';

function  _drawCBar_Override(number, bar, data) {
    const val = Number(data.value);
    const pct = Math.clamped(val, 0, data.max) / data.max;

    // Determine sizing
    let h = Math.max((canvas.dimensions.size / 12), 8);
    const w = this.w;
    const bs = Math.clamped(h / 8, 1, 2);
    if ( this.data.height >= 2 ) h *= 1.6;  // Enlarge the bar for large tokens

    // Determine the color to use
    const blk = 0x000000;

// Change health bar to red for Shadowrun 5e
    let prs;
    if ( number === 0 ) prs = 1 - pct;
    else prs = pct;
    let color;
    if ( number === 0 ) color = PIXI.utils.rgb2hex([(1-(prs/2)), prs, 0]);
    else color = PIXI.utils.rgb2hex([(0.5 * pct), (0.7 * pct), 0.5 + (pct / 2)]);
// Change end

    // Draw the bar
    bar.clear()
    bar.beginFill(blk, 0.5).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, this.w, h, 3)
    bar.beginFill(color, 1.0).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, pct*w, h, 2)

    // Set position
    let posY = number === 0 ? this.h - h : 0;
    bar.position.set(0, posY);
  }
  
  
    function _drawBars_Override() {
    if ( !this.actor || (this.data.displayBars === CONST.TOKEN_DISPLAY_MODES.NONE) ) return;
    ["bar1", "bar2"].forEach((b, i) => {
      const bar = this.hud.bars[b];
      const attr = this.document.getBarAttribute(b);
      if ( !attr || (attr.type !== "bar") ) return bar.visible = false;
      this._drawCBar(i, bar, attr);
      bar.visible = true;
    });
  }
  
  
  
  
  
  Hooks.once('setup', function () {

    libWrapper.register(MODULE_ID, 'Token.prototype._drawBars', _drawBars_Override, "OVERRIDE")

    console.log(`Attribute Bar Colors v1.0 | initialized`)
})