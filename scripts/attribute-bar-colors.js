const MODULE_ID = 'attribute-bar-colors';


function drawBars_Override() {	
    if ( !this.actor || (this.document.displayBars === CONST.TOKEN_DISPLAY_MODES.NONE) ) {
		return this.bars.visible = false;
	}
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
    if ( this.document.height >= 2 ) h *= 1.6;  // Enlarge the bar for large tokens
   
    // Determine the color to use
    const blk = 0x000000;

	// Convert color picker hex strings to RGB values
	//const bar1e = hexToRGB((game.settings.get(MODULE_ID, 'bar1empty')).replace('#', '0x').slice(0,8)); // old definition
	
	const bar1e = Color.fromString((game.settings.get(MODULE_ID, 'bar1empty')).replace('#', '0x').slice(0,8)).rgb;	
	const bar1f = Color.fromString((game.settings.get(MODULE_ID, 'bar1full')).replace('#', '0x').slice(0,8)).rgb;
	const bar2e = Color.fromString((game.settings.get(MODULE_ID, 'bar2empty')).replace('#', '0x').slice(0,8)).rgb;
	const bar2f = Color.fromString((game.settings.get(MODULE_ID, 'bar2full')).replace('#', '0x').slice(0,8)).rgb;

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

	const frameMargin = (game.settings.get(MODULE_ID, 'frame-margin'));	
	const barScale = (game.settings.get(MODULE_ID, 'bar-scale')); 
	const barH = h * barScale;

    	if ( this.document.height < 1 ) h *= (0.8 * barScale ) ;  // Decrease the bar for small tokens

	const barBorderAlpha = (game.settings.get(MODULE_ID, 'bar-border-alpha'));
	const barBackgroundAlpha = (game.settings.get(MODULE_ID, 'bar-background-alpha')); 
	const barBackgroundBorderAlpha = (game.settings.get(MODULE_ID, 'bar-background-border-alpha')); 

    // Draw the bar
    bar.clear()
      bar.beginFill(blk, barBackgroundAlpha).lineStyle(bs, blk, barBackgroundBorderAlpha).drawRoundedRect(0, 0, this.w -2*frameMargin, barH, 3)
      bar.beginFill(color, 1.0).lineStyle(bs, blk, barBorderAlpha).drawRoundedRect(0, 0, pct*w - pct*2*frameMargin, barH, 2)

    // Set position
    let posY = number === 0 ? this.h - barH - frameMargin : 0 + frameMargin;
    bar.position.set(0 + frameMargin, posY);  
    bar.visible = true;
		}
    });
	this.bars.visible = this._canViewMode(this.document.displayBars);
  }



function refreshHUD_Override({bars=true, border=true, effects=true, elevation=true, nameplate=true}={}) {
    if ( bars ) this.drawBars();
    if ( effects ) this._refreshEffects();
    if ( elevation ) {
      const tt = this._getTooltipText();
      if ( tt !== this.tooltip.text ) this.tooltip.text = tt;
      this.tooltip.position.set(this.w / 2, -2);
    }
    if ( nameplate ) {
      if ( this.document.name !== this.nameplate.text ) this.nameplate.text = this.document.name;
      this.nameplate.position.set(this.w / 2, this.h + 2);
      this.nameplate.visible = this._canViewMode(this.document.displayName);
    }
	if ( border ) { // this is the overridden part for various parameters
    this.border.clear();
    this.border.position.set(this.document.x, this.document.y);
    if ( !this.visible ) return;		
    const borderColor = this._getBorderColor();
    if( !borderColor ) return;
	const frameScale = Math.round(game.settings.get(MODULE_ID, 'frame-scale')); 
	const frameAlpha = (game.settings.get(MODULE_ID, 'frame-alpha'));
	const frameBlkBorderAlpha = (game.settings.get(MODULE_ID, 'frameblk-border-alpha'));
	const borderFillSelected = (game.settings.get(MODULE_ID, 'border-fill-selected')); 
	const borderFillHover = (game.settings.get(MODULE_ID, 'border-fill-hover'));
	const t = Math.round(CONFIG.Canvas.objectBorderThickness * frameScale);
	const frameMargin = (game.settings.get(MODULE_ID, 'frame-margin'));
    
    // Draw Hex border for size 1 tokens on a hex grid
    if ( canvas.grid.isHex ) {
		
    const gt = CONST.GRID_TYPES;
    const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
    if ( hexTypes.includes(canvas.grid.type) && (this.document.width === 1) && (this.document.height === 1) ) {
      const polygon = canvas.grid.grid.getPolygon(-1+frameMargin, -1+frameMargin, this.w+2-2*frameMargin, this.h+2-2*frameMargin);

    this.border.lineStyle(t, 0x000000, frameBlkBorderAlpha).drawPolygon(polygon);

    if (this.controlled) {
      this.border.beginFill(borderColor, borderFillSelected).lineStyle(t/2, borderColor, frameAlpha).drawPolygon(polygon);
      } else {
      this.border.beginFill(borderColor, borderFillHover).lineStyle(t/2, borderColor, frameAlpha).drawPolygon(polygon);
      }
    }
	}

    // Otherwise Draw Square border
    else {

	const frameScale = Math.round(game.settings.get(MODULE_ID, 'frame-scale'));
	const frameAlpha = (game.settings.get(MODULE_ID, 'frame-alpha'));

	const frameBlkBorderAlpha = (game.settings.get(MODULE_ID, 'frameblk-border-alpha'));
	const borderFillSelected = (game.settings.get(MODULE_ID, 'border-fill-selected'));
	const borderFillHover = (game.settings.get(MODULE_ID, 'border-fill-hover'));

      const h = Math.round(t/2);
      const o = Math.round( -(h/2) + frameMargin);

	this.border.lineStyle(t, 0x000000, frameBlkBorderAlpha).drawRoundedRect(o, o, (this.w+h)-2*frameMargin, (this.h+h)-2*frameMargin, 3);
      if (this.controlled) {
	this.border.beginFill(borderColor, borderFillSelected).lineStyle(h, borderColor, frameAlpha).drawRoundedRect(o, o, (this.w+h)-2*frameMargin, (this.h+h)-2*frameMargin, 3);
      } else {
        this.border.beginFill(borderColor, borderFillHover).lineStyle(h, borderColor, frameAlpha).drawRoundedRect(o, o, (this.w+h)-2*frameMargin, (this.h+h)-2*frameMargin, 3);
      }

    }
	}
}


function _getBorderColor_Override({hover}={}) {

	const gmDisposition = (game.settings.get(MODULE_ID, 'gm-disposition'));
    const colors = CONFIG.Canvas.dispositionColors;
	
      if ( this.controlled && !gmDisposition ) return colors.CONTROLLED;	  
      else if ( (this.controlled && gmDisposition) || (hover ?? this.hover) || canvas.tokens._highlight ) {
         let d = parseInt(this.document.disposition);  // change for disposition color option
         if (!game.user.isGM && this.isOwner) return colors.CONTROLLED;
         else if (this.actor?.hasPlayerOwner) return colors.PARTY;
         else if (d === CONST.TOKEN_DISPOSITIONS.FRIENDLY) return colors.FRIENDLY;
         else if (d === CONST.TOKEN_DISPOSITIONS.NEUTRAL) return colors.NEUTRAL;
         else return colors.HOSTILE;
      }
   else return null;
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
	hint: ".....Each bar color will be calculated based on current status between 0 and max value of the attribute. Scene reload is needed for the changes to take effect!", 
	label: "Full Bar",
	restricted: true,                  // Restrict to gamemaster only?
    defaultColor: "#a50000ff",          // The default color of the setting
    scope: "world",                    // The scope of the setting
    config: true,
	onChange: (value) => {},            // A callback function
	})

// Bars' and border's options

const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 500);

    game.settings.register(MODULE_ID, "bar-scale", {
        name: 'BAR HEIGHT scaling',
        hint: '. . . 0.5 - 1.5 (Core default 1)',
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        range: {
            min: 0.5,
            max: 1.5,
            step: 0.1
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, "bar-border-alpha", {
        name: 'BAR BORDER alpha',
        hint: '. . . (Core default 1). The bar itself will remain opaque',
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.1
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, "bar-background-alpha", {
        name: 'BAR BACKGROUND alpha',
        hint: '. . . (Core default 0.5)',
        scope: "world",
        config: true,
        default: 0.5,
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.1
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, "bar-background-border-alpha", {
        name: 'BAR BACKGROUND BORDER alpha',
        hint: '. . . (Core default 1)',
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.1
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, "frame-scale", {
        name: 'Token FRAME THICKNESS',
        hint: '. . . Selected and hovered-over tokens ½ / 1 / 1½ / 2 / 2½ / 3 (Core default 1)',
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        range: {
            min: 0.5,
            max: 3,
            step: 0.5
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, "frame-alpha", {
        name: 'Token FRAME alpha',
        hint: '. . . Selected and hovered-over tokens (Core default 1)',
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.1
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, "frameblk-border-alpha", {
        name: 'Token FRAME BORDER alpha',
        hint: '. . . Selected and hovered-over tokens (Core default 1)',
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.1
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, "frame-margin", {
        name: 'Token FRAME MARGIN for GRIDS',
        hint: '. . . Margin between token frame and grid (Core default 0) ',
        scope: "world",
        config: true,
        default: 0,
        type: Number,
        range: {
            min: 0,
            max: 20,
            step: 5
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, 'border-fill-selected', {
        name: 'SELECTED BACKGROUND alpha',
	hint: '. . . Selected tokens get a translucent background (0-0.5). Only GM.',
        scope: "client",
        config: true,
        default: 0,
        type: Number,
        range: {
            min: 0,
            max: 0.5,
            step: 0.1
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, 'border-fill-hover', {
        name: 'HOVERED BACKGROUND alpha',
	hint: '. . . Hovered-over tokens get a translucent background (0-0.5). Only GM.',
        scope: "client",
        config: true,
        default: 0,
        type: Number,
        range: {
            min: 0,
            max: 0.5,
            step: 0.1
        },
        onChange: () => {debouncedReload();}
    });

    game.settings.register(MODULE_ID, 'gm-disposition', {
        name: 'Disposition color for selected icons',
	hint: '. . . Show selected tokens with disposition color instead of default selected color (Orange). Only GM.',
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => {debouncedReload();}
    });
})


Hooks.once('setup', function () {

    libWrapper.register(MODULE_ID, 'Token.prototype.drawBars', drawBars_Override, "OVERRIDE");

    libWrapper.register(MODULE_ID, 'Token.prototype.refreshHUD', refreshHUD_Override, "OVERRIDE");

    libWrapper.register(MODULE_ID, 'Token.prototype._getBorderColor', _getBorderColor_Override, "OVERRIDE");

    console.log(`Attribute Bar Colors v2.0 | initialized`);
})


Hooks.once('ready', () => {
    try{window.Ardittristan.ColorSetting.tester} catch {
        ui.notifications.notify('Please make sure you have the "lib - ColorSettings" module installed and enabled.', "error");
    }
})
