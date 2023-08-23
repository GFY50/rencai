var excelData = {}
var dataKeys = []

function clea() {
	dataKeys = []
	excelData = {}
}
$(document).ready(function() {
	$('#excel-file').change(function(e) {
		var files = e.target.files;
		var fileReader = new FileReader();
		fileReader.onload = function(ev) {
			try {
				var data = ev.target.result
				var workbook = XLSX.read(data, {
					type: 'binary'
				}) // 以二进制流方式读取得到整份excel表格对象
				var persons = []; // 存储获取到的数据
			} catch (e) {
				console.log('文件类型不正确');
				return;
			}
			// 表格的表格范围，可用于判断表头是否数量是否正确
			var fromTo = '';
			// 遍历每张表读取
			for (var sheet in workbook.Sheets) {
				if (workbook.Sheets.hasOwnProperty(sheet)) {
					fromTo = workbook.Sheets[sheet]['!ref'];
					// console.log(fromTo);
					persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
					//break; // 如果只取第一张表，就取消注释这行
				}
			}
			clea(); //清数据
			//在控制台打印出来表格中的数据
			excelData = persons //获取数据
			dataKeys = dataKey(excelData[0]) //获取数据的键
			console.log(persons);
			getJson()
		};
		// 以二进制方式打开文件
		fileReader.readAsBinaryString(files[0]);
	});
});


//模拟校验规则
packJson = [{
		"name": "id",
		"length": 1
	} //, {
	// 	"name": "name",
	// 	"length": "30"
	// }
];

function getJson() {
	for (var i = 0; i < packJson.length; i++) { //遍历规则
		console.log(packJson[i].name); //获取规则的名称
		if (itExist(packJson[i].name, dataKeys)) { //判断规则名称在data数据中是否存在这一列
			//获取数据进行校验
			var colName = getList(packJson[i].name, excelData);
			//接收判断结果
			var lengthError = nums(packJson[i].length, colName);
			append(lengthError, "数据长度错误!", packJson[i].name)
		}
	}
}
//获取json的key
function dataKey(excelKey) {
	var key = []
	for (let keys in excelKey) {
		key.push(keys);
	}
	return key;
}
//判断key是否存在数据中
function itExist(key, keys) {
	for (var i = 0; i < keys.length; i++) {
		if (key == keys[i]) {
			return true
		}
	}
	return false;
}
//通过key获取value
function getList(keyl, keyData) {
	var keys = []
	for (var i = 0; i < keyData.length; i++) {
		var data2 = keyData[i]
		console.log(data2[keyl])
		keys.push(data2[keyl]);
	}

	return keys;
}


//判断长度
function nums(length, num) {
	var numError = []
	for (var i = 0; i < num.length; i++) {
		var len=num[i]+"";
		if (length < len.length) {
			var error = [];
			error.push(num[i]);
			error.push(i+2)
			numError.push(error);
		}
	}
	return numError;
}
//错误数据,错误类型,key命
function append(Error, type, line) {
	for (var i = 0; i < Error.length; i++) {
		var errorData = Error[i];
		var str = '<tr><td>' + errorData[0] + '</td><td>' + type + '</td><td>所在列' + line + ',所在行' + errorData[1] +
			'</td></tr>'
		$("#error").append(str)
	}
}