//placeholder until data loading functions are ready
$( document ).ready(function() {
    loadData();
});

/* Globals */
var ServerVars = {},
	AppVars = {
		collectionAlias: 'p15963coll18',
		map: {},
		mapBounds: {
			north: 27.5,
			south: 15,
			east: 99.5,
			west: 90.5
		},
		maxZoom: 10,
		minZoom: 4,
		years: undefined,
		selectedYear: undefined,
		selectedYearIndex: undefined,
		scrollTimeout: 1,
		timelineRecenterFlag: false,
		pdfCapable: false,
		selectedPoint: undefined
	},
	DataVars = {
		filters: {
			minYear: 0,
			maxYear: 9999,
			format: [],
			tags: []
		}
	};

function init() {
	AppVars.pdfCapable = getAcrobatInfo().acrobat;
	initEvents();
	initSearch();
	initTags();
	drawTimeline();
	initMap();
	drawPoints();
}

function initEvents(){
	sidebarEvents();

	$( "#timeline-next" ).click( advanceTimeline );
	$( "#timeline-prev" ).click( rewindTimeline );
	$( "#timeline-inner" ).on( "scroll", timelineScroll );

	$( window ).resize( resize );

	resize();
}

function resize(){
	$( "#timeline-inner" ).height( $( "#timeline" ).height() - $( "#year" ).outerHeight() );
	recenterTimeline();
	drawPulse();
}

function update(){
	drawPoints();
	drawTimeline();
	drawPulse();
	
	//Return topbar to it's normal state
	$( '#topbar-picture' ).css( 'background-image', 'none' );
	$( '#topbar .title' ).text( 'Baptists in Burma: ' );
	$( '#topbar .subtitle' ).text( 'Midwestern Missionaries at Home and Abroad' );
	$( 'body' ).removeClass( 'report' );
}

function loadData(){
	$.get( "csv/reports.csv", function( csv ){
		DataVars.reports = Papa.parse( csv, {header: true} ).data;
		_.each( DataVars.reports, function( entry, i ){
			entry.Documents = entry.Documents.split( ';' ).map(Number);
			entry.id = i;
		});
	});
	
	$.get( "php/loadData.php", {
		collection: AppVars.collectionAlias
	}).done( function( data ) {
		DataVars.data = $.parseJSON( data );
		DataVars.filteredData = $.parseJSON( data );
		DataVars.filters.minYear = DataVars.data.minYear;
		DataVars.filters.maxYear = DataVars.data.maxYear;
		init();
	});
}

var getAcrobatInfo = function() {
 
  var getBrowserName = function() {
    return this.name = this.name || function() {
      var userAgent = navigator ? navigator.userAgent.toLowerCase() : "other";
 
      if(userAgent.indexOf("chrome") > -1)        return "chrome";
      else if(userAgent.indexOf("safari") > -1)   return "safari";
      else if(userAgent.indexOf("msie") > -1)     return "ie";
      else if(userAgent.indexOf("firefox") > -1)  return "firefox";
      return userAgent;
    }();
  };
 
  var getActiveXObject = function(name) {
    try { return new ActiveXObject(name); } catch(e) {}
  };
 
  var getNavigatorPlugin = function(name) {
    for(key in navigator.plugins) {
      var plugin = navigator.plugins[key];
      if(plugin.name == name) return plugin;
    }
  };
 
  var getPDFPlugin = function() {
    return this.plugin = this.plugin || function() {
      if(getBrowserName() == 'ie') {
        //
        // load the activeX control
        // AcroPDF.PDF is used by version 7 and later
        // PDF.PdfCtrl is used by version 6 and earlier
        return getActiveXObject('AcroPDF.PDF') || getActiveXObject('PDF.PdfCtrl');
      }
      else {
        return getNavigatorPlugin('Adobe Acrobat') || getNavigatorPlugin('Chrome PDF Viewer') || getNavigatorPlugin('WebKit built-in PDF');
      }
    }();
  };
 
  var isAcrobatInstalled = function() {
    return !!getPDFPlugin();
  };
 
  var getAcrobatVersion = function() {
    try {
      var plugin = getPDFPlugin();
 
      if(getBrowserName() == 'ie') {
        var versions = plugin.GetVersions().split(',');
        var latest   = versions[0].split('=');
        return parseFloat(latest[1]);
      }
 
      if(plugin.version) return parseInt(plugin.version);
      return plugin.name
      
    }
    catch(e) {
      return null;
    }
  }
 
  //
  // The returned object
  // 
  return {
    browser:        getBrowserName(),
    acrobat:        isAcrobatInstalled() ? 'installed' : false,
    acrobatVersion: getAcrobatVersion()
  };
};
