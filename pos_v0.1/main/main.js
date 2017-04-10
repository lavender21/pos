'use strict';

function printReceipt(inputs) {
  var inputList = countItemNum(inputs);
  var result = calculateTotalPrice(inputList);
  var result = printResultList(result)
  console.log(result);
}

function countItemNum(inputList) {
  var itemKey = {};
  var countList = [];
  inputList.forEach(function(item){
    if (itemKey[item.barcode] > -1){
      countList[itemKey[item.barcode]].count++;
    }
    else{
      var itemObj = {};
      itemObj.item = item;
      itemObj.count = 1;
      countList.push(itemObj);
      itemKey[item.barcode] = countList.length-1;
    }
  });
  console.log(countList);
  return countList;
}

function calculateTotalPrice(inputList) {
  var sumTotal = 0;
  inputList.forEach(function (item) {
    item.totalPrice = item.count * item.item.price;
    sumTotal += item.totalPrice;
    item.item = JSON.stringify(item.item);
  });
  var resultList = {itemList:inputList, sumTotal:sumTotal};
  console.log(resultList);
  return resultList;
}

function printResultList(resultList) {
  var strTitle = "***<没钱赚商店>收据***\n";
  var strList = "";
  var strSumTotal = "----------------------\n"+
  "总计：" + resultList.sumTotal.toFixed(2) + "(元)\n"+
  "**********************";
  resultList.itemList.forEach(function (value) {
    var obj = JSON.parse(value.item);
    strList += "名称："+obj.name+"，数量："+value.count+obj.unit+
      "，单价："+Number(obj.price).toFixed(2)+"(元)，小计："+
      Number(value.totalPrice).toFixed(2)+"(元)\n"
  });
  console.log(strTitle+strList+strSumTotal);
  return strTitle+strList+strSumTotal;
}

const inputs = [
  {
    barcode: 'ITEM000000',
    name: '可口可乐',
    unit: '瓶',
    price: 3.00

  },
  {
    barcode: 'ITEM000000',
    name: '可口可乐',
    unit: '瓶',
    price: 3.00
  },
  {
    barcode: 'ITEM000000',
    name: '可口可乐',
    unit: '瓶',
    price: 3.00
  },
  {
    barcode: 'ITEM000000',
    name: '可口可乐',
    unit: '瓶',
    price: 3.00
  },
  {
    barcode: 'ITEM000000',
    name: '可口可乐',
    unit: '瓶',
    price: 3.00
  },
  {
    barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3.00
  },
  {
    barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3.00
  },
  {
    barcode: 'ITEM000004',
    name: '电池',
    unit: '个',
    price: 2.00
  }
];
var inputList = countItemNum(inputs);
var result = calculateTotalPrice(inputList);
printResultList(result);
