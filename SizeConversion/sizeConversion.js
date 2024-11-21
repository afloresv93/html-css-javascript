const isUnisex = true;
const countryCode = 'PE';
const styleClass = 'table-size-selector js-table-size-selector';

// ageCode > Se llena a partir del dataSize (isUnisex ? genders : age)
const ageCode = ['H', 'M'];

// sizeCAL > Conversiones según el sitio (MrtSizeConversion)
const sizeCAL = {
  "H|7": {
    "US": "7",
    "PE-AU": "38",
    "PE": "38",
    "US-AU": "7"
  },
  "H|9.5": {
    "US": "9.5",
    "PE-AU": "42.5",
    "PE": "42.5",
    "US-AU": "9.5"
  },
  "H|8.5": {
    "US": "8.5",
    "PE-AU": "41",
    "PE": "41",
    "US-AU": "8.5"
  },
  "H|9": {
    "US": "9",
    "PE-AU": "42",
    "PE": "42",
    "US-AU": "9"
  },
  "H|7.5": {
    "US": "7.5",
    "PE-AU": "39",
    "PE": "39",
    "US-AU": "7.5"
  },
  "H|8": {
    "US": "8",
    "PE-AU": "40",
    "PE": "40",
    "US-AU": "8"
  },
  "M|8.5": {
    "US": "8.5",
    "PE-AU": "40",
    "PE": "38.5",
    "US-AU": "10"
  },
  "M|9.5": {
    "US": "9.5",
    "PE-AU": "41",
    "PE": "39.5",
    "US-AU": "11"
  },
  "M|8": {
    "US": "8",
    "PE-AU": "39.5",
    "PE": "38",
    "US-AU": "9.5"
  },
  "M|7": {
    "US": "7",
    "PE-AU": "38.5",
    "PE": "37",
    "US-AU": "8.5"
  },
  "M|10": {
    "US": "10",
    "PE-AU": "41.5",
    "PE": "40",
    "US-AU": "11.5"
  },
  "M|11": {
    "US": "11",
    "PE-AU": "42.5",
    "PE": "41",
    "US-AU": "12.5"
  },
  "M|9": {
    "US": "9",
    "PE-AU": "40.5",
    "PE": "39",
    "US-AU": "10.5"
  },
  "H|10": {
    "US": "10",
    "PE-AU": "43",
    "PE": "43",
    "US-AU": "10"
  },
  "M|12": {
    "US": "12",
    "PE-AU": "43.5",
    "PE": "42",
    "US-AU": "13.5"
  },
  "H|13": {
    "US": "13",
    "PE-AU": "46",
    "PE": "46",
    "US-AU": "13"
  },
  "M|13": {
    "US": "13",
    "PE-AU": "44.5",
    "PE": "43",
    "US-AU": "14.5"
  },
  "H|11": {
    "US": "11",
    "PE-AU": "44",
    "PE": "44",
    "US-AU": "11"
  },
  "H|12": {
    "US": "12",
    "PE-AU": "45",
    "PE": "45",
    "US-AU": "12"
  },
  "M|7.5": {
    "US": "7.5",
    "PE-AU": "39",
    "PE": "37.5",
    "US-AU": "9"
  },
  "M|10.5": {
    "US": "10.5",
    "PE-AU": "42",
    "PE": "40.5",
    "US-AU": "12"
  },
  "H|10.5": {
    "US": "10.5",
    "PE-AU": "43.5",
    "PE": "43.5",
    "US-AU": "10.5"
  }
};

// dataSize > Tallas disponibles del producto (MrtSizeVariantProduct)
const dataSize = [
  '7',
  '7.5',
  '8',
  '8.5',
  '9',
  '9.5',
  '10',
  '10.5',
  '11',
  '12',
  '13'
];

// dataAge > Se llena a partir de ageCode + dataSize
const dataAge = [
  ["H","M"],
  ["H","M"],
  ["H","M"],
  ["H","M"],
  ["H","M"],
  ["H","M"],
  ["H","M"],
  ["H","M"],
  ["H","M"],
  ["H","M"],
  ["H","M"],
]

const dataUrl = [
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939001",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939002",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939003",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939004",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939005",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939006",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939007",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939008",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939009",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939009",
  "/pe/productos/hombre/calzado/accion/nike-zoom-stefan-janoski/p/10183939009"
]

const dataClass = [
  "pdp-size-enabled",
  "pdp-size-enabled",
  "pdp-size-enabled",
  "pdp-size-enabled",
  "pdp-size-enabled",
  "pdp-size-enabled",
  "pdp-size-enabled",
  "pdp-size-enabled",
  "pdp-size-enabled",
  "pdp-size-enabled",
  "pdp-size-enabled"
]

// vSizes > Se llena según el código de la talla del sizeCAL | Ej: 9.5
let vSizes = [];

// vSizesLocal > 
// Indice: ageCode[0] ('H' o 'M') + el código de la talla del sizeCAL | Ej: H|9.5
// Valor : (isUnisex ? countryCode + '-AU' : countryCode) | Ej: PE-AU: 42.5
let vSizesLocal = [];

for (const values in sizeCAL) {
  const value = values.split('|');

  if (!vSizes.includes(value[1])) {
    vSizes.push(value[1]);

    if (!isUnisex) {
      vSizesLocal.push(sizeCAL[ageCode[0] + '|' + value[1]][countryCode]);
    } else {
      vSizesLocal.push(sizeCAL[ageCode[0] + '|' + value[1]][countryCode + '-AU']);
    }
  }
}

function validateConversionCal(age, size, isUnisex) {
  // Busca en las conversiones del sitio (sizeCAL) por edad + talla | Ej: H|9.5
  var conversion = sizeCAL[age + '|' + size];
  if (conversion != undefined) {
      var unisexValues = []
      var normalValues = []

      // Recorre las llaves del objeto, recuperando el valor | Ej: PE-AU: 42.5
      Object.keys(conversion).forEach(function (key) {
          if (key.includes('-AU'))
              unisexValues.push(key)
          else
              normalValues.push(key)
      })

      // Minimo el arreglo según isUnisex debe de tener 2 valores
      return isUnisex ? unisexValues.length > 1 : normalValues.length > 1;
  }
}

// Verifica que todas las tallas disponibles del producto tengan su conversión correspondiente
$(dataSize).each(function (i, size) {
  if ($.inArray(size, vSizes) === -1) {
      // La validación si es Unisex se realiza en base a la edad 'H'
      if (validateConversionCal(isUnisex ? 'H' : ageCode[0], size, isUnisex)) {
          vSizes.push(size);
      }
  }
});

// Obtienes un nuevo arreglo de tallas ordenadas teniendo como base (vSizesLocal)
function sortSizesLocale(dataSizeLocal,dataSize) {
  let combined = dataSizeLocal.map((size, index) => {
      return { local: size, us: dataSize[index] };
  });

  combined.sort((a, b) => parseFloat(a.local) - parseFloat(b.local));

  return combined.map(item => item.us);
}

// Se vuelve a asignar valor vSizes según el ordenamiento
vSizes = sortSizesLocale(vSizesLocal, vSizes);

// vSizes: Un arreglo que contiene las tallas que se han validado y que están disponibles para el producto.
// dataSize: Un arreglo que contiene todas las tallas disponibles del producto.
// ageCode: Un arreglo que representa los códigos de género (por ejemplo, "H" para Hombre y "M" para Mujer).
// dataAge: Un arreglo que contiene las combinaciones de códigos de género para las tallas.
// dataUrl: Un arreglo que contiene las URLs correspondientes a cada talla.
// dataClass: Un arreglo que contiene las clases CSS correspondientes a cada talla.
function filterSizeData(vSizes, dataSize, ageCode, dataAge, dataUrl, dataClass) {
  var vDataAge = [], vDataSize = [], vDataUrl = [], vDataClass = [];
  $(vSizes).each(function (e, size) {
      var iData = $.inArray(size, dataSize);
      if (iData === -1) {
          vDataUrl.push(null);
          vDataClass.push('pdp-size-disabled')
          vDataAge.push(ageCode)
      } else {
          vDataAge.push(dataAge[iData])
          vDataUrl.push(dataUrl[iData]);
          vDataClass.push(dataClass[iData]);
      }
      vDataSize.push(size);
  });
  return [vDataAge, vDataSize, vDataUrl, vDataClass];
}

// Se utiliza para filtrar y organizar la información de tallas de un producto
// determinando cuáles están disponibles y cuáles no
// junto con sus respectivas URLs y clases CSS
var vData = filterSizeData(vSizes, dataSize, ageCode, dataAge, dataUrl, dataClass);

console.log('vData', vData);

// tableClass: Clase CSS que se asignará a la tabla.
// cat: Categoría que se asignará como un atributo data-cat en la tabla.
// dataAge: Un arreglo que contiene los códigos de género asociados a cada talla (por ejemplo, "H" para Hombre y "M" para Mujer).
// dataSize: Un arreglo que contiene las tallas disponibles del producto.
// dataUrl: Un arreglo que contiene las URLs correspondientes a cada talla.
// dataClass: Un arreglo que contiene las clases CSS que se asignarán a cada celda de la tabla.
// c4r: Número que indica cuántas columnas debe tener cada fila de la tabla.
// showType: Un booleano que indica si se debe mostrar el tipo de talla (por ejemplo, "US").
function buildTable(tableClass, cat, dataAge, dataSize, dataUrl, dataClass, c4r, showType) {
  var tableHtml = '<table class="' + tableClass + '" data-cat="' + cat + '">';
  let nRows = 0;
  for (var i = 0; i < dataAge.length; i++) {
      var tdClass = '';
      if (dataClass != null && dataClass.length != 0) {
          tdClass = dataClass[i];
      }
      tdClass = tdClass + (nRows >= 0 ? ' fit':'');
      if (i % c4r === 0) {
          tableHtml += '<tr>'
      }

      var isUnisex = dataAge[i].length === 2 ? dataAge[i][0] == 'H' && dataAge[i][1] == 'M' || dataAge[i][0] == 'M' && dataAge[i][1] == 'H' : false;
      if (isUnisex)
          tableHtml += '<td data-key="' + dataAge[i][0] + (dataAge[i].length > 1 ? ';' + dataAge[i][1] : '') + '|' + dataSize[i] + '" class="' + tdClass + '  ">';
      else
          tableHtml += '<td data-key="' + dataAge[i] + '|' + dataSize[i] + '" class="' + tdClass + '  ">';

      tableHtml += '<a';
      if (dataUrl[i] != null) {
          tableHtml += ' href="' + dataUrl[i] + '/ajax"';
      }
      tableHtml += '><div><span>';
      if (showType) {
          tableHtml += 'US ';
      }
      tableHtml += dataSize[i];
      tableHtml += '</span></div></a></td>';
      if (i % c4r === c4r - 1) {
          tableHtml += '</tr>';
          nRows += 1;
      }
  }
  if (dataAge.length % c4r !== 0) {
      for (var e = 0; e < (c4r - (dataAge.length % c4r)); e++) {
          tableHtml += '<td></td>';
      }
      tableHtml += '</tr>'
  }
  tableHtml += '</table>';
  return tableHtml;
}

// vData[0] > ageCode
// vData[1] > vSizes
// vData[2] > dataUrl
// vData[3] > dataClass

// Genera dinámicamente una tabla HTML que muestra las tallas disponibles de un producto
// organizadas por género, y proporciona enlaces a las páginas de cada talla.
const dataHtml = buildTable(styleClass, '', vData[0], vData[1], vData[2], vData[3], 2, true);

let checked = false;
const genderTranslator = {
  "translator": [{"code":"M","name":"Mujer"},{"code":"H","name":"Hombre"}]
};

$('.js-result-selector-size').html(dataHtml);

function translateGender(genderCode) {
  var firstLetter = '';
  $(genderTranslator.translator).each(function (i, gender) {
      if (gender.code == genderCode) {
          firstLetter = (gender.name).substring(0, 1) + ' '
      }
  })
  return firstLetter;
}

function changeDataSize(table, type, showType) {
  $(table).find('tr').each(function (e, tr) {
      $(tr).find('td').each(function (i, td) {
          var dataKey = $(td).data('key');
          if (dataKey != undefined || dataKey != null) {
              console.log('dataKey',dataKey);
              var value = '';
              if (showType) {
                  value += type + ' ';
              }
              var genderCode = dataKey.split('|')[0].split(';')
              console.log('genderCode', genderCode);
              var size = dataKey.split('|')[1]
              console.log('size', size);

              if (genderCode.length > 1)
                  value += translateGender(genderCode[0]) + sizeCAL[genderCode[0] + '|' + size][type + "-AU"]
                      + ' / ' + translateGender(genderCode[1]) + sizeCAL[genderCode[1] + '|' + size][type + "-AU"]
              else
                  value += sizeCAL[genderCode + '|' + size][type];

              $(td).find('a div span').text(value);
          }
      });
  });
}

function setEventToSwitch(itemClass, showType) {
  $('.js-toggle-switch__input').change(function () {
      var firstOption = $('.js-toggle-switch__slider').data('firstOptionCode');
      var secondOption = $('.js-toggle-switch__slider').data('secondOptionCode');
      var type = checked ? secondOption : firstOption;

      $('.' + itemClass).each(function (a, table) {
          changeDataSize(table, type, showType);
      });

      checked=!checked;
  });

  $('.js-toggle-switch__input').trigger("change");
}

setEventToSwitch('js-table-size-selector', false);
