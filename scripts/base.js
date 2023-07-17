//设置当前状态
var stauts = false;
var isreadly = []; //比对结果
var tab1info = []; //获取初始行数据
var tab2info = []; //获取检验行数据
var enters = []; //获取最终数据
var numbers = []; //获取数量用于统计
var chu = [];
var fu = [];
let Img = new Image();
/* 获取table数据 tabId*/
function tableBdui(tabId) {
	var code = [];
	var codeNum = [];
	var tb1 = $(tabId);
	var han = $(tabId + " tr").length; //行数
	var lie = $(tabId + " td").size();
	var conus = []; //二维去重测试
	for (var i = 0; i < han; i++) {
		var tb11 = tb1.children().eq(i);
		getTableTr(tabId, tb11, i);
		codeNum[i] = tb11.text();
		//for (var j = 0; j <= lie; j++) {
		var shuju = tb11.children().eq(0).text();
		var nu = tb11.children().eq(1).text();
		//console.log(shuju);
		//if(j==0){
		code[i] = shuju;
		var lishi = [];
		lishi.push(shuju);
		lishi.push(nu);
		conus.push(lishi);
		//}
		//}
	}
	return arraylis(conus);
	//return code=unique(code);//去重，取真实有效的数据

}
/* 数组去重编码数据去重 */
function unique(arry) {
	return Array.from(new Set(arry))
}
/* 校验数据 */
function jiaoyan() {
	cleanInfo();
	var tab1Base = [];
	var tab2Base = [];
	var readly = []
	tab1Base = tableBdui("#tb1");
	tab2Base = tableBdui("#tb2");
	if (tab1Base.length == 0) {
		ale("无初始数据！", "")
		return;
	} else if (tab2Base.length == 0) {
		ale("无校验数据！", "")
		return;
	}
	/* for (var i = 0; i < tab1Base.length; i++) {
		for (var j = 0; j < tab2Base.length; j++) {
			if(tab1Base[i]==tab2Base[j]){
				readly[i]=tab1Base[i];
			}
		}
	} */
	var blase = islike(tab1Base, tab2Base);
	if (blase) { //readly.length==tab1Base.length&&readly.length==tab2Base.length
		stauts = true;
		//isreadly=tab2Base;
		enters = tab2Base;
	} else {
		stauts = false;
	}
	showEnd(stauts)
}
/* 显示比对状态 */
function showEnd(staut) {
	if (staut) {
		$("#zhuantai").text("比对成功！锁定数据")
		$("#zhuantai").removeClass()
		$("#zhuantai").addClass('gre')
		$("#add1").attr("disabled", "false");
		$("#add2").attr("disabled", "false");
		$("#lock").css("display", "block");
		//alert(isreadly.length+'/'+tab1info.length+'/'+tab2info.length)
	} else if (staut == false) {
		$("#zhuantai").text("数据比对状态：未比对成功！")
		$("#zhuantai").removeClass()
		$("#zhuantai").addClass('redd')
		$("#add1").removeAttr("disabled");
		$("#add2").removeAttr("disabled");
		$("#lock").css("display", "none");
		cleanInfo(); //比对不成功，清除比对数据
	}
}

/* 比对后生成数据 */
function shencheng() {
	if (stauts == true) { //
		/* for (var i = 0; i < isreadly.length; i++) {
			getInfo(isreadly[i])
		} */
		$("#test_table tbody tr").remove();
		for (var i = 0; i < enters.length; i++) {
			var line = enters[i];
			$("#test_table tbody").append('<tr><td>物料</td><td>生产物料</td><td><span>' + line[0] +
				'</span></td><td></td><td><span>' + line[1] + '</span></td><td>PCS</td><td>' + currentTime() +
				'</td><td></td></tr>')
		}
		enters = [] //生成数据后暂时清空数据
	} else if (stauts == false) {
		ale("数据未比对", "");
	}
}

/* 获取table所有行数据 
id哪个table
info数据
line：第几条数据
*/
function getTableTr(id, info, line) {
	if (id == "#tb1") {
		tab1info[line] = info
	} else if (id == "#tb2") {
		tab2info[line] = info
	}
}

/* 清空比对结果 */
function cleanInfo() {
	isreadly = []; //比对结果
	tab1info = []; //获取初始行数据
	tab2info = []; //获取检验行数据
}

/* 生成数据，使用校验提取数据 ,必须先经过校验*/
/* function getInfo(code){
	var isget=false;
	for (var i = 0; i < tab2info.length; i++) {
		var tb2line=tab2info[i]
		var tb2Code=tb2line.children().eq(0).text();
		//console.log(code+"/"+tb2Code);
		if(code==tb2Code){
			var linshi=[];
			linshi[0]=tb2Code;
			linshi[1]=tb2line.children().eq(1).text();
			numbers.push(linshi[1])
			enters.push(linshi);
			isget=true;
			return;
		}
		console.log(isget);
	}
} */

/* 解锁添加数据 */
function openLock() {
	var add1 = $("#add1").attr("disabled");
	var add2 = $("#add2").attr("disabled");
	if ("disabled" == add1 || "disabled" == add1) {
		$("#add1").removeAttr("disabled");
		$("#add2").removeAttr("disabled");
		$("#lock").text("锁定数据");
	} else {
		$("#add1").attr("disabled", "false");
		$("#add2").attr("disabled", "false");
		$("#lock").text("解锁数据");
	}
}
/* 截取编码 */
function jiequStr(str) {
	return str.substring(2, 10);
}

/* 拼接总数 */
function addchu(ids, codes, num) {
	var code = codes; //jiequStr(codes);//字符串截取
	if ("#tb1" == ids) {
		chu = tiquDaiMa(chu, code, num);
		htmlPigJie("#lef1 tbody", chu);
	} else if ("#tb2" == ids) {
		fu = tiquDaiMa(fu, code, num);
		htmlPigJie("#rig2 tbody", fu);
	}
}
/* 提取代码 */
function tiquDaiMa(tiqu, code, num) {
	var codenum = [];
	var isadd = false; //是否添加
	if (tiqu.length > 0) {
		for (var i = 0; i < tiqu.length; i++) { //二维数组
			var jie = tiqu[i];
			if (code == jie[0]) {
				jie[1] = parseInt(num) + parseInt(jie[1]); //数量想加后重新赋值
				tiqu[i] = jie;
				isadd = true; //提示数据已添加
				return tiqu;
			}
		}
		if (false == isadd) {
			codenum[0] = code
			codenum[1] = num;
		}
	} else {
		codenum[0] = code
		codenum[1] = num;
	}
	tiqu.push(codenum);
	return tiqu
}
/* code number遍历动态展示 */
function htmlPigJie(ids, shuju) {
	$(ids).html("");
	for (var i = 0; i < shuju.length; i++) {
		var jie = shuju[i]
		$(ids).append('<tr><td><span>' + jie[0] + '</span></td><td><span>' + jie[1] + '</span></td></tr>');
	}
}
/* 单个二维数组去重 双重循环遍历法*/
function arraylis(lis) {
	var end = [];
	for (var i = 0; i < lis.length; i++) {
		var islike = false;
		for (var j = 0; j < end.length; j++) {
			if (lis[i].toString() == end[j].toString()) {
				islike = true;
				break;
			}
		}
		if (!islike) {
			end.push(lis[i])
		}
	}
	console.log(end);
	return end;
}
/* 判断二维数组是否相同 */
function islike(one, two) {
	var ends = false;
	if (one.length == two.length) {
		for (var i = 0; i < one.length; i++) {
			var islike = false;
			for (var j = 0; j < two.length; j++) {
				if (one[i].toString() == two[j].toString()) {
					islike = true;
					ends = true;
					break;
				} else if (two.length - 1 == j) { //如果最后一个都不相等的话，说明数据不一样
					if (one[i].toString() != two[j].toString()) {
						return false;
					} else if (one[i].toString() == two[j].toString()) {
						ends = true;
						islike = true;
						break;
					}

				}
			}

		}
	}
	//console.log(end);
	return ends;
}
/* 打开邮件 */
function openMail() {
	$("#his").css("display", "block");
	$("input[name='getMail']").val("2697243482@qq.com;1359759127@qq.com") //收件人
	$("input[name='names']").val("2697243482@qq.com;1359759127@qq.com") //抄件人
	$("input[name='miGet']").val("2697243482@qq.com;1359759127@qq.com") //抄件人
	$("input[name='subject']").val("D3转k2第1车（夜班）") //主题
	$("input[name='message']").val("") //内容
	// window.location.href = "mailto:user@example.com?subject=Subject&body=message%20goes%20here"; 
	//window.open("mailto:user@example.com?");
}

/* 截图 */
function jieTu() {
	new html2canvas(document.getElementById('test_table'), {
		backgroundColor: "transparent", //背景图片透明
		allowTaint: true, //跨域
		useCORS: true //跨域
	}).then(canvas => {
		// canvas为转换后的Canvas对象
		let oImg = new Image();
		oImg = canvas.toDataURL('image/png'); // 导出图片
		Img = oImg;
		//console.log(oImg)

		var oA = document.createElement("a");
		oA.download = ''; // 设置下载的文件名，默认是'下载'
		oA.href = oImg;
		document.body.appendChild(oA);
		oA.click();
		oA.remove(); // 下载之后把创建的元素删除
	});
}

/* 发送邮件 */
function SenMail() {
	var objFrm = document.frmEmail;
	var objFrmOutLook = document.frmEmailOutLook;
	var msg = "";
	msg += "抄送: " + objFrm.name.value + "  ";
	//msg += "电话: " + objFrm.phone.value + "  ";
	//msg += "网址: " + objFrm.website.value + "  ";
	msg += "主题: " + objFrm.subject.value + "  ";
	//msg += "内容: " + objFrm.message.value + "  ";

	objFrmOutLook.action = "mailto:" + objFrm.getMail.value + "?" +
		"cc=" + objFrm.names.value + "&bcc=" + objFrm.miGet.value + "&subject=" + objFrm.subject.value +
		"&body=" //+bod.html();
		+
		objFrm.message.value;
	objFrmOutLook.submit();
	clipboardImg(Img);
}
/* 关闭邮件 */
function lockMail() {
	$("#his").css("display", "none");
}


async function clipboardImg(url) {
	try {
		const data = await fetch(url);
		const blob = await data.blob();
		await navigator.clipboard.write([
			new window.ClipboardItem({
				[blob.type]: blob
			})
		]);
		//alert('复制成功')
	} catch (err) {
		//alert('复制失败')
	}
}

function openUrl(){
	var tempwindow="http://www.baidu.com";
	//tempwindow.location='www.baidu.com' ;
	//$('a[href^="http://'+tempwindow+'"]').attr("target", "_blank");
	window.open(tempwindow, "_blank");
}

