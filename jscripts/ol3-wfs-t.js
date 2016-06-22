"use strict";

// Set LAMBERT PROJECTION - EPSG 31370
var def = "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs";
proj4.defs("EPSG:31370", def);
proj4.defs("http://www.opengis.net/gml/srs/epsg.xml#31370", def);

//===================================================================================================================

var layerVector = new ol.layer.Vector({
	source: new ol.source.Vector({
		loader: function(extent) {
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
				layerVector.getSource().addFeatures(features);
			});
		},
		strategy: ol.loadingstrategy.bbox
	})
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

//===================================================================================================================

var popup = document.getElementById('popup');

var overlayPopup = new ol.Overlay({
	element: popup
});

$('#popup-closer').on('click', function() {
	overlayPopup.setPosition(undefined);
});

var mapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var map = new ol.Map({
	target: 'map',
	overlays: [overlayPopup],
	//controls: [controlMousePosition],
	layers: [layerVector],
	view: new ol.View({
		projection: new ol.proj.Projection({
			code: 'EPSG:31370',
	 		units: 'm'
		}),
		center: [150000, 150000],
		zoom: 14
	})
});

var transactWFS = function(action, feature) {
	feature.set('DistrictName', "XXX");
	//feature.set('DistrictId', 12345);
	//feature.setGeometryName("DistrictGeo"); 
	var node;
	var formatWFS = new ol.format.WFS();
	var formatGML = new ol.format.GML({
		featureNS: 'http://bsr.ores.be/test01',
		featureType: 'Districts',
		srsName: 'EPSG:31370'
	});	
	switch(action) {
		case 'insert':
			node = formatWFS.writeTransaction([feature], null, null, formatGML);
			break;
		case 'update':
			node = formatWFS.writeTransaction(null, [feature], null, formatGML);
			break;
		case 'delete':
			node = formatWFS.writeTransaction(null, null, [feature], formatGML);
			break;
	}
	var serializer = new XMLSerializer();
	var str = serializer.serializeToString(node);
	str = str.replace("<geometry>", "<DistrictGeo>");
	str = str.replace("</geometry>", "</DistrictGeo>");
	$.ajax('http://localhost:9000/geoserver/test01/ows', {
		type: 'POST',
		dataType: 'xml',
		processData: false,
		contentType: 'text/xml',
		data: str
	}).done();
}


//hover highlight
var selectPointerMove = new ol.interaction.Select({
	condition: ol.events.condition.pointerMove
});

map.addInteraction(selectPointerMove);

var snap = new ol.interaction.Snap({
	source: layerVector.getSource()
});
map.addInteraction(snap);

var select = new ol.interaction.Select({
	style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: '#FF2828'
		})
	})
});

var interaction;
var dirty;

$('.btnMenu').on('click', function(event) {
	$('.btnMenu').removeClass('orange');
	$(this).addClass('orange');
	map.removeInteraction(interaction);
	select.getFeatures().clear();
	map.removeInteraction(select);
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
				props = e.element.getProperties();
				if (props.status){$('#popup-status').html(props.status);}else{$('#popup-status').html('n/a');}
				if (props.tiendas){$('#popup-tiendas').html(props.tiendas);}else{$('#popup-tiendas').html('n/a');}
				coord = $('.ol-mouse-position').html().split(',');
				overlayPopup.setPosition(coord);
			});
			break;
		case 'btnEdit':
			map.addInteraction(select);
			interaction = new ol.interaction.Modify({
				features: select.getFeatures()
			});
			map.addInteraction(interaction);
			dirty = [];
			select.getFeatures().on('add', function(e) {
				e.element.on('change', function(e) {
					dirty[e.target.getId()] = true;
				});
			});
			select.getFeatures().on('remove', function(e) {
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
				source: layerVector.getSource()
			});
			interaction.on('drawend', function(e) {
				transactWFS('insert', e.feature);
			});
			map.addInteraction(interaction);
			break;
		case 'btnDrawLine':
			interaction = new ol.interaction.Draw({
				type: 'LineString',
				source: layerVector.getSource()
			});
			interaction.on('drawend', function(e) {
				transactWFS('insert', e.feature);
			});
			map.addInteraction(interaction);
			break;
		case 'btnDrawPoly':
			interaction = new ol.interaction.Draw({
				type: 'Polygon',
				source: layerVector.getSource()
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
				layerVector.getSource().removeFeature(feature);
				interaction.getFeatures().clear();
				selectPointerMove.getFeatures().clear();
			});
			map.addInteraction(interaction);
			break;
		default:
			break;
	}
});

$('#btnZoomIn').on('click', function() {
	var view = map.getView();
	var newResolution = view.constrainResolution(view.getResolution(), 1);
	view.setResolution(newResolution);
});

$('#btnZoomOut').on('click', function() {
	var view = map.getView();
	var newResolution = view.constrainResolution(view.getResolution(), -1);
	view.setResolution(newResolution);
});

$('.btn-floating').hover(
	function() {
		$(this).addClass('darken-2');
	},
	function() {
		$(this).removeClass('darken-2');
	}
);
