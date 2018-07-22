let loadAllItems = require("./items");
let Promotions = require("./promotions");

function bestCharge(selectedItems) {

  let selectedItemsObj = calculateItemCount(selectedItems);
  let printInfoArr = [];
  let allItems = loadAllItems();

  let printResult = `============= 订餐明细 =============\n`;

  console.log(allItems);

  for(let selectedSingleItem in selectedItemsObj){

    printResult += singleItemInfo(selectedSingleItem,allItems,selectedItemsObj);

  }

  console.log(printResult);
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

function calculateItemCount(inputs) {
   let allItemsObj = {};

   inputs.map(function (item) {
     calculateSingleItem(item,allItemsObj);
   });

   console.log(allItemsObj);

   return allItemsObj;
}

function calculateSingleItem(item,allItemsObj) {

  let itemInformationArr = item.split(" ");
  let itemBarcode = itemInformationArr[0];
  let itemNumber = itemInformationArr[2];
  allItemsObj[itemBarcode] = itemNumber;

}

// ```
// ============= 订餐明细 =============
// 肉夹馍 x 4 = 24元
// -----------------------------------
// 总计：24元
// ===================================
// ```

let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];

bestCharge(inputs);

//["ITEM0013 x 4", "ITEM0022 x 1"]
