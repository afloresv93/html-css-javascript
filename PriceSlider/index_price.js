

/* Created by Tivotal */

const priceInputs = document.querySelectorAll(".price-input input");
const rangeInputs = document.querySelectorAll(".range-input input");
const range = document.querySelector(".slider .progress");

let priceGap = 5;

priceInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minPrice = parseInt(priceInputs[0].value);
    let maxPrice = parseInt(priceInputs[1].value);

    if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInputs[1].max) {
      if (e.target.className === "min-input") {
        rangeInputs[0].value = minPrice;
        range.style.left = (minPrice / rangeInputs[0].max) * 100 + "%";
      } else {
        rangeInputs[1].value = maxPrice;
        range.style.right = 100 - (maxPrice / rangeInputs[1].max) * 100 + "%";
      }
    }
  });
});

rangeInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    console.log('innput');
    let minVal = rangeInputs[0].value;
    let maxVal = rangeInputs[1].value;

    if (maxVal - minVal < priceGap) {
      if (e.target.className === "min-range") {
        rangeInputs[0].value = Number(maxVal) - Number(priceGap);
      } else {
        rangeInputs[1].value = Number(minVal) + Number(priceGap);
        // rangeInputs[1].disabled = true;
        // setTimeout(() => {
        //     rangeInputs[1].disabled = false;
        //     range.style.right = 100 - (maxVal / rangeInputs[1].max) * 100 + "%";
        // }, 100);
        console.log('ajuste max-range');
      }
    } else {
        console.log('menor a priceGap');
      priceInputs[0].value = minVal;
      priceInputs[1].value = maxVal;
      range.style.left = ( (minVal - rangeInputs[0].min) / (rangeInputs[0].max - rangeInputs[0].min ) ) * 100 + "%";

      // range.style.right = 100 - (maxVal / rangeInputs[1].max) * 100 + "%";
      range.style.right = 100 - ( (maxVal - rangeInputs[0].min) / (rangeInputs[0].max - rangeInputs[0].min) ) * 100  + "%";

    }

    if (e.target.className === "min-range") {

    } else {
        console.log(e.target.value);
        
    }

  });

  // input.addEventListener("change", (e) => {
  //   let minVal = rangeInputs[0].value;
  //   let maxVal = rangeInputs[1].value;

  //   range.style.left = (  minVal / rangeInputs[0].max) * 100 + "%";
  //   range.style.right = 100 - (maxVal / rangeInputs[1].max) * 100 + "%";

  //   console.log('ajuste change');

  // });

  // input.addEventListener("mouseup", (e) => {
  //   let minVal = rangeInputs[0].value;
  //   let maxVal = rangeInputs[1].value;

  //   range.style.left = (  minVal / rangeInputs[0].max) * 100 + "%";
  //   range.style.right = 100 - (maxVal / rangeInputs[1].max) * 100 + "%";

  //   console.log('ajuste mouseup');

  // });

});