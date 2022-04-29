const MODULE_ID = 'attribute-bar-colors';

    function drawBars_Override() {	
    if ( !this.actor || (this.data.displayBars === CONST.TOKEN_DISPLAY_MODES.NONE) ) return;
    ["bar1", "bar2"].forEach((b, i) => {
		
		if (this.hud?.bars || this.bars)
		{
      const bar = (this.hud?.bars[b] || this.bars[b]);
      const attr = this.document.getBarAttribute(b);
      if ( !attr || (attr.type !== "bar") ) return bar.visible = false;
	  	  
	  let number = i;
	  let data = attr;
	    	  
	const val = Number(data.value);
    const pct = Math.clamped(val, 0, data.max) / data.max;

    // Determine sizing
    let h = Math.max((canvas.dimensions.size / 12), 8);
    const w = this.w;
    const bs = Math.clamped(h / 8, 1, 2);
    if ( this.data.height >= 2 ) h *= 1.6;  // Enlarge the bar for large tokens

    // Determine the color to use
    const blk = 0x000000;

	// Convert color picker hex strings to RGB values
	const bar1e = hexToRGB((game.settings.get(MODULE_ID, 'bar1empty')).replace('#', '0x').slice(0,8));
	const bar1f = hexToRGB((game.settings.get(MODULE_ID, 'bar1full')).replace('#', '0x').slice(0,8));
	const bar2e = hexToRGB((game.settings.get(MODULE_ID, 'bar2empty')).replace('#', '0x').slice(0,8));
	const bar2f = hexToRGB((game.settings.get(MODULE_ID, 'bar2full')).replace('#', '0x').slice(0,8));

	// Calculate current colors based on attribute bar status
	const R1= bar1e[0] + ((pct) *(bar1f[0] - bar1e[0]));
	const G1= bar1e[1] + ((pct) *(bar1f[1] - bar1e[1]));
	const B1= bar1e[2] + ((pct) *(bar1f[2] - bar1e[2]));
	
	const R2= bar2e[0] + ((pct) *(bar2f[0] - bar2e[0]));
	const G2= bar2e[1] + ((pct) *(bar2f[1] - bar2e[1]));
	const B2= bar2e[2] + ((pct) *(bar2f[2] - bar2e[2]));	
	
    // Set calculated colors for each attribute bar
    let color;		
	if ( number === 0 ) color = PIXI.utils.rgb2hex([R1,G1,B1]);
    else color = PIXI.utils.rgb2hex([R2,G2,B2]);
	
    // Draw the bar
    bar.clear()
    bar.beginFill(blk, 0.5).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, this.w, h, 3)
    bar.beginFill(color, 1.0).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, pct*w, h, 2)

    // Set position
    let posY = number === 0 ? this.h - h : 0;
    bar.position.set(0, posY);
  
      bar.visible = true;
		}
    });
  }
  
  
Hooks.once('init', function () {


	new window.Ardittristan.ColorSetting(MODULE_ID, 'bar2empty', {
    name: "Token Bar 2 (above)",
	label: "Empty Bar",
    restricted: true,                  // Restrict to gamemaster only?
    defaultColor: "#000095ff",          // The default color of the setting
    scope: "world",                    // The scope of the setting
    config: true,
	onChange: (value) => {},            // A callback function
	})

	new window.Ardittristan.ColorSetting(MODULE_ID, 'bar2full', {
    name: "Token Bar 2 (above)",
	label: "Full Bar",	
    restricted: true,                  // Restrict to gamemaster only?
    defaultColor: "#7d5accff",          // The default color of the setting
    scope: "world",                    // The scope of the setting
    config: true,
	onChange: (value) => {},            // A callback function
	})

	new window.Ardittristan.ColorSetting(MODULE_ID, 'bar1empty', {
    name: "Token Bar 1 (below)",  
	label: "Empty Bar",	
    restricted: true,                  // Restrict to gamemaster only?
    defaultColor: "#7f5522ff",          // The default color of the setting
    scope: "world",                    // The scope of the setting
    config: true,
	onChange: (value) => {},            // A callback function
	})

	new window.Ardittristan.ColorSetting(MODULE_ID, 'bar1full', {
    name: "Token Bar 1 (below)",
	hint: "Each bar color will be calculated based on current status between 0 and max value of the attribute. Scene reload is needed for the changes to take effect!", 
	label: "Full Bar",
	restricted: true,                  // Restrict to gamemaster only?
    defaultColor: "#a50000ff",          // The default color of the setting
    scope: "world",                    // The scope of the setting
    config: true,
	onChange: (value) => {},            // A callback function
	})



})

  Hooks.once('setup', function () {

    libWrapper.register(MODULE_ID, 'Token.prototype.drawBars', drawBars_Override, "OVERRIDE")

    console.log(`Attribute Bar Colors v1.0 | initialized`)
	

})

Hooks.once('ready', () => {
    try{window.Ardittristan.ColorSetting.tester} catch {
        ui.notifications.notify('Please make sure you have the "lib - ColorSettings" module installed and enabled.', "error");
    }
});