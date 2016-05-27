var liveData = [];
var availableDocks = [];
var availableBikes = [];
var demandPrediction = [];
var cityName = '';
var refreshTime = [];
var sanJoseAvability = [];
var sanFranciscoAvability = [];
var paloAltoAvability = [];
var mountainViewAvability = [];
var redWoodCityAvability = [];
$(function() {
  requestData(cityName);
});

setInterval(function() {
  requestData(cityName);
}, 60000);

function showRentedBikes() {
  clearCssStack();
  document.getElementById("realtime1").classList.remove("hideMe");
  document.getElementById("realtime1").classList.add("displayMe");
  window.resizeBy(-20, -20);
  //  alert("window resized");

}

function showDocs() {
  clearCssStack();
  document.getElementById("realtime3").classList.remove("hideMe");
  document.getElementById("realtime3").classList.add("displayMe");
  //  alert("window resized");

}

function showBikes() {
  clearCssStack();
  document.getElementById("realtime4").classList.remove("hideMe");
  document.getElementById("realtime4").classList.add("displayMe");
  // alert("window resized");
}

function showDemand() {
  clearCssStack();
  document.getElementById("realtime2").classList.remove("hideMe");
  document.getElementById("realtime2").classList.add("displayMe");
  window.resizeBy(-20, -20);
  // alert("window resized");

}

function clearCssStack() {
  //
  document.getElementById("realtime1").classList.remove("hideMe");
  document.getElementById("realtime2").classList.remove("hideMe"); //dp
  document.getElementById("realtime3").classList.remove("hideMe"); //ad
  document.getElementById("realtime4").classList.remove("hideMe"); //sb
  //
  document.getElementById("realtime1").classList.remove("hideMe");
  document.getElementById("realtime2").classList.remove("displayMe");
  document.getElementById("realtime3").classList.remove("displayMe");
  document.getElementById("realtime4").classList.remove("displayMe");
  //
  document.getElementById("realtime1").classList.remove("hideMe");
  document.getElementById("realtime2").classList.add("hideMe");
  document.getElementById("realtime3").classList.add("hideMe");
  document.getElementById("realtime4").classList.add("hideMe");
}

function requestData(city) {
  cityName = city || 'San Francisco';
  $.getJSON("http://www.bayareabikeshare.com/stations/json", function(data) {
    if (refreshTime.indexOf(data.executionTime) === -1) {
      if (refreshTime.length === 10) {
        refreshTime.shift();
        sanJoseAvability.shift();
        sanFranciscoAvability.shift();
        redWoodCityAvability.shift();
        mountainViewAvability.shift();
        paloAltoAvability.shift();

      }
      /*    setRealTimeValues(data.stationBeanList);*/
      /* $("#stationNameRealTimeAvailableBikes").html("<h4>" + data.stationBeanList[0].stationName + "<h4>");
       $("#stationNameRealTimeAvailableBikesCount").html(data.stationBeanList[0].availableBikes);
       $("#stationNameRealTimeAvailableDocks").html("<h4>" + data.stationBeanList[0].stationName + "<h4>");
       $("#stationNameRealTimeAvailableDocksCount").html(data.stationBeanList[0].availableDocks);
       $("#stationNameRealTimeTotalDocks").html("<h4>" + data.stationBeanList[0].stationName + "<h4>");
       $("#stationNameRealTimeTotalDocksCount").html(data.stationBeanList[0].totalDocks);
       $("#stationNameRealTimeDemandName").html("<h4>" + data.stationBeanList[0].stationName + "<h4>");
       $("#stationNameRealTimeDemand").html(getPrediction(data.stationBeanList[0].availableBikes,data.stationBeanList[0].availableDocks))*/


      $("#lastRefreshedTime").html('<h5 class="text-center">Last Refreshed Time - <b style="color:#7CB5EC">' + data.executionTime + '</b></h5>')
      refreshTime.push(data.executionTime);
      calculateAvaibility(data.stationBeanList);
    }
    // console.log('data',JSON.stringify(data,null,2));
    liveData = data;
    filterDataRealtime(cityName);
    plotRealmap();
  }, function(error) {
    console.log("Error in getting live data")
  });
}

function getDemand(availableBikes, availableDocks) {
  var total = availableBikes + availableDocks;
  return 100 - (availableBikes / total * 100);
}

function filterDataRealtime(city) {
  //console.log('clicked',JSON.stringify(liveData.,null,2));
  cityName = city || 'San Francisco';
  availableDocks = [];
  availableBikes = [];
  demandPrediction = [];
  for (var i = 0; i < liveData.stationBeanList.length; i++) {
    if (liveData.stationBeanList[i].city === cityName) {
      availableBikes.push([liveData.stationBeanList[i].stationName, liveData.stationBeanList[i].availableBikes])
      availableDocks.push([liveData.stationBeanList[i].stationName, liveData.stationBeanList[i].availableDocks])
      demandPrediction.push({
        stationName: liveData.stationBeanList[i].stationName,
        totalBikes: liveData.stationBeanList[i].totalDocks,
        demand: getPrediction(liveData.stationBeanList[i].availableBikes, liveData.stationBeanList[i].availableDocks),
        x: liveData.stationBeanList[i].availableBikes,
        y: liveData.stationBeanList[i].availableDocks,
        z: Math.round(getDemand(liveData.stationBeanList[i].availableBikes, liveData.stationBeanList[i].availableDocks))
      })
    }
  }
  plotRealmap();
}


/*function setRealTimeValues(data) {

  var dataRequired = [];
  dataRequired.push(data[0]);
  dataRequired.push(data[15]);
  dataRequired.push(data[21]);
  dataRequired.push(data[22]);
  dataRequired.push(data[27]);
  dataRequired.push(data[29]);
  dataRequired.push(data[57]);
  dataRequired.push(data[58]);
  dataRequired[6].stationName = dataRequired[6].stationName.substring(0, 23) + 'Station 2';
  dataRequired[7].stationName = dataRequired[7].stationName.substring(0, 23) + 'Station 4';
  $("#stationNameRealTimeAvailableBikes").html("<h4>" + dataRequired[0].stationName + "<h4>");
  $("#stationNameRealTimeAvailableBikesCount").html(dataRequired[0].availableBikes);
  $("#stationNameRealTimeAvailableDocks").html("<h4>" + dataRequired[0].stationName + "<h4>");
  $("#stationNameRealTimeAvailableDocksCount").html(dataRequired[0].availableDocks);
  $("#stationNameRealTimeTotalDocks").html("<h4>" + dataRequired[0].stationName + "<h4>");
  $("#stationNameRealTimeTotalDocksCount").html(dataRequired[0].totalDocks);
  $("#stationNameRealTimeDemandName").html("<h4>" + dataRequired[0].stationName + "<h4>");
  $("#stationNameRealTimeDemand").html(getPrediction(dataRequired[0].availableBikes, dataRequired[0].availableDocks));
  var i = 1;
  setInterval(function() {
    $("#stationNameRealTimeAvailableBikes").html("<h4>" + dataRequired[i].stationName + "<h4>");
    $("#stationNameRealTimeAvailableBikesCount").html(dataRequired[i].availableBikes);
    $("#stationNameRealTimeAvailableDocks").html("<h4>" + dataRequired[i].stationName + "<h4>");
    $("#stationNameRealTimeAvailableDocksCount").html(dataRequired[i].availableDocks);
    $("#stationNameRealTimeTotalDocks").html("<h4>" + dataRequired[i].stationName + "<h4>");
    $("#stationNameRealTimeTotalDocksCount").html(dataRequired[i].totalDocks);
    $("#stationNameRealTimeDemandName").html("<h4>" + dataRequired[i].stationName + "<h4>");
    $("#stationNameRealTimeDemand").html(getPrediction(dataRequired[i].availableBikes, dataRequired[i].availableDocks));
    i++;
    if (i == dataRequired.length) i = 0;
  }, 5 * 1000);

}
*/
function getPrediction(availableBikes, availableDocks) {
  var total = availableBikes + availableDocks;
  var demand = 100 - (availableBikes / total * 100);
  if (demand > 80) {
    return 'Very High';
  } else if (demand > 60 && demand <= 80) {
    return 'High';
  } else if (demand > 40 && demand <= 60) {
    return 'Moderate';
  } else if (demand > 20 && demand <= 40) {
    return 'Low';
  } else if (demand <= 20) {
    return 'Very Low';
  } else {
    return 'Unknown';
  }
}

function calculateAvaibility(data) {

  sanJoseAvability.push(getAvaibility('San Jose'));
  sanFranciscoAvability.push(getAvaibility('San Francisco'));
  paloAltoAvability.push(getAvaibility('Palo Alto'));
  redWoodCityAvability.push(getAvaibility('Redwood City'));
  mountainViewAvability.push(getAvaibility('Mountain View'));

  function getAvaibility(cityName) {
    return 100 - (_.pluck(_.where(data, {
      city: cityName
    }), 'availableBikes').reduce(function(a, b) {
      return a + b
    }) / _.pluck(_.where(data, {
      city: cityName
    }), 'totalDocks').reduce(function(a, b) {
      return a + b
    }) * 100)
  }
}

function plotRealmap() {

  $('#rentedBikes').empty();
  $('#availableDocks').empty();
  $('#availableBikes').empty();
  $('#demandPrediction').empty();
  //alert("cleared previous graphs");  
  $('#rentedBikes').highcharts({
    chart: {
      type: 'column',
      width: 800,
      height: 400
    },
    title: {
      text: 'Number of Rented bikes per city (in percentage)'
    },
    subtitle: {
      text: 'Every minute graph is refreshed'
    },
    xAxis: {
      categories: refreshTime,
      title: {
        text: 'Last ' + refreshTime.length + ' times Refreshed'
      },
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of bikes rented (%)'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:8px">{point.key}</span><table  style="color:white">',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.2f} %</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '<b style="font-size:6px">{point.name} {point.y:.2f}%</b>',
          style: {
            color: 'white',
            font: '15px Trebuchet MS, Verdana, sans-serif'
          }
        }
      }
    },
    series: [{
      name: 'San Francisco',
      data: sanFranciscoAvability

    }, {
      name: 'San Jose',
      data: sanJoseAvability

    }, {
      name: 'Palo Alto',
      data: paloAltoAvability

    }, {
      name: 'Redwood City',
      data: redWoodCityAvability

    }, {
      name: 'Mountain View',
      data: mountainViewAvability

    }]
  });

  $('#availableDocks').highcharts({
    chart: {
      type: 'pie',
      width: 800,
      height: 400,
      options3d: {
        enabled: true,
        alpha: 45
      }
    },
    title: {
      text: 'Real time - Available docks per station'
    },
    subtitle: {
      text: 'City ' + cityName
    },
    plotOptions: {
      pie: {
        innerSize: 100,
        depth: 45,
        dataLabels: {
          enabled: true,
          format: '<b style="font-size:6px">{point.name}: {point.y:.0f}</b>',
          style: {
            color: 'white',
            font: '6px Trebuchet MS, Verdana, sans-serif'
          }
        }
      }
    },
    series: [{
      name: 'Available Docks',
      data: availableDocks
    }]
  });
  $('#availableBikes').highcharts({
    chart: {
      type: 'pie',
      width: 800,
      height: 400,
      options3d: {
        enabled: true,
        alpha: 45
      }
    },
    title: {
      text: 'Real time -  Available bikes per station'
    },
    subtitle: {
      text: 'City ' + cityName
    },
    plotOptions: {
      pie: {
        innerSize: 100,
        depth: 45,
        dataLabels: {
          enabled: true,
          format: '<b style="font-size:6px">{point.name}: {point.y:.0f}</b>',
          style: {
            color: 'white',
            font: '6px Trebuchet MS, Verdana, sans-serif'
          }
        }
      }
    },
    series: [{
      name: 'Available Bikes',
      data: availableBikes
    }]
  });
  $('#demandPrediction').highcharts({

    chart: {
      type: 'scatter',
      width: 800,
      height: 400,
      plotBorderWidth: 1,
      zoomType: 'xy'
    },

    legend: {
      enabled: false
    },

    title: {
      text: 'Available Bikes and Docks  per City'
    },

    subtitle: {
      text: 'City ' + cityName
    },

    xAxis: {
      gridLineWidth: 1,
      //tickInterval: 3,
      title: {
        text: 'Available Bikes'
      },
      labels: {
        format: '{value}'
      }
    },

    yAxis: {
      startOnTick: false,
      endOnTick: false,
      // tickInterval: 3,
      title: {
        text: 'Available Docks'
      },
      labels: {
        format: '{value}'
      },
      maxPadding: 0.1
    },
    tooltip: {
      useHTML: true,
      headerFormat: '<table style="color:white">',
      pointFormat: '<tr><th colspan="2"><h3>{point.stationName}</h3></th></tr>' +
        '<tr><th>Available Bikes:- </th><td>{point.x}</td></tr>' +
        '<tr><th>Available Docks:- </th><td>{point.y}</td></tr>' +
        '<tr><th>Total Bikes:- </th><td>{point.totalBikes}</td></tr>' +
        '<tr><th>% of bikes rented:-   </th><td>{point.z}% </td></tr>' +
        '<tr><th>Demand Prediction:-   </th><td>{point.demand} </td></tr>',
      footerFormat: '</table>',
      followPointer: true
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.stationName}',
          color: 'black',
          borderRadius: 6,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#AAA',
          y: -30
        },
        marker: {
          radius: 14,
          lineColor: '#666666',
          lineWidth: 1
        }
      }
    },
    series: [{
      data: demandPrediction,
      marker: {
        symbol: 'url(bike.ico)'
      }
    }]
  });
}