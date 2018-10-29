const patchPostMessageFunction = function() {
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace("hasOwnProperty", "postMessage");
  };

  window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = "(" + String(patchPostMessageFunction) + ")();";

module.exports = (name, address, lat, lng) =>
  patchPostMessageJsCode +
  "(" +
  String((name, address, plat, plng) => {
    if (plat === 0 && plng === 0) {
      var geocoder = new daum.maps.services.Geocoder();
      var ps = new daum.maps.services.Places();

      geocoder.addressSearch(address, function(result, status) {
        if (status == daum.maps.services.Status.OK) {
          showMap(result[0].y, result[0].x);
          window.postMessage(JSON.stringify({ lat: result[0].y, lng: result[0].x }));
        } else {
          ps.keywordSearch(address, function(result, status) {
            if (status == daum.maps.services.Status.OK) {
              showMap(result[0].y, result[0].x);
              window.postMessage(JSON.stringify({ lat: result[0].y, lng: result[0].x }));
            } else {
              alert(address);
              window.postMessage(JSON.stringify({ status: -1 }));
            }
          });
        }
      });
    } else {
      showMap(plat, plng);
    }

    function showMap(t, g) {
      setTimeout(function() {
        if (typeof daum !== "undefined") setMap(t, g);
        else showMap(t, g);
      }, 100);
    }

    function setMap(lat, lng) {
      const latLng = new daum.maps.LatLng(lat, lng); // 지도의 중심좌표
      var mapContainer = document.getElementById("map"), // 지도를 표시할 div
        mapOption = {
          center: latLng,
          level: 1 // 지도의 확대 레벨
        };

      // 지도를 생성합니다
      var map = new daum.maps.Map(mapContainer, mapOption);
      map.setDraggable(false);

      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new daum.maps.services.Geocoder();

      var imageSrc = "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커이미지의 주소입니다
        imageSize = new daum.maps.Size(64, 69), // 마커이미지의 크기입니다
        imageOption = { offset: new daum.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);

      var marker = new daum.maps.Marker({
        // image: markerImage // 마커이미지 설정
      });

      // var infowindow = new daum.maps.InfoWindow({ zindex: -1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

      var content = '<div class ="label">' + name + "</div>";

      // 마커 위에 커스텀오버레이를 표시합니다
      // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
      var customOverlay = new daum.maps.CustomOverlay({
        position: latLng,
        content: content
      });

      // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
      searchAddrFromCoords(map.getCenter(), displayCenterInfo);

      // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
      daum.maps.event.addListener(map, "idle", function() {
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);
      });

      function searchAddrFromCoords(coords, callback) {
        // 좌표로 행정동 주소 정보를 요청합니다
        geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
      }

      function searchDetailAddrFromCoords(coords, callback) {
        // 좌표로 법정동 상세 주소 정보를 요청합니다
        geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
      }

      // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
      function displayCenterInfo(result, status) {
        if (status === daum.maps.services.Status.OK) {
          var infoDiv = document.getElementById("centerAddr");

          for (var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === "H") {
              infoDiv.innerHTML = result[i].address_name;
              break;
            }
          }
        }
      }

      function panTo(moveLatLon) {
        map.panTo(moveLatLon);
      }

      searchDetailAddrFromCoords(latLng, function(result, status) {
        if (status === daum.maps.services.Status.OK) {
          // 마커를 클릭한 위치에 표시합니다
          marker.setPosition(latLng);
          marker.setMap(map);

          // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
          customOverlay.setMap(map);

          panTo(latLng);

          window.postMessage(
            JSON.stringify({
              road_address: !!result[0].road_address ? result[0].road_address.address_name : "",
              address_name: result[0].address.address_name,
              latLng: latLng
            })
          );
        }
      });
    }
  }) +
  `)("${name}", "${address}", ${lat}, ${lng});`;
