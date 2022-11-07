var map, featureList, surakartaSearch = [], sukoharjoSearch = [], klatenSearch = [], karanganyarSearch = [], sragenSearch = [], boyolaliSearch = [], wonogiriSearch = [],  wisataSearch = [], wisatajogjaSearch = [], wisatajatimSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$('#blog-click').click(function () {
    $('#search-wrap #hidden-div').animate({'width': 'toggle'});
    $(this).toggleClass('clientsClose');
});
      
$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through wisata layer and add only features which are in the map bounds */
  wisata.eachLayer(function (layer) {
    if (map.hasLayer(wisataLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="assets/img/pin.png"></td><td class="feature-name">' + layer.feature.properties.Name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  wisatajogja.eachLayer(function (layer) {
    if (map.hasLayer(wisatajogjaLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="assets/img/pin.png"></td><td class="feature-name">' + layer.feature.properties.Name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  wisatajatim.eachLayer(function (layer) {
    if (map.hasLayer(wisatajatimLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="assets/img/pin.png"></td><td class="feature-name">' + layer.feature.properties.Name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});
var google = L.tileLayer('https://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}', {
  attribution: '<a href="https://maspannn.github.io" target="_blank">Mas Pannn</a>'
});

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var surakartaColors = {
  "Banjarsari":"#D9D387", 
  "Jebres":"#E8BB0A", 
  "Laweyan":"#BCDECA",
  "Pasar Kliwon":"#85C4CF",
  "Serengan":"#DF8DA9",
};

var surakarta = L.geoJson(null, {
  style: function (feature) {
    return {
      fillColor: surakartaColors[feature.properties.kecamatan],
      fillOpacity: 0.7,
      color: "gray",
      weight: 1,
      opacity: 1,
    };
  },
  onEachFeature: function (feature, layer) {
    var content = '<div class="mb-2"><b>Detail Administrasi</b></div><table class="table table-striped table-bordered table-sm">' +
      '<tr><th>Provinsi</th><td>' + feature.properties.provinsi + '</tr>' +
      '<tr><th>Kota</th><td>' + feature.properties.kabupaten + '</tr>' +
      '<tr><th>Kecamatan</th><td>' + feature.properties.kecamatan + '</tr>' +
      '<tr><th>Kelurahan</th><td>' + feature.properties.desa + '</tr>' +
      '<tr><th>Kode Kemendagri</th><td>' + feature.properties.kode_dagri + '</tr>' +
      '</table>' +
      '<small class="mt-3 text-primary">Sumber: <a class="link-success" href="http://Geoportal Provinsi.jatengprov.go.id/" target="_blank">Geoportal Provinsi Jawa Tengah</a></small>';
    layer.on({
      mouseover: function (e) { 
        var layer = e.target;
        layer.setStyle({ 
          weight: 1, 
          color: "gray", 
          opacity: 1,
          fillColor: "cyan",
          fillOpacity: 0.7, 
        });
        surakarta.bindTooltip("Kel. " + feature.properties.desa + ", Kec. " + feature.properties.kecamatan , {sticky: true});
      },
      mouseout: function (e) { 
        surakarta.resetStyle(e.target);
        map.closePopup();
      },
      click: function (e) {
        $("#feature-title").html("Kelurahan " + feature.properties.desa);
        $("#feature-info").html(content);
        $("#featureModal").modal("show");
        map.setView([e.latlng.lat, e.latlng.lng], 14);
      },
    });
  }
});
$.getJSON("data/surakarta.geojson", function (data) {
  surakarta.addData(data);
});

var sukoharjoColors = {
  "Bendosari":"#ADEDD2", 
  "Gatak":"#E9E27B", 
  "Mojolaban":"#76F6D7",
  "Baki":"#97EC84",
  "Kartasura":"#D4ED90",
  "Weru":"#D782F4",
  "Bulu":"#EF88AE",
  "Sukoharjo":"#F1B676",
  "Tawangsari":"#A47EF3",
  "Polokarto":"#F6B2D4",
  "Grogol":"#7AC3F4",
  "Nguter":"#7480F4",
};
var sukoharjo = L.geoJson(null, {
  style: function (feature) {
    return {
      fillColor: sukoharjoColors[feature.properties.kecamatan],
      fillOpacity: 0.7,
      color: "gray",
      weight: 1,
      opacity: 1,
    };
  },
  onEachFeature: function (feature, layer) {
    var content = '<table class="table table-striped table-bordered table-sm">' +
      '<tr><th>Provinsi</th><td>' + feature.properties.provinsi + '</tr>' +
      '<tr><th>Kabupaten</th><td>' + feature.properties.kabupaten + '</tr>' +
      '<tr><th>Kecamatan</th><td>' + feature.properties.kecamatan + '</tr>' +
      '<tr><th>Desa</th><td>' + feature.properties.desa + '</tr>' +
      '<tr><th>Kode Kemendagri</th><td>' + feature.properties.kode_dagri + '</tr>' +
      '</table>' +
      '<small class="text-primary">Sumber: Geoportal Provinsi Jawa Tengah</small>';
    layer.on({
      mouseover: function (e) { 
        var layer = e.target;
        layer.setStyle({ 
          weight: 1, 
          color: "gray", 
          opacity: 1,
          fillColor: "cyan",
          fillOpacity: 0.7, 
        });
        sukoharjo.bindTooltip("Desa " + feature.properties.desa + ", Kec. " + feature.properties.kecamatan , {sticky: true});
      },
      mouseout: function (e) { 
        sukoharjo.resetStyle(e.target);
        map.closePopup();
      },
      click: function (e) {
        $("#feature-title").html("Desa " + feature.properties.desa);
        $("#feature-info").html(content);
        $("#featureModal").modal("show");
        map.setView([e.latlng.lat, e.latlng.lng], 14);
      },
    });
  }
});

$.getJSON("data/sukoharjo.geojson", function (data) {
  sukoharjo.addData(data);
  map.fitBounds(sukoharjo.getBounds());
});

var klatenColors = {
  "Bayat":"#ADEDD2", 
  "Cawas":"#E9E27B", 
  "Ceper":"#76F6D7",
  "Delanggu":"#97EC84",
  "Gantiwarno":"#D4ED90",
  "Jatinom":"#D782F4",
  "Jogonalan":"#EF88AE",
  "Juwiring":"#F1B676",
  "Kalikotes":"#A47EF3",
  "Karanganom":"#F6B2D4",
  "Karangdowo":"#7AC3F4",
  "Karangnongko":"#7480F4",
  "Kebonarum":"#C71585",
  "Kemalang":"#8B4513",
  "Klaten Selatan":"#FFE4E1",
  "Klaten Tengah":"#B0C4DE",
  "Klaten Utara":"#F0FFF0",
  "Manisrenggo":"#483D8B",
  "Ngawen":"#00008B",
  "Pedan":"#5F9EA0",
  "Polanharjo":"#B0E0E6",
  "Prambanan":"#00FF00",
  "Trucuk":"#FF8C00",
  "Tulung":"#DC143C",
  "Wedi":"#800000",
  "Wonosari":"#FFFAFA",
};
var klaten = L.geoJson(null, {
  style: function (feature) {
    return {
      fillColor: klatenColors[feature.properties.kecamatan],
      fillOpacity: 0.7,
      color: "gray",
      weight: 1,
      opacity: 1,
    };
  },
  onEachFeature: function (feature, layer) {
    var content = '<table class="table table-striped table-bordered table-sm">' +
      '<tr><th>Provinsi</th><td>' + feature.properties.provinsi + '</tr>' +
      '<tr><th>Kabupaten</th><td>' + feature.properties.kabupaten + '</tr>' +
      '<tr><th>Kecamatan</th><td>' + feature.properties.kecamatan + '</tr>' +
      '<tr><th>Desa</th><td>' + feature.properties.desa + '</tr>' +
      '<tr><th>Kode Kemendagri</th><td>' + feature.properties.kode_dagri + '</tr>' +
      '</table>' +
      '<small class="text-primary">Sumber: Geoportal Provinsi Jawa Tengah</small>';
    layer.on({
      mouseover: function (e) { 
        var layer = e.target;
        layer.setStyle({ 
          weight: 1, 
          color: "gray", 
          opacity: 1,
          fillColor: "cyan",
          fillOpacity: 0.7, 
        });
        klaten.bindTooltip("Desa " + feature.properties.desa + ", Kec. " + feature.properties.kecamatan , {sticky: true});
      },
      mouseout: function (e) { 
        klaten.resetStyle(e.target);
        map.closePopup();
      },
      click: function (e) {
        $("#feature-title").html("Desa " + feature.properties.desa);
        $("#feature-info").html(content);
        $("#featureModal").modal("show");
        map.setView([e.latlng.lat, e.latlng.lng], 14);
      },
    });
  }
});

$.getJSON("data/klaten.geojson", function (data) {
  klaten.addData(data);
});

var karanganyarColors = {
  "Colomadu":"#ADEDD2", 
  "Gondangrejo":"#E9E27B", 
  "Jaten":"#76F6D7",
  "Jatipuro":"#97EC84",
  "Jatiyoso":"#D4ED90",
  "Jenawi":"#D782F4",
  "Jumantono":"#EF88AE",
  "Jumapolo":"#F1B676",
  "Karanganyar":"#A47EF3",
  "Karangpandan":"#F6B2D4",
  "Kebakkramat":"#7AC3F4",
  "Kerjo":"#7480F4",
  "Matesih":"#C71585",
  "Mojogedang":"#8B4513",
  "Ngargoyoso":"#FFE4E1",
  "Tasikmadu":"#B0C4DE",
  "Tawangmangu":"#F0FFF0",
};
var karanganyar = L.geoJson(null, {
  style: function (feature) {
    return {
      fillColor: karanganyarColors[feature.properties.kecamatan],
      fillOpacity: 0.7,
      color: "gray",
      weight: 1,
      opacity: 1,
    };
  },
  onEachFeature: function (feature, layer) {
    var content = '<table class="table table-striped table-bordered table-sm">' +
      '<tr><th>Provinsi</th><td>' + feature.properties.provinsi + '</tr>' +
      '<tr><th>Kabupaten</th><td>' + feature.properties.kabupaten + '</tr>' +
      '<tr><th>Kecamatan</th><td>' + feature.properties.kecamatan + '</tr>' +
      '<tr><th>Desa</th><td>' + feature.properties.desa + '</tr>' +
      '<tr><th>Kode Kemendagri</th><td>' + feature.properties.kode_dagri + '</tr>' +
      '</table>' +
      '<small class="text-primary">Sumber: Geoportal Provinsi Jawa Tengah</small>';
    layer.on({
      mouseover: function (e) { 
        var layer = e.target;
        layer.setStyle({ 
          weight: 1, 
          color: "gray", 
          opacity: 1,
          fillColor: "cyan",
          fillOpacity: 0.7, 
        });
        karanganyar.bindTooltip("Desa " + feature.properties.desa + ", Kec. " + feature.properties.kecamatan , {sticky: true});
      },
      mouseout: function (e) { 
        karanganyar.resetStyle(e.target);
        map.closePopup();
      },
      click: function (e) {
        $("#feature-title").html("Desa " + feature.properties.desa);
        $("#feature-info").html(content);
        $("#featureModal").modal("show");
        map.setView([e.latlng.lat, e.latlng.lng], 14);
      },
    });
  }
});

$.getJSON("data/karanganyar.geojson", function (data) {
  karanganyar.addData(data);
});

var sragenColors = {
  "Gemolong":"#ADEDD2", 
  "Gesi":"#E9E27B", 
  "Gondang":"#76F6D7",
  "Jenar":"#97EC84",
  "Kalijambe":"#D4ED90",
  "Karangmalang":"#D782F4",
  "Kedawung":"#EF88AE",
  "Masaran":"#F1B676",
  "Miri":"#A47EF3",
  "Mondokan":"#F6B2D4",
  "Ngrampal":"#7AC3F4",
  "Plupuh":"#7480F4",
  "Sambirejo":"#C71585",
  "Sambungmacan":"#8B4513",
  "Sidoharjo":"#FFE4E1",
  "Sragen":"#B0C4DE",
  "Sukodono":"#F0FFF0",
  "Sumberlawang":"#DC143C",
  "Tangen":"#800000",
  "Tanon":"#FFFAFA",
};
var sragen = L.geoJson(null, {
  style: function (feature) {
    return {
      fillColor: sragenColors[feature.properties.kecamatan],
      fillOpacity: 0.7,
      color: "gray",
      weight: 1,
      opacity: 1,
    };
  },
  onEachFeature: function (feature, layer) {
    var content = '<table class="table table-striped table-bordered table-sm">' +
      '<tr><th>Provinsi</th><td>' + feature.properties.provinsi + '</tr>' +
      '<tr><th>Kabupaten</th><td>' + feature.properties.kabupaten + '</tr>' +
      '<tr><th>Kecamatan</th><td>' + feature.properties.kecamatan + '</tr>' +
      '<tr><th>Desa</th><td>' + feature.properties.desa + '</tr>' +
      '<tr><th>Kode Kemendagri</th><td>' + feature.properties.kode_dagri + '</tr>' +
      '</table>' +
      '<small class="text-primary">Sumber: Geoportal Provinsi Jawa Tengah</small>';
    layer.on({
      mouseover: function (e) { 
        var layer = e.target;
        layer.setStyle({ 
          weight: 1, 
          color: "gray", 
          opacity: 1,
          fillColor: "cyan",
          fillOpacity: 0.7, 
        });
        sragen.bindTooltip("Desa " + feature.properties.desa + ", Kec. " + feature.properties.kecamatan , {sticky: true});
      },
      mouseout: function (e) { 
        sragen.resetStyle(e.target);
        map.closePopup();
      },
      click: function (e) {
        $("#feature-title").html("Desa " + feature.properties.desa);
        $("#feature-info").html(content);
        $("#featureModal").modal("show");
        map.setView([e.latlng.lat, e.latlng.lng], 14);
      },
    });
  }
});

$.getJSON("data/sragen.geojson", function (data) {
  sragen.addData(data);
});

var boyolaliColors = {
  "Ampel":"#ADEDD2", 
  "Andong":"#E9E27B", 
  "Banyudono":"#76F6D7",
  "Boyolali":"#97EC84",
  "Cepogo":"#D4ED90",
  "Juwangi":"#D782F4",
  "Karanggede":"#EF88AE",
  "Kemusu":"#F1B676",
  "Klego":"#A47EF3",
  "Mojosongo":"#F6B2D4",
  "Musuk":"#7AC3F4",
  "Ngemplak":"#7480F4",
  "Nogosari":"#C71585",
  "Sambi":"#8B4513",
  "Sawit":"#FFE4E1",
  "Selo":"#B0C4DE",
  "Simo":"#F0FFF0",
  "Teras":"#483D8B",
  "Wonosegoro":"#00008B",
};
var boyolali = L.geoJson(null, {
  style: function (feature) {
    return {
      fillColor: boyolaliColors[feature.properties.kecamatan],
      fillOpacity: 0.7,
      color: "gray",
      weight: 1,
      opacity: 1,
    };
  },
  onEachFeature: function (feature, layer) {
    var content = '<table class="table table-striped table-bordered table-sm">' +
      '<tr><th>Provinsi</th><td>' + feature.properties.provinsi + '</tr>' +
      '<tr><th>Kabupaten</th><td>' + feature.properties.kabupaten + '</tr>' +
      '<tr><th>Kecamatan</th><td>' + feature.properties.kecamatan + '</tr>' +
      '<tr><th>Desa</th><td>' + feature.properties.desa + '</tr>' +
      '<tr><th>Kode Kemendagri</th><td>' + feature.properties.kode_dagri + '</tr>' +
      '</table>' +
      '<small class="text-primary">Sumber: Geoportal Provinsi Jawa Tengah</small>';
    layer.on({
      mouseover: function (e) { 
        var layer = e.target;
        layer.setStyle({ 
          weight: 1, 
          color: "gray", 
          opacity: 1,
          fillColor: "cyan",
          fillOpacity: 0.7, 
        });
        boyolali.bindTooltip("Desa " + feature.properties.desa + ", Kec. " + feature.properties.kecamatan , {sticky: true});
      },
      mouseout: function (e) { 
        boyolali.resetStyle(e.target);
        map.closePopup();
      },
      click: function (e) {
        $("#feature-title").html("Desa " + feature.properties.desa);
        $("#feature-info").html(content);
        $("#featureModal").modal("show");
        map.setView([e.latlng.lat, e.latlng.lng], 14);
      },
    });
  }
});

$.getJSON("data/boyolali.geojson", function (data) {
  boyolali.addData(data);
});

var wonogiriColors = {
  "Baturetno":"#ADEDD2", 
  "Batuwarno":"#E9E27B", 
  "Bulukerto":"#76F6D7",
  "Eromoko":"#97EC84",
  "Girimarto":"#D4ED90",
  "Giritontro":"#D782F4",
  "Giriwoyo":"#EF88AE",
  "Jatipurno":"#F1B676",
  "Jatiroto":"#A47EF3",
  "Jatisrono":"#F6B2D4",
  "Kismantoro":"#7AC3F4",
  "Manyaran":"#7480F4",
  "Ngadirojo":"#C71585",
  "Nguntoronadi":"#8B4513",
  "Paranggupito":"#FFE4E1",
  "Pracimantoro":"#B0C4DE",
  "Puhpelem":"#F0FFF0",
  "Purwantoro":"#483D8B",
  "Selogiri":"#00008B",
  "Sidoarjo":"#5F9EA0",
  "Slogohimo":"#B0E0E6",
  "Tirtomoyo":"#00FF00",
  "Wonogiri":"#FF8C00",
  "Wuryantoro":"#DC143C",
  "Karangtengah":"#800000",
};

var wonogiri = L.geoJson(null, {
  style: function (feature) {
    return {
      fillColor: wonogiriColors[feature.properties.kecamatan],
      fillOpacity: 0.7,
      color: "gray",
      weight: 1,
      opacity: 1,
    };
  },
  onEachFeature: function (feature, layer) {
    var content = '<table class="table table-striped table-bordered table-sm">' +
      '<tr><th>Provinsi</th><td>' + feature.properties.provinsi + '</tr>' +
      '<tr><th>Kabupaten</th><td>' + feature.properties.kabupaten + '</tr>' +
      '<tr><th>Kecamatan</th><td>' + feature.properties.kecamatan + '</tr>' +
      '<tr><th>Desa</th><td>' + feature.properties.desa + '</tr>' +
      '<tr><th>Kode Kemendagri</th><td>' + feature.properties.kode_dagri + '</tr>' +
      '</table>' +
      '<small class="text-primary">Sumber: Geoportal Provinsi Jawa Tengah</small>';
    layer.on({
      mouseover: function (e) { 
        var layer = e.target;
        layer.setStyle({ 
          weight: 1, 
          color: "gray", 
          opacity: 1,
          fillColor: "cyan",
          fillOpacity: 0.7, 
        });
        wonogiri.bindTooltip("Desa " + feature.properties.desa + ", Kec. " + feature.properties.kecamatan , {sticky: true});
      },
      mouseout: function (e) { 
        wonogiri.resetStyle(e.target);
        map.closePopup();
      },
      click: function (e) {
        $("#feature-title").html("Desa " + feature.properties.desa);
        $("#feature-info").html(content);
        $("#featureModal").modal("show");
        map.setView([e.latlng.lat, e.latlng.lng], 14);
      },
    });
  }
});

$.getJSON("data/wonogiri.geojson", function (data) {
  wonogiri.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove wisata to markerClusters layer */
var wisataLayer = L.geoJson(null);
var wisata = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/pin.png",
        iconSize: [24, 24],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = feature.properties.Description + "<div class='mb-2'><b>Detail POI</b></div><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.Name + "</td></tr><table><hr style='visibility:hidden'><div class='mb-2'><b>Rute</b></div><a href='https://www.google.com/maps/dir/?api=1&destination=" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "' target='_blank' class='btn btn-info' title='Google Maps'>Google Maps</a>&nbsp;&nbsp<a href='http://maps.google.com/maps?q=&layer=c&cbll=" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "' target='_blank' class='btn btn-info' title='Google Street View'>Street View</a>";
      layer.on({
        click: function (e) {
          $("#feature-title-wisata").html(feature.properties.Name);
          $("#feature-lat").html(feature.geometry.coordinates[1]);
          $("#feature-long").html(feature.geometry.coordinates[0]);
          $("#feature-info-wisata").html(content);
          $("#featureModalWisata").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="assets/img/pin.png"></td><td class="feature-name">' + layer.feature.properties.Name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      wisataSearch.push({
        name: layer.feature.properties.Name,
        source: "Jateng",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/wisatajateng.geojson", function (data) {
  wisata.addData(data);
  map.addLayer(wisataLayer);
});

var wisatajogjaLayer = L.geoJson(null);
var wisatajogja = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/pin.png",
        iconSize: [24, 24],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = feature.properties.Description + "<div class='mb-2'><b>Detail POI</b></div><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.Name + "</td></tr><table><hr style='visibility:hidden'><div class='mb-2'><b>Rute</b></div><a href='https://www.google.com/maps/dir/?api=1&destination=" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "' target='_blank' class='btn btn-info' title='Google Maps'>Google Maps</a>&nbsp;&nbsp<a href='http://maps.google.com/maps?q=&layer=c&cbll=" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "' target='_blank' class='btn btn-info' title='Google Street View'>Street View</a>";
      layer.on({
        click: function (e) {
          $("#feature-title-wisata").html(feature.properties.Name);
          $("#feature-lat").html(feature.geometry.coordinates[1]);
          $("#feature-long").html(feature.geometry.coordinates[0]);
          $("#feature-info-wisata").html(content);
          $("#featureModalWisata").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="assets/img/pin.png"></td><td class="feature-name">' + layer.feature.properties.Name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      wisatajogjaSearch.push({
        name: layer.feature.properties.Name,
        source: "Jogja",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/wisatajogja.geojson", function (data) {
  wisatajogja.addData(data);
  map.addLayer(wisatajogjaLayer);
});

var wisatajatimLayer = L.geoJson(null);
var wisatajatim = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/pin.png",
        iconSize: [24, 24],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = feature.properties.Description + "<div class='mb-2'><b>Detail POI</b></div><table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.Name + "</td></tr><table><hr style='visibility:hidden'><div class='mb-2'><b>Rute</b></div><a href='https://www.google.com/maps/dir/?api=1&destination=" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "' target='_blank' class='btn btn-info' title='Google Maps'>Google Maps</a>&nbsp;&nbsp<a href='http://maps.google.com/maps?q=&layer=c&cbll=" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "' target='_blank' class='btn btn-info' title='Google Street View'>Street View</a>";
      layer.on({
        click: function (e) {
          $("#feature-title-wisata").html(feature.properties.Name);
          $("#feature-lat").html(feature.geometry.coordinates[1]);
          $("#feature-long").html(feature.geometry.coordinates[0]);
          $("#feature-info-wisata").html(content);
          $("#featureModalWisata").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="assets/img/pin.png"></td><td class="feature-name">' + layer.feature.properties.Name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      wisatajatimSearch.push({
        name: layer.feature.properties.Name,
        source: "Jatim",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/wisatajatim.geojson", function (data) {
  wisatajatim.addData(data);
  map.addLayer(wisatajatimLayer);
});

var agustus22 = new L.LayerGroup();
var pchags22 = L.tileLayer.wms('http://hidromet.sih3.bmkg.go.id/geoserver/sipitung/wms?', {
          layers: 'sipitung:PCH_0822_ver05_20220519135812',
          tiled: true,
          format: 'image/png',
          transparent: true,
          maxZoom: 16,
          minZoom: 0,
          continuousWorld: true
      }).addTo(agustus22);

map = L.map("map", {
  zoom: 12,
  center: [-7.56667, 110.81667],
  layers: [cartoLight, surakarta, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === wisataLayer) {
    markerClusters.addLayer(wisata);
    syncSidebar();
  }
  if (e.layer === wisatajogjaLayer) {
    markerClusters.addLayer(wisatajogja);
    syncSidebar();
  }
  if (e.layer === wisatajatimLayer) {
    markerClusters.addLayer(wisatajatim);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === wisataLayer) {
    markerClusters.removeLayer(wisata);
    syncSidebar();
  }
  if (e.layer === wisatajogjaLayer) {
    markerClusters.removeLayer(wisatajogja);
    syncSidebar();
  }
  if (e.layer === wisatajatimLayer) {
    markerClusters.removeLayer(wisatajatim);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/*var info = L.control();
info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};
info.update = function (props) {
	this._div.innerHTML = '<form role="search"><div class="form-group has-feedback"><input id="searchbox" type="text" placeholder="Cari POI" class="form-control"><span id="searchicon" class="fa fa-search form-control-feedback" style="display:none"></span></div></form>';
};
info.addTo(map);*/

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://www.github.com/maspannn'>Mas Pannn</a>";
  return div;
};
map.addControl(attributionControl);

var zoomHome = L.Control.zoomHome({
    position: 'bottomright'
});
zoomHome.addTo(map);

map.addControl(new L.Control.Fullscreen({
    title: {
      'false': 'View Fullscreen',
      'true': 'Exit Fullscreen'
      },
    position: 'bottomright'
}));

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control
  .locate({
    position: "bottomright",
    drawCircle: true,
    follow: true,
    setView: true,
    keepCurrentZoomLevel: true,
    markerStyle: {
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.8,
    },
    circleStyle: {
      weight: 1,
      clickable: false,
    },
    icon: "fa fa-crosshairs",
    metric: true,
    strings: {
      title: "Lokasi Anda",
      popup: "Lokasi Anda sekarang di sini<br>Akurasi {distance} {unit}",
      outsideMapBoundsMsg: "Sepertinya Anda berada di luar batas Peta.",
    },
    locateOptions: {
      maxZoom: 18,
      watch: true,
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000,
    },
  })
  .addTo(map);

L.control.betterscale({
  metric:true, 
  imperial: false
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Carto Light": cartoLight,
  "Street Map": google
};

var groupedOverlays = {
  "<hr><h6>Points of Interest</h6>": {
    "Wisata Jawa Tengah": wisataLayer,
    "Wisata Jawa Timur": wisatajatimLayer,
    "Wisata DI Yogyakarta": wisatajogjaLayer,
  },
  "<h6>Admin Jawa Tengah<h6>": {
    "Kota Surakarta": surakarta,
    "Kabupaten Sukoharjo": sukoharjo,
    "Kabupaten Klaten": klaten,
    "Kabupaten Karanganyar": karanganyar,
    "Kabupaten Boyolali": boyolali,
    "Kabupaten Sragen": sragen,
    "Kabupaten Wonogiri": wonogiri,
  },
   "<hr><h6>Informasi Cuaca</h6>": {
    "Prakiraan CH Agustus 2022": agustus22,
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});
$("#featureModalWisata").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to surakarta bounds */
  map.fitBounds(surakarta.getBounds());
  map.fitBounds(sukoharjo.getBounds());
  map.fitBounds(klaten.getBounds());
  map.fitBounds(karanganyar.getBounds());
  map.fitBounds(sragen.getBounds());
  map.fitBounds(boyolali.getBounds());
  map.fitBounds(wonogiri.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var surakartaBH = new Bloodhound({
    name: "Surakarta",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: surakartaSearch,
    limit: 10
  });
  
  var sukoharjoBH = new Bloodhound({
    name: "Sukoharjo",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: sukoharjoSearch,
    limit: 10
  });
  
  var klatenBH = new Bloodhound({
    name: "Klaten",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: klatenSearch,
    limit: 10
  });
  
  var karanganyarBH = new Bloodhound({
    name: "Karanganyar",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: karanganyarSearch,
    limit: 10
  });
  
  var sragenBH = new Bloodhound({
    name: "Sragen",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: sragenSearch,
    limit: 10
  });
  
  var boyolaliBH = new Bloodhound({
    name: "Boyolali",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boyolaliSearch,
    limit: 10
  });
  
  var wonogiriBH = new Bloodhound({
    name: "Wonogiri",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: wonogiriSearch,
    limit: 10
  });

  var wisataBH = new Bloodhound({
    name: "Wisata Jawa Tengah",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: wisataSearch,
    limit: 10
  });
  
  var wisatajogjaBH = new Bloodhound({
    name: "Wisata Jogja",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: wisatajogjaSearch,
    limit: 10
  });
  
  var wisatajatimBH = new Bloodhound({
    name: "Jatim",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: wisatajatimSearch,
    limit: 10
  });
  
  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=ID&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa fa-search").addClass("fas fa-sync fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fas fa-sync fa-spin").addClass("fa fa-search");
        }
      }
    },
    limit: 10
  });
  surakartaBH.initialize();
  sukoharjoBH.initialize();
  klatenBH.initialize();
  karanganyarBH.initialize();
  sragenBH.initialize();
  boyolaliBH.initialize();
  wonogiriBH.initialize();
  wisataBH.initialize();
  wisatajogjaBH.initialize();
  wisatajatimBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Surakarta",
    displayKey: "name",
    source: surakartaBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Kota Surakarta</h4>"
    }
  }, {
    name: "Sukoharjo",
    displayKey: "name",
    source: sukoharjoBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Kabupaten Sukoharjo</h4>"
    }
  },
  {
    name: "Klaten",
    displayKey: "name",
    source: klatenBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Kabupaten Klaten</h4>"
    }
  },
  {
    name: "Karanganyar",
    displayKey: "name",
    source: karanganyarBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Kabupaten Karanganyar</h4>"
    }
  },
  {
    name: "Sragen",
    displayKey: "name",
    source: sragenBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Kabupaten Sragen</h4>"
    }
  },
  {
    name: "Boyolali",
    displayKey: "name",
    source: boyolaliBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Kabupaten Boyolali</h4>"
    }
  },
  {
    name: "Wonogiri",
    displayKey: "name",
    source: wonogiriBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Kabupaten Wonogiri</h4>"
    }
  },
  {
    name: "Jateng",
    displayKey: "name",
    source: wisataBH.ttAdapter(),
    templates: {
      header: "<h6 class='typeahead-header'><img src='assets/img/pin.png' width='24' height='24'>&nbsp;Wisata Jawa Tengah</h6>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Jatim",
    displayKey: "name",
    source: wisatajatimBH.ttAdapter(),
    templates: {
      header: "<h6 class='typeahead-header'><img src='assets/img/pin.png' width='24' height='24'>&nbsp;Wisata Jawa Timur</h6>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Jogja",
    displayKey: "name",
    source: wisatajogjaBH.ttAdapter(),
    templates: {
      header: "<h6 class='typeahead-header'><img src='assets/img/pin.png' width='24' height='24'>&nbsp;Wisata DI Yogyakarta</h6>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },
  {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h6 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h6>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Surakarta") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Sukoharjo") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Klaten") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Karanganyar") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Sragen") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Boyolali") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Wonogiri") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Jateng") {
      if (!map.hasLayer(wisataLayer)) {
        map.addLayer(wisataLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Jogja") {
      if (!map.hasLayer(wisatajogjaLayer)) {
        map.addLayer(wisatajogjaLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Jatim") {
      if (!map.hasLayer(wisatajatimLayer)) {
        map.addLayer(wisatajatimLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}