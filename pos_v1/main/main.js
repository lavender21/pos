'use strict';

function getCartItemList(tagsCount) {
  let allItemList = loadAllItems();
  return allItemList.filter((item) => {
    return tagsCount.hasOwnProperty(item.barcode);
  });
}

function calculateSumTotalAndSaveTotal(tagsList) {
  let sumTotalAfterFree = tagsList.itemList.map((item) => {
    return item.totalPrice;
  }).reduce((acc, item) => {
    return acc + item;
  });
  tagsList.saveTotal = tagsList.sumTotal === 0 ? 0 : tagsList.sumTotal - sumTotalAfterFree;
  tagsList.sumTotal = sumTotalAfterFree;
}

function getBuyTwoGetOneFreeItem(tagsCount) {
  let promotionList = loadPromotions();
  let promotionIndex = promotionList.map((item) => {
    return item.type;
  }).indexOf('BUY_TWO_GET_ONE_FREE');
  if (promotionIndex > -1) {
    return promotionList[promotionIndex].barcodes.filter((item) => {
      return tagsCount.hasOwnProperty(item);
    });
  }
  else {
    return [];
  }
}

function generateBuyTwoGetOneFreeItem(goodsItem) {
  let subCount = Math.floor(goodsItem.count / 3);
  goodsItem.totalPrice -= goodsItem.item.price * subCount;
  return goodsItem;
}

function getIndexOfItemList(itemList, barcode) {
  return itemList.map((value) => {
    return value.item.barcode;
  }).indexOf(barcode);
}

function countItemNum(tags) {
  let itemObj = {};
  tags.forEach((item) => {
    let arr = item.split('-');
    if (itemObj.hasOwnProperty(arr[0])) {
      itemObj[arr[0]] += Number(arr[1]) || 1;
    } else {
      itemObj[arr[0]] = Number(arr[1]) || 1;
    }
  });
  return itemObj;
}

function BuyTwoGetOneFree(item, count) {

}

function generatePromotion(promotions, item, count) {
  let typeList = promotions.filter(item => {
    return item.barcodes.indexOf(item.barcode) > -1;
  }).map(item => {
    return item.type;
  });
  let result = 0;
  switch (typeList) {
    case 'BUY_TWO_GET_ONE_FREE':
      result = BuyTwoGetOneFree(item, count);
      break;
    default:
      break;
  }
  return result;
}

function calculateItemPrice(tagsCount) {
  let tagsList = {itemList: [], sumTotal: 0, saveTotal: 0};
  let cartItemList = getCartItemList(tagsCount);
  tagsList.itemList = cartItemList.map((item) => {
    let count = tagsCount[item.barcode];
    let savePrice = generatePromotion(loadPromotions(), item, count);
    let totalPrice = Number(item.price) * count - savePrice;
    tagsList.sumTotal += totalPrice;
    tagsList.saveTotal += savePrice;
    return Object.assign({}, item,
      {count: count, totalPrice: totalPrice, savePrice: savePrice});
  });
  return tagsList;
}

function promotionItemPrice(tagsList, tagsCount) {
  let buyTwoGetOneFreeItemList = getBuyTwoGetOneFreeItem(tagsCount);
  for (let barcode of buyTwoGetOneFreeItemList) {
    let index = getIndexOfItemList(tagsList.itemList, barcode);
    generateBuyTwoGetOneFreeItem(tagsList.itemList[index]);
  }
  calculateSumTotalAndSaveTotal(tagsList);
  return tagsList;
}

function displayReceipt(promotionTagsList) {
  console.log(promotionTagsList);
  const FIXNUMBER = 2;
  let result = `***<没钱赚商店>收据***\n`;
  promotionTagsList.itemList.forEach((value) => {
    result += `名称：${value.item.name}，数量：${value.count}${value.item.unit}，`+
    `单价：${value.item.price.toFixed(FIXNUMBER)}(元)，小计：${value.totalPrice.toFixed(FIXNUMBER)}(元)\n`
  });
  result += '----------------------\n' +
    `总计：${promotionTagsList.sumTotal.toFixed(FIXNUMBER)}(元)\n` +
    `节省：${promotionTagsList.saveTotal.toFixed(FIXNUMBER)}(元)\n` +
    '**********************';
  console.log(result);
}

function printReceipt(tags) {
  let tagsCount = countItemNum(tags);
  let tagsList = calculateItemPrice(tagsCount);
  // let promotionTagsList = promotionItemPrice(tagsList, tagsCount);
  displayReceipt(tagsList);
}
