$(document).ready(function() {
	$("#generate-excel").click(function() {
		/* excel = new ExcelGen({
			"src_id": "test_table",
			"show_header": true
		});
		if (stauts) {
			excel.generate();
		} */
		
		$('#test_table').table2excel({//'#test_table' table的id
		    //  subtotal: 1,//可选参数(可删除此行),默认值:0
		     // width:200,//导出excel表格的宽度百分比的值(不含%号),可删除此行(默认100%)
		      filename: '携物出门' + new Date().getTime() + '.xls', //excel文件名称,扩展名:.xlsx 或者.xls
		 });
	});
});

/* 获取当前时间 */
function currentTime() {
	var d = new Date(),
		str = '';
	//str += d.getFullYear()+'年';
	str += d.getMonth() + 1 + '-' //'月';
	str += d.getDate(); //+'日';
	//str += d.getHours()+'时';
	//str  += d.getMinutes()+'分';
	//str+= d.getSeconds()+'秒';
	return str;
};

//setInterval(function(){$('#time').html(currentTime)},1000);

/* 按钮确定事件 */
$(document).keydown(function(event) {
	//alert(event.which);
	if (event.which == 13) {
		event.preventDefault();
		var ot = document.activeElement.id; //获取当前焦点id
		var into = ot.slice(0. - 1);
		var xia = 'code' + into.toString();
		var nu = "numb" + into.toString();
		if (ot == nu) {
			$("#" + ot).blur();
			$("#" + xia).focus();
		} else if (ot == xia) {
			var add1 = $("#add1").attr("disabled");
			var add2 = $("#add2").attr("disabled");
			if ("disabled" != add1 && "disabled" != add1) {
				addBase(into);
			} else {
				ale("数据已锁定", "");
			}

		}
	}
});

/* 添加数据 */
function addBase(whe) {
	if (whe == 1) { //初步获取数据
		addtxt('#tb1', '#numb1', '#code1')
		clsy('#numb1', '#code1') //数据清空

	} else if (whe == 2) { //校验数据
		addtxt('#tb2', '#numb2', '#code2')
		clsy('#numb2', '#code2') //数据清空

	} else if (whe = 3) { //添加数据到表格

	}
};
/* 通过传入id添加数据 */
function addtxt(ids, numbs, codes) {
	//var su=false;
	var num = $(numbs).val();
	var code = $(codes).val();
	if (num != "" && code != "") {
		if (isNaN(num)) {
			ale("输入的数量有误", sulian);
			//clsy(numbs,codes);
			return
		}
		//var	id=ids+" tbody:last";
		$(ids).append('<tr><td><span>' + code + '</span></td><td><span>' + num + '</span></td></tr>')
		addchu(ids, code, num);
		//su=true
	} else {
		ale("数据录入失败，编码或数量未输入！", luru)
	}
	//return su
};
/* 清空表格数据 */
function clsy(num, code) {
	$(num).val("");
	$(code).val("");
	$(num).focus();
}


/* 清除所有数据 */
function cleanAll() {
	startMP3(clsa);
	if (confirm("是否清除所有数据？")) {
		stauts = false;
		showEnd(stauts);
		$('tbody').html("");
		isreadly = []; //比对结果
		tab1info = []; //获取初始行数据
		tab2info = []; //获取检验行数据
		enters = []; //获取最终数据
		numbers = []; //获取数量用于统计
		chu = [];
		fu = [];
	}
}

var sulian = "./arrio/wenyou/suliang.mp3";
var clsa = "./arrio/wenyou/cleanAll.mp3";
var luru = "./arrio/wenyou/luruError.mp3"
var gege = "gege.mp3";
/* 共用提示 */
function ale(message, arroid) {
	if ("" != arroid) {
		startMP3(arroid);
	}
	alert(message);
}

/* 播放背景音乐 */
function startMP3(srcs) {
	var audio = document.getElementById('music1');
	audio.src = srcs;
	if (audio !== null) { //判断是否获得
		if (audio.paused) { //获得播放状态,这个属性应该是是否是暂停状态,如果是就播放,如果不是暂停就暂停
			audio.play();
		} else {
			audio.pause();
		}
	}
}