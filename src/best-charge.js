let loadAllItems = require("./items");
let loadPromotions = require("./promotions");

function bestCharge(selectedItems) {

  let selectedItemsObj = calculateItemCount(selectedItems);

  let allItems = loadAllItems();

  let printResult = `============= 订餐明细 =============\n`;

  //console.log(allItems);

  let sum = 0;

  for(let selectedSingleItem in selectedItemsObj){

    printResult += singleItemInfo(selectedSingleItem,allItems,selectedItemsObj);
    sum += getSingleItemSum(selectedSingleItem,allItems,selectedItemsObj);
  }

  let halfPriceGoodsSavedFee = countHalfPriceGoodsSavedFee(selectedItemsObj);

  //console.log("半价节省",halfPriceGoodsSavedFee);

  let halfPriceGoodsNameArr = getHalfPriceGoodsName(allItems,selectedItemsObj);

  //console.log("半价商品名",halfPriceGoodsNameArr);

  let thirtySubstractSixFee = countThirtySubstractSixFee(selectedItemsObj);

  let savedFee;

  if(halfPriceGoodsSavedFee >= thirtySubstractSixFee){
    printResult +=`-----------------------------------\n使用优惠:\n指定菜品半价(${halfPriceGoodsNameArr.join(", ")})，省${halfPriceGoodsSavedFee}元\n-----------------------------------\n`;
    savedFee = halfPriceGoodsSavedFee;
  }else{
    printResult += `-----------------------------------使用优惠:\n满30减6元，省${thirtySubstractSixFee}元\n-----------------------------------\n`;
    savedFee = thirtySubstractSixFee;
  }

   printResult += `总计：${sum - savedFee}元\n===================================\n`;

  console.log(printResult);
}


function countHalfPriceGoodsBarcode() {
  let allPromotionGoods = loadPromotions();

  let halfPriceGoods = allPromotionGoods.filter(function (singleHalfPriceGoods) {
    return singleHalfPriceGoods["type"] == "指定菜品半价";
  });

  let halfPriceGoodsArr = halfPriceGoods[0]["items"];

  return halfPriceGoodsArr;

}

function getSelectedGoodsBarcode(selectedItemsObj) {

  let halfPriceGoodsArr = countHalfPriceGoodsBarcode();

  let selectedGoodsName = [];

  for(let singleItem in selectedItemsObj){

    if(halfPriceGoodsArr.includes(singleItem)){

      selectedGoodsName.push(singleItem);
    }

  }

  return selectedGoodsName;
}

function getHalfPriceGoodsName(allItems,selectedItemsObj) {

  let halfPriceGoodsNameArr = [];

  let halfPriceGoodsArr = getSelectedGoodsBarcode(selectedItemsObj);//错

  halfPriceGoodsArr.map(function (singleHalfPriceGoodBarcode) {

    let specifiedBarcodeArr = allItems.filter(function (singleItem) {
      return singleItem["id"] == singleHalfPriceGoodBarcode;
    });

    halfPriceGoodsNameArr.push(specifiedBarcodeArr[0]["name"]);

  });

  //console.log(halfPriceGoodsNameArr);

  return halfPriceGoodsNameArr;
}

function calculateThirtySubstractSixBarcode() {

  let allPromotionGoods = loadPromotions();

  let thirtySubstractSixeGoods = allPromotionGoods.filter(function (singleHalfPriceGoods) {
    return singleHalfPriceGoods["type"] == "满30减6元";
  });

  let thirtySubstractSixeGoodsArr = thirtySubstractSixeGoods[0]["items"];

  return thirtySubstractSixeGoodsArr;
}

function countThirtySubstractSixFee(selectedItemsObj) {
  let thirtySubstractSixArr = calculateThirtySubstractSixBarcode();

  let thirtySubstractSixSavedFee = 0;

  for(let singleItem in selectedItemsObj){

    if(thirtySubstractSixArr && thirtySubstractSixArr.includes(singleItem)){

      //单价
      let goodsPrice = getGoodsPrice(singleItem);
      //console.log("单价",goodsPrice);

      thirtySubstractSixSavedFee += selectedItemsObj[singleItem] * goodsPrice;
    }

  }

  return thirtySubstractSixSavedFee;
}

function countHalfPriceGoodsSavedFee(selectedItemsObj) {
  let halfPriceGoodsArr = countHalfPriceGoodsBarcode();

  let halfPriceGoodsSavedFee = 0;

  for(let singleItem in selectedItemsObj){

    if(halfPriceGoodsArr.includes(singleItem)){

      //单价
      let goodsPrice = getGoodsPrice(singleItem);
      //console.log("单价",goodsPrice);

      halfPriceGoodsSavedFee += selectedItemsObj[singleItem] * goodsPrice;
    }

  }

  return halfPriceGoodsSavedFee;
}

function getGoodsPrice(barcode) {
  let allItems = loadAllItems();

  let specifiedBarcodeArr = allItems.filter(function (singleItem) {
    return singleItem["id"] == barcode;
  });

  return specifiedBarcodeArr[0]["price"];

}

function singleItemInfo(selectedSingleItem,allItems,selectedItemsObj) {

  let itemDetailArr = allItems.filter(function (item) {
    return item["id"] == selectedSingleItem;
  });

  let singleItemSum = selectedItemsObj[selectedSingleItem] * itemDetailArr[0]["price"];

  let singleItemInfoStr = `${itemDetailArr[0]["name"]} x ${selectedItemsObj[selectedSingleItem]} = ${singleItemSum}元\n`;

  //console.log(singleItemInfoStr);

  return singleItemInfoStr;
}

function getSingleItemSum(selectedSingleItem,allItems,selectedItemsObj) {

  let itemDetailArr = allItems.filter(function (item) {
    return item["id"] == selectedSingleItem;
  });

  let singleItemSum = selectedItemsObj[selectedSingleItem] * itemDetailArr[0]["price"];

  return singleItemSum;
}

function calculateItemCount(inputs) {
   let allItemsObj = {};

   inputs.map(function (item) {
     calculateSingleItem(item,allItemsObj);
   });

   //console.log(allItemsObj);

   return allItemsObj;
}

function calculateSingleItem(item,allItemsObj) {

  let itemInformationArr = item.split(" ");
  let itemBarcode = itemInformationArr[0];
  let itemNumber = itemInformationArr[2];
  allItemsObj[itemBarcode] = itemNumber;

}

let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];

bestCharge(inputs);

//["ITEM0013 x 4", "ITEM0022 x 1"]
