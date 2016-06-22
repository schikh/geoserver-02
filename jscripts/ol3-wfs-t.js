"use strict";

configureLambertProjection();
var backgroundMapLayer = createBackgroundMapLayer();
var vectorLayer = createVectorLayer();
var overlayPopup = createOverlayAttributesPopup();
var mousePositionControl = createMousePositionControl();

var map = new ol.Map({
	target: 'map',
	overlays: [overlayPopup],
	controls: [mousePositionControl],
	layers: [backgroundMapLayer, vectorLayer],
	view: new ol.View({
		projection: new ol.proj.Projection({
			code: 'EPSG:31370',
	 		units: 'm'
		}),
		center: [150000, 150000],
		zoom: 14
	})
});

var snapInteration = createSnapInteration(vectorLayer);
map.addInteraction(snapInteration);
var selectPointerMove = createSelectOnPointerHoverInteraction();
map.addInteraction(selectPointerMove);
var selectInterationOnEdit = createSelectForEditInteration();
addFloatingButtonsDynamicStyle();
addChangeResolutionOnZoomButtonsClick();

function configureLambertProjection() {
	// Set LAMBERT PROJECTION - EPSG 31370
	var def = "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs";
	proj4.defs("EPSG:31370", def);
	proj4.defs("http://www.opengis.net/gml/srs/epsg.xml#31370", def);
}

function createVectorLayer() {
	var vectorLayer =  new ol.layer.Vector({
		source: new ol.source.Vector({
			loader: queryVectorFeaturesService,
			//strategy: ol.loadingstrategy.bbox
			strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
				maxZoom: 20
			}))			
		})
	});
	return vectorLayer;
}

function queryVectorFeaturesService(extent) {
	$.ajax('http://localhost:9000/geoserver/test01/ows?service=WFS', {
		type: 'GET',
		data: {
			service: 'WFS',
			version: '1.1.0',
			request: 'GetFeature',
			typename: 'test01:Districts',
			srsname: 'EPSG:31370',
			bbox: extent.join(',') + ',EPSG:31370'
		}
	}).done(function(response) {
		var formatWFS = new ol.format.WFS();
		var features = formatWFS.readFeatures(response);
		vectorLayer.getSource().addFeatures(features);
	}).fail(function(jqXHR, textStatus) {
		alert('WFS query error:' + textStatus);
	});
}

function GetWfsCommand(action, feature) {
	var addedFeatures, updatedFeatures, deletedFeatures;
	switch(action) {
		case 'insert':
			addedFeatures = [feature];
			break;
		case 'update':
			updatedFeatures = [feature];
			break;
		case 'delete':
			deletedFeatures = [feature];
			break;
	}
	var gmlFormat = new ol.format.GML({
		featureNS: 'http://bsr.ores.be/test01',
		featureType: 'Districts',
		srsName: 'EPSG:31370'
	});	
	var wfsFormat = new ol.format.WFS();
	var command = wfsFormat.writeTransaction(addedFeatures, updatedFeatures, deletedFeatures, gmlFormat);
	return command;
}

function postVectorFeaturesCommand(commandText) {
	$.ajax('http://localhost:9000/geoserver/test01/ows', {
		type: 'POST',
		dataType: 'xml',
		processData: false,
		contentType: 'text/xml',
		data: commandText
	}).done(function(response) {
		var formatWFS = new ol.format.WFS();
		var r = formatWFS.readTransactionResponse(response);		
		if(r.transactionSummary.totalDeleted !== 1  
			&& r.transactionSummary.totalInserted !== 1
			&& r.transactionSummary.totalUpdated !== 1) {
				alert('WFS Transaction error' + JSON.stringify(r.transactionSummary));
		}
	}).fail(function(jqXHR, textStatus) {
		alert('WFS Transaction error:' + textStatus);
  	});
}

function transactWFS(action, feature) {
	feature.set('DistrictName', "XXX");
	//feature.set('DistrictId', 12345);
	//feature.setGeometryName("DistrictGeo"); 
    var command = GetWfsCommand(action, feature);
	var serializer = new XMLSerializer();
	var commandText = serializer.serializeToString(command);
	commandText = commandText.replace("<geometry>", "<DistrictGeo>");
	commandText = commandText.replace("</geometry>", "</DistrictGeo>");
    postVectorFeaturesCommand(commandText);
}
function createBackgroundMapLayer() {
	var layer = new ol.layer.Tile({
		source: new ol.source.OSM()
	});
	layer.setOpacity(.3);
	return layer;
}

function createOverlayAttributesPopup() {
	var popup = document.getElementById('popup');
	var overlayPopup = new ol.Overlay({
		element: popup
	});
	$('#popup-closer').on('click', function() {
		overlayPopup.setPosition(undefined);
	});
	return overlayPopup;
}

function createMousePositionControl() {
	return new ol.control.MousePosition({
		coordinateFormat: ol.coordinate.createStringXY(4),
	})	
}

function createSnapInteration(layer) {
	return new ol.interaction.Snap({
		source: layer.getSource()
	});
}

function createSelectOnPointerHoverInteraction() {
	return new ol.interaction.Select({
		condition: ol.events.condition.pointerMove
	});
}

function createSelectForEditInteration() {
	return new ol.interaction.Select({
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: '#FF0000'
			})
		})
	});
}

function addChangeResolutionOnZoomButtonsClick() {
	$('#btnZoomIn,#btnZoomOut').on('click', function() {
		var view = map.getView();
		var newResolution = view.constrainResolution(view.getResolution(), -1);
		view.setResolution(newResolution);
	});
}

function addFloatingButtonsDynamicStyle() {
	$('.btn-floating').hover(
		function() {
			$(this).addClass('darken-2');
		},
		function() {
			$(this).removeClass('darken-2');
		}
	);
}

//===================================================================================================================

var interaction;
var dirty;

$('.btnMenu').on('click', function(event) {
	$('.btnMenu').removeClass('orange');
	$(this).addClass('orange');
	map.removeInteraction(interaction);
	selectInterationOnEdit.getFeatures().clear();
	map.removeInteraction(selectInterationOnEdit);
	switch($(this).attr('id')) {
		case 'btnSelect':
			interaction = new ol.interaction.Select({
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#f50057', 
						width: 2
					})
				})
			});
			map.addInteraction(interaction);
			interaction.getFeatures().on('add', function(e) {
				var props = e.element.getProperties();
				$('#popup-id').html(e.element.getId());
				$('#popup-name').html(props.DistrictName);
				var coord = $('.ol-mouse-position').html().split(',');
				overlayPopup.setPosition(coord);
			});
			break;
		case 'btnEdit':
			map.addInteraction(selectInterationOnEdit);
			interaction = new ol.interaction.Modify({
				features: selectInterationOnEdit.getFeatures()
			});
			map.addInteraction(interaction);
			dirty = [];
			selectInterationOnEdit.getFeatures().on('add', function(e) {
				e.element.on('change', function(e) {
					dirty[e.target.getId()] = true;
				});
			});
			selectInterationOnEdit.getFeatures().on('remove', function(e) {
				var f = e.element;
				if (dirty[f.getId()]) {
					delete dirty[f.getId()];
					var featureProperties = f.getProperties();
					delete featureProperties.boundedBy;
					var clone = new ol.Feature(featureProperties);
					clone.setId(f.getId());
					transactWFS('update', clone);
				}
			});
			break;
		case 'btnDrawPoint':
			interaction = new ol.interaction.Draw({
				type: 'Point',
				source: vectorLayer.getSource()
			});
			interaction.on('drawend', function(e) {
				transactWFS('insert', e.feature);
			});
			map.addInteraction(interaction);
			break;
		case 'btnDrawLine':
			interaction = new ol.interaction.Draw({
				type: 'LineString',
				source: vectorLayer.getSource()
			});
			interaction.on('drawend', function(e) {
				transactWFS('insert', e.feature);
			});
			map.addInteraction(interaction);
			break;
		case 'btnDrawPoly':
			interaction = new ol.interaction.Draw({
				type: 'Polygon',
				source: vectorLayer.getSource()
			});
			interaction.on('drawend', function(e) {
				transactWFS('insert', e.feature);
			});
			map.addInteraction(interaction);
			break;
		case 'btnDelete':
			interaction = new ol.interaction.Select();
			interaction.getFeatures().on('change:length', function(e) {
				var feature = interaction.getFeatures().item(0);
				if(!feature) return;
				transactWFS('delete', feature);
				vectorLayer.getSource().removeFeature(feature);
				interaction.getFeatures().clear();
				selectPointerMove.getFeatures().clear();
			});
			map.addInteraction(interaction);
			break;
		default:
			break;
	}
});

// json ===================================================================================================================

// var sourceVector = new ol.source.Vector({
// 	loader: function(extent) {
// 		var url = 'http://localhost:9000/geoserver/test01/ows?service=WFS&' +
//              'version=2.0.0&request=GetFeature&typename=test01:Districts&' +
//              'outputFormat=application/json&srsname=EPSG:31370&' +
//              'bbox=' + extent.join(',') + ',EPSG:31370';
// 		$.ajax({
// 			url: url
// 		}).done(function(response) {
// 				var formatWFS = new ol.format.GeoJSON();
// 				//var formatWFS = new ol.format.WFS();
// 				var features = formatWFS.readFeatures(response);
// 				console.log(features);
// 				sourceVector.addFeatures(features);
// 			});
// 	},
// 	strategy: function() {
// 		return [[14637.25, 22608.21,291015.29 ,246424.28]];
// 	}
// });

// no code ===================================================================================================================

// var sourceVector = new ol.source.Vector({
//     format: new ol.format.GeoJSON(),
//     url: function(extent) {
//         return 'http://localhost:9000/geoserver/test01/ows?service=WFS&' +
//             'version=2.0.0&request=GetFeature&typename=test01:Districts&' +
//             'outputFormat=application/json&srsname=EPSG:31370&' +
//             'bbox=' + extent.join(',') + ',EPSG:31370'; 
//     },
//     // strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
//     //     maxZoom: 10
//     // })),
// 	 projection: belgianProjection,
// 	 strategy: function() {
// 	 	return [[14637.25, 22608.21, 291015.29, 246424.28]];
// 	 }	
// });

// jsonp ===================================================================================================================

// var sourceVector = new ol.source.Vector({
// 	format: new ol.format.GeoJSON(),
// 	loader: function(extent, resolution, projection) {
// 		var url = 'http://localhost:9000/geoserver/test01/ows?service=WFS&' +
// 			'version=2.0.0&request=GetFeature&typename=test01:Districts&' +
// 			'outputFormat=text/javascript&format_options=callback:loadFeaturesFixed&srsname=EPSG:31370&' +
// 			'bbox=' + extent.join(',') + ',EPSG:31370'; 
// 		$.ajax({
// 			url: url,
// 			dataType: 'jsonp'
// 		});
// 	},
// 	strategy: function() {
// 		return [ [0, 0, 250000, 250000] ];
// 	},
// 	//projection: 'EPSG:31370'
// 	projection: belgianProjection
// });

// // Executed when data is loaded by the $.ajax method.
// var loadFeaturesFixed = function(response) {
// 	console.log(response);
// 	sourceVector.addFeatures(sourceVector.readFeatures(response));
// };	