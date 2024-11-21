let aDirecciones = [];
let map, marker;

let username = 'admin';
let password = 'supersecret';

let geoDistrict = '';
let geoPostalCode = '';

function initialize() {
    // Cargar direcciones
    // var AccountID = sap.byd.ui.mashup.context.inport.CustomerInternalID;
    var AccountID = 1000031;
    consultarDirecciones(AccountID);

    // Change Inputs Coordinate
    $("#txtLat, #txtLng").change(function () {
        updateMarker_coordinate();
    });

    // Change Inputs Address
    $("#txtStreet, #txtHouseNumber").change(function () {
        updateMarker_address();
    });

}

async function loadMap(latitud, longitud) {
    
    let _latitud = latitud;
    let _longitud = longitud;

    let bMessage = false;
    let messageContent = '';
    
    if(Number(latitud) === 0 || Number(longitud) === 0) {

        var e = document.getElementById("cmbDirecciones");
        const data = aDirecciones[e.selectedIndex];

        const distrito = data.District;
        const ciudad = data.City;
        const pais = data.CountryCodeText;
        const direccion = data.FormattedAddressSecondLineDescription;

        try {
            const location = await getGeocode(direccion+', '+distrito+', '+ciudad+', '+pais, true);
            
            _latitud = location.lat();
            _longitud = location.lng();

            bMessage = true;
            messageContent = 'Latitud y Longitud pendientes de actualización';

        } catch(err) {
            console.warn(err);
        }
    } else {
        // Obtenemos el distrito según coordenadas
        const reverseGeocoding = await getGeocodeLocation(_latitud, _longitud);
        loadDistrict(reverseGeocoding);
    }

    // Verificamos código postal
    const dataPostalCode = $("#txtStreetPostalCode").val();
    if ( (dataPostalCode === '' || dataPostalCode !== geoPostalCode) && geoPostalCode !== '' ) {
        $("#txtStreetPostalCode").val(geoPostalCode);

        if (bMessage) {
            messageContent = 'Latitud, Longitud y código postal pendientes de actualización'
        } else {
            messageContent = 'Código postal pendiente de actualización';
        }
        bMessage = true;
    }

    if (bMessage) {
        message( 'fa-info-circle', messageContent, 'info');
    }

    // Creating map object
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 16,
        center: new google.maps.LatLng(_latitud, _longitud),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // creates a draggable marker to the given coords
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(_latitud, _longitud),
        draggable: true
    });

    // adds a listener to the marker
    // gets the coords when drag event ends
    // then updates the input with the new coords
    google.maps.event.addListener(marker, 'dragend', async function (evt) {
        const latitud = evt.latLng.lat().toFixed(6);
        const longitud = evt.latLng.lng().toFixed(6);

        $("#txtLat").val(latitud);
        $("#txtLng").val(longitud);

        try {
            const reverseGeocoding = await getGeocodeLocation(latitud, longitud);

            let street = "";
            let houseNumber = "";
            let streetPostalCode = "";
            
            for (let index = 0; index < reverseGeocoding.length; index++) {
                const element = reverseGeocoding[index];

                /* const bStreet = element.types.includes("route");
                if (bStreet) {
                    street = element.short_name;
                    $("#txtStreet").val(street);
                } */

                const bStreetPostalCode = element.types.includes("postal_code");
                if (bStreetPostalCode) {
                    streetPostalCode = element.long_name || element.short_name;
                    $("#txtStreetPostalCode").val(streetPostalCode);
                }

                /* const bStreetNumber = element.types.includes("street_number");
                if(bStreetNumber) {
                    const onlyNumber = (element.short_name).match(/\d+/g);
                    houseNumber = (onlyNumber) ? onlyNumber[0] : "";
                    $("#txtHouseNumber").val(houseNumber);
                } */
						
            }

        } catch(err) {
            console.warn(err);
        }
        
        map.panTo(evt.latLng);
    });

    $("#txtLat").val(Number(_latitud).toFixed(6));
    $("#txtLng").val(Number(_longitud).toFixed(6));

    // centers the map on markers coords
    map.setCenter(marker.position);

    // adds the marker on the map
    marker.setMap(map);
}

function getGeocode(address, load = false) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: address}, (results, status) => {
            if (status === 'OK') {
                if (load) {
                    loadDistrict(results[0].address_components);
                }
                getPostalCode(results[0].address_components);
                resolve(results[0].geometry.location);
            } else {
                reject(status);
            }    
        });    
    });
}

function getGeocodeLocation(latitud, longitud) {
    const latlng = {
        lat: parseFloat(latitud),
        lng: parseFloat(longitud),
    };
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({location: latlng}, (results, status) => {
            if (status === 'OK') {
                getPostalCode(results[0].address_components);
                resolve(results[0].address_components);
            } else {
                reject(status);
            }    
        });    
    });
}

function consultarDirecciones(id){
    // const h = new Headers();
    // h.append('Accept', 'application/json');
    // h.append('Authorization', 'Basic ' + btoa(username + ":" + password));

    // const url = "https://mt-industrial-s-a-c-foundry-ful6b6vd-dev-qas.cfapps.us20.hana.ondemand.com/IndividualCustomerAddressCollection?$filter=CustomerID%20eq%20%27"+id+"%27";
    // const req = new Request( url, {
    //     method: 'GET',
    //     headers: h,
    //     mode: "same-origin"
    // });

    
    // fetch(req).then(function(response) {
    //     if(response.ok) {
    //         return response.json();
    //     } else {
    //         throw new Error('Error HTTP');
    //     }
    // }).then(function(data) {

        const concertArray = 
        [
            {
                "__metadata": {
                    "uri": "https://my360657.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/CorporateAccountAddressCollection('0295C41001C41EDD8EB7A3E620130568')",
                    "type": "c4codata.CorporateAccountAddress",
                    "etag": "W/\"datetimeoffset'2023-12-05T23%3A08%3A01.6558100Z'\""
                },
                "ObjectID": "0295C41001C41EDD8EB7A3E620130568",
                "ParentObjectID": "0295C41001C41EDD8EB7A3E620128568",
                "AccountID": "1000031",
                "UUID": "0295C410-01C4-1EDD-8EB7-A3E620130568",
                "MainIndicator": true,
                "ShipTo": true,
                "DefaultShipTo": true,
                "BillTo": true,
                "DefaultBillTo": true,
                "FormattedPostalAddressDescription": "AV COLONICAL 2632 2632 / 150101 LIMA-LIMA / PE",
                "FormattedAddressFirstLineDescription": "Verde S.A.C.",
                "FormattedAddressSecondLineDescription": "AV COLONICAL 2632 2632",
                "FormattedAddressThirdLineDescription": "150101 LIMA-LIMA",
                "FormattedAddressFourthLineDescription": "Peru",
                "FormattedPostalAddressFirstLineDescription": "AV COLONICAL 2632 2632",
                "FormattedPostalAddressSecondLineDescription": "150101 LIMA-LIMA",
                "FormattedPostalAddressThirdLineDescription": "Peru",
                "CountryCode": "PE",
                "CountryCodeText": "Peru",
                "StateCode": "15",
                "StateCodeText": "Pasco",
                "CareOfName": "",
                "AddressLine1": "",
                "AddressLine2": "",
                "HouseNumber": "2632",
                "AdditionalHouseNumber": "",
                "Street": "AV COLONICAL 2632",
                "AddressLine4": "",
                "AddressLine5": "",
                "District": "LIMA",
                "City": "LIMA",
                "DifferentCity": "",
                "StreetPostalCode": "150101",
                "County": "",
                "CompanyPostalCode": "",
                "POBoxIndicator": false,
                "POBox": "",
                "POBoxPostalCode": "",
                "POBoxDeviatingCountryCode": "",
                "POBoxDeviatingCountryCodeText": "",
                "POBoxDeviatingStateCode": "",
                "POBoxDeviatingStateCodeText": "",
                "POBoxDeviatingCity": "",
                "TimeZoneCode": "UTC-5",
                "TimeZoneCodeText": "(UTC-05:00) Coordinated Universal Time -05:00 (without daylight saving time)",
                "Latitude": "-12.08694900000000",
                "Longitude": "-77.04354400000000",
                "Building": "",
                "Floor": "321",
                "Room": "",
                "Phone": "+51 939782206",
                "NormalisedPhone": "+51939782206",
                "Mobile": "+51 980611837",
                "NormalisedMobile": "+51980611837",
                "Fax": "",
                "Email": "DROMERO@SOLE.COM.PE",
                "WebSite": "",
                "LanguageCode": "ES",
                "LanguageCodeText": "Spanish",
                "BestReachedByCode": "",
                "BestReachedByCodeText": "",
                "ETag": "/Date(1701817681655)/",
                "zIDDistritocontent_SDK": "1251",
                "zIDProvinciacontent_SDK": "128",
                "zaObjectIDAddress_KUT": "0295C41001C41EDD8EB7A3E620130568",
                "zaReferenciaAdicional_KUT": "",
                "zaTelefonoMovil2_KUT": "",
                "zaZona_KUT": "",
                "zaZona_KUTText": "",
                "CorporateAccount": {
                    "__deferred": {
                        "uri": "https://my360657.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/CorporateAccountAddressCollection('0295C41001C41EDD8EB7A3E620130568')/CorporateAccount"
                    }
                }
            },
            {
                "__metadata": {
                    "uri": "https://my360657.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/CorporateAccountAddressCollection('02ECD78A433C1EDD96AE085D5D1A2081')",
                    "type": "c4codata.CorporateAccountAddress",
                    "etag": "W/\"datetimeoffset'2023-12-06T00%3A52%3A58.2355070Z'\""
                },
                "ObjectID": "02ECD78A433C1EDD96AE085D5D1A2081",
                "ParentObjectID": "02ECD78A433C1EDD96AE085D5D17A081",
                "AccountID": "1000378",
                "UUID": "02ECD78A-433C-1EDD-96AE-085D5D1A2081",
                "MainIndicator": true,
                "ShipTo": true,
                "DefaultShipTo": true,
                "BillTo": true,
                "DefaultBillTo": true,
                "FormattedPostalAddressDescription": "NICOLAS AYLLON 4186 / 150103 LIMA-ATE / PE",
                "FormattedAddressFirstLineDescription": "CENTRO CERAMICO LAS FLORES S.A.C.",
                "FormattedAddressSecondLineDescription": "NICOLAS AYLLON 4186",
                "FormattedAddressThirdLineDescription": "150103 LIMA-ATE",
                "FormattedAddressFourthLineDescription": "Peru",
                "FormattedPostalAddressFirstLineDescription": "NICOLAS AYLLON 4186",
                "FormattedPostalAddressSecondLineDescription": "150103 LIMA-ATE",
                "FormattedPostalAddressThirdLineDescription": "Peru",
                "CountryCode": "PE",
                "CountryCodeText": "Peru",
                "StateCode": "15",
                "StateCodeText": "Pasco",
                "CareOfName": "",
                "AddressLine1": "AV.",
                "AddressLine2": "",
                "HouseNumber": "4186",
                "AdditionalHouseNumber": "",
                "Street": " NICOLAS AYLLON",
                "AddressLine4": "",
                "AddressLine5": "",
                "District": "ATE",
                "City": "LIMA",
                "DifferentCity": "",
                "StreetPostalCode": "150103",
                "County": "",
                "CompanyPostalCode": "",
                "POBoxIndicator": false,
                "POBox": "",
                "POBoxPostalCode": "",
                "POBoxDeviatingCountryCode": "",
                "POBoxDeviatingCountryCodeText": "",
                "POBoxDeviatingStateCode": "",
                "POBoxDeviatingStateCodeText": "",
                "POBoxDeviatingCity": "",
                "TimeZoneCode": "UTC-5",
                "TimeZoneCodeText": "(UTC-05:00) Coordinated Universal Time -05:00 (without daylight saving time)",
                "Latitude": "0.00000000000000",
                "Longitude": "0.00000000000000",
                "Building": "",
                "Floor": "",
                "Room": "",
                "Phone": "",
                "NormalisedPhone": "",
                "Mobile": "",
                "NormalisedMobile": "",
                "Fax": "",
                "Email": "",
                "WebSite": "",
                "LanguageCode": "ES",
                "LanguageCodeText": "Spanish",
                "BestReachedByCode": "",
                "BestReachedByCodeText": "",
                "ETag": "/Date(1701823978235)/",
                "zIDDistritocontent_SDK": "",
                "zIDProvinciacontent_SDK": "",
                "zaObjectIDAddress_KUT": "",
                "zaReferenciaAdicional_KUT": "",
                "zaTelefonoMovil2_KUT": "",
                "zaZona_KUT": "",
                "zaZona_KUTText": "",
                "CorporateAccount": {
                    "__deferred": {
                        "uri": "https://my360657.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/CorporateAccountAddressCollection('02ECD78A433C1EDD96AE085D5D1A2081')/CorporateAccount"
                    }
                }
            }
        ];
        aDirecciones = concertArray;

        let _latitude, _longitud;

        for(i=0;i<concertArray.length;i++){
            var select = document.getElementById("cmbDirecciones");
            var text = concertArray[i].FormattedAddressSecondLineDescription;
            var value = concertArray[i].ObjectID;
            var selected = concertArray[i].MainIndicator;
            select.options[select.options.length] = new Option(text, value, selected, selected);

            if (selected) {
                _latitude = concertArray[i].Latitude;
                _longitud = concertArray[i].Longitude;

                $("#txtStreet").val(concertArray[i].Street);
                $("#txtHouseNumber").val(concertArray[i].HouseNumber);
                $("#txtStreetPostalCode").val(concertArray[i].StreetPostalCode);
            }
        }

        if(concertArray.length > 0) {
            loadMap(_latitude, _longitud);
        }

    // }).catch((err) => {
    //     console.log("Catch", err.message);
    // });
}

async function changeAddress() {
    var e = document.getElementById("cmbDirecciones");
    const data = aDirecciones[e.selectedIndex];

    geoDistrict = '';
    geoPostalCode = '';

    $("#txtStreet").val(data.Street);
    $("#txtHouseNumber").val(data.HouseNumber);
    $("#txtStreetPostalCode").val(data.StreetPostalCode);

    let _latitud = data.Latitude;
    let _longitud = data.Longitude;

    if(Number(_latitud) === 0 || Number(_longitud) === 0) {
        const distrito = data.District;
        const ciudad = data.City;
        const pais = data.CountryCodeText;
        const direccion = data.FormattedAddressSecondLineDescription;

        try {
            const location = await getGeocode(direccion+', '+distrito+', '+ciudad+', '+pais, true);
            _latitud = location.lat();
            _longitud = location.lng();

            message(
                'fa-info-circle',
                'Latitud y Longitud pendientes de actualización',
                'info'
            );

        } catch(err) {
            console.warn(err);
        }
    } else {
        // Obtenemos el distrito según coordenadas
        const reverseGeocoding = await getGeocodeLocation(_latitud, _longitud);
        loadDistrict(reverseGeocoding)
    }

    $("#txtLat").val(Number(_latitud).toFixed(6));
    $("#txtLng").val(Number(_longitud).toFixed(6));

    var latlng = new google.maps.LatLng(_latitud, _longitud);
    marker.setPosition(latlng);
    map.panTo(marker.position);
}

async function updateMarker_coordinate() {
    const latitud = $("#txtLat").val();
    const longitud = $("#txtLng").val();
    
    var latlng = new google.maps.LatLng(latitud, longitud);
    marker.setPosition(latlng);
    map.panTo(marker.position);

    // Actualizamos el código postal
    await getGeocodeLocation(latitud, longitud);
    if (geoPostalCode !== '') {
        $("#txtStreetPostalCode").val(geoPostalCode);
    }
}

async function updateMarker_address() {
    var e = document.getElementById("cmbDirecciones");
    const data = aDirecciones[e.selectedIndex];

    const distrito = data.District;
    const ciudad = data.City;
    const pais = data.CountryCodeText;

    const direccion = $("#txtStreet").val() + ' ' + $("#txtHouseNumber").val();

    let _latitud = 0.0000;
    let _longitud = 0.0000;

    try {
        const location = await getGeocode(direccion+', '+distrito+', '+ciudad+', '+pais);
        _latitud = location.lat();
        _longitud = location.lng();

        message(
            'fa-info-circle',
            'Pendiente de actualización',
            'info'
        );
        
    } catch(err) {
        console.warn(err);
    }

    $("#txtLat").val(Number(_latitud).toFixed(6));
    $("#txtLng").val(Number(_longitud).toFixed(6));

    // Actualizamos el código postal
    if (geoPostalCode !== '') { $("#txtStreetPostalCode").val(geoPostalCode); }

    var latlng = new google.maps.LatLng(_latitud, _longitud);
    marker.setPosition(latlng);
    map.panTo(marker.position);
}

function isEmpty(str) {
    return (!str || str.length === 0 );
}

function sendCoordinates() {
    var e = document.getElementById("cmbDirecciones");
    var address = e.options[e.selectedIndex]?.value;
    
    if(address === undefined) {
        message(
            'fa-exclamation-triangle',
            'Advertencia: Información incompleta',
            'warning'
        );
        return;
    }

    var _latitude = marker.position.lat().toFixed(6).toString();            
    var _longitud = marker.position.lng().toFixed(6).toString();

    if(Number(_latitude) === 0 || Number(_longitud) === 0) {
        message(
            'fa-exclamation-triangle',
            'Advertencia: Información incompleta',
            'warning'
        );
        return;
    }

    var _street = $("#txtStreet").val();
    var _houseNumber = $("#txtHouseNumber").val();
    var _streetPostalCode = $("#txtStreetPostalCode").val();

    if(isEmpty(_street) || isEmpty(_houseNumber)) {
        message(
            'fa-exclamation-triangle',
            'Advertencia: Información incompleta',
            'warning'
        );
        return;
    }

    $("#updateCoordinate").addClass('activeLoading');            

    const h = new Headers();
    h.append('Content-type', 'application/json; charset=UTF-8');
    h.append('Authorization', 'Basic ' + btoa(username + ":" + password));

    const url = "https://mt-industrial-s-a-c-foundry-ful6b6vd-dev-qas.cfapps.us20.hana.ondemand.com/IndividualCustomerAddressCollection('"+address+"')";
    const req = new Request( url, {
        method: 'PATCH',
        headers: h,
        body: JSON.stringify({
            Latitude: _latitude,
            Longitude: _longitud
        }),
        mode: "cors"
    });

    
    fetch(req).then(function(response) {
        if(response.ok) {
            return 'ok';
        } else {
            throw new Error('Error HTTP');
        }
    }).then(async function() {

        // Actualizamos las coordenadas en memoria
        aDirecciones[e.selectedIndex].Latitude = _latitude;
        aDirecciones[e.selectedIndex].Longitude = _longitud;

        aDirecciones[e.selectedIndex].Street = _street;
        aDirecciones[e.selectedIndex].HouseNumber = _houseNumber;
        aDirecciones[e.selectedIndex].StreetPostalCode = _streetPostalCode;

        e.options[e.selectedIndex].innerHTML = _street + ' ' + _houseNumber;

        // Verificar si cambio el distrito
        let bCheckDistrict = false;
        if (geoDistrict !== '') {
            let newDistrict = '';
            const reverseGeocoding = await getGeocodeLocation(_latitude, _longitud);
            for (let index = 0; index < reverseGeocoding.length; index++) {
                const element = reverseGeocoding[index];
                const bLocality = element.types.includes("locality");
                if (bLocality) {
                    newDistrict = element.short_name;
                }
            }

            bCheckDistrict = ( newDistrict !== '' && newDistrict !== geoDistrict) ? true : false; 
            geoDistrict = newDistrict;
        }

        message(
            'fa-thumbs-up',
            'Dirección actualizada con éxito' + ( bCheckDistrict ? '. Se cambió el distrito!' : ''),
            'success'
        );

        $("#updateCoordinate").removeClass('activeLoading');

    }).catch((err) => {
        
        console.log("Catch", err.message);
        $("#updateCoordinate").removeClass('activeLoading');

        // $("html, body").animate({ scrollTop: 0 }, "slow");

        message(
            'fa-exclamation-circle',
            'Error: No se pudo actualizar la dirección.',
            'error'
        );
        
    });


}

function loadDistrict(aComponents) {
    for (let index = 0; index < aComponents.length; index++) {
        const element = aComponents[index];
        const bLocality = element.types.includes("locality");
        if (bLocality) {
            geoDistrict = element.short_name;
        }
    }
}

function getPostalCode(aComponents) {
    aComponents.forEach((element) => {
        if (element.types.includes("postal_code")) {
            geoPostalCode = element.long_name || element.short_name;
        }
    });
}

function message(icon, text, status) {
    // Icon
    $("#message-icon").addClass('fa '+ icon);
    // Text
    $("#message-text").text(text);
    // Status
    $("#message").addClass('active '+ status);
    setTimeout(() => {
        $("#message").removeClass();
        $("#message-icon").removeClass();
        $("#message-text").text('');
    }, (status !=='error')? 3000 : 6000 );
}