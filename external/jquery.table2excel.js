/*  调用方法:
 *   $('#test_table').table2excel({//'#test_table' table的id
 *       subtotal: 1,//可选参数(可删除此行),默认值:0
 *       width:200,//导出excel表格的宽度百分比的值(不含%号),可删除此行(默认100%)
 *       filename: 'excel_' + new Date().getTime() + '.xls', //excel文件名称,扩展名:.xlsx 或者.xls
 *   });
 */
(function ($, window, document, undefined) {
    var pluginName = "table2excel",
        defaults = {
            exclude: ".noExl",
            name: "Table2Excel",
            filename: "table2excel",
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true,
            preserveColors: false,
            subtotal: 0,//"合计"行所在的行号(不包括标题行),0表示没有合计行...
            width: 100,//表格宽度百分比,默认100%
        };
    //插件配置
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function () {
            var e = this;
            var w = getWidth(e.settings);//导出EXCEL表格的宽度,默认100%
            var utf8Heading = "<meta http-equiv=\"content-type\" content=\"application/vnd.ms-excel; charset=UTF-8\">";
            e.template = {
                head: "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\">" + utf8Heading + "<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>",
                sheet: {
                    head: "<x:ExcelWorksheet><x:Name>",
                    tail: "</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>"
                },
                mid: "</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>",
                table: {
                    head: " <table border='1' style='width:" + w + "%;'>",//<table>的边框&宽度
                    tail: " </table>"
                },
                foot: "</body></html>"
            };
            e.tableRows = [];
 
            //读取原始表
            var rowNumber = 0;//行号
            $(e.element).each(function (i, o) {
                var tempRows = "";//table的html
                $(o).find("tr").not(e.settings.exclude).each(function (i, p) {
                    //<tr>的样式
                    var trStyles = "";//整行样式
                    //开始创建一行表格
                    if (trStyles) {
                        tempRows += "<tr align='center' style='" + trStyles + "'>";//内容居中：align='center'
                    }
                    else {
                        tempRows += "<tr align='center'>";//内容居中：align='center'
                    }
                    //读取原始<table>的<th>表头行(表头必须是<th>！表头如果是<td>的话则会当做普通数据行处理...)
                    $(p).find("th").not(e.settings.exclude).each(function (i, q) {
                        //<th>的样式:
                        var thStyles = "background-color: red;";
                        var rc = {
                            rows: $(this).attr("rowspan"),
                            cols: $(this).attr("colspan"),
                            flag: $(q).find(e.settings.exclude)
                        };
                        if (rc.flag.length > 0) {
                            tempRows += "<td> </td>"; //空格!
                        } else {
                            tempRows += "<td";
                            if (rc.rows > 0) {
                                tempRows += " rowspan='" + rc.rows + "' ";//跨行
                            }
                            if (rc.cols > 0) {
                                tempRows += " colspan='" + rc.cols + "' ";//跨列
                            }
                            if (thStyles) {
                                tempRows += " style='" + thStyles + "'";//样式
                            }
                            tempRows += ">" + $(q).html() + "</td>";//内容
                        }
                    });
 
                    //读取原始<table>的<td>数据行
                    $(p).find("td").not(e.settings.exclude).each(function (i, q) {
                        //<td>的样式
                        var tdStyles = "background-color:yellow;";//合计行的样式
                        var rc = {
                            rows: $(this).attr("rowspan"),
                            cols: $(this).attr("colspan"),
                            flag: $(q).find(e.settings.exclude)
                        };
                        if (rc.flag.length > 0) {
                            tempRows += "<td> </td>"; //空格！                       
                        } else {
                            tempRows += "<td ";
                            if (rc.rows > 0) {
                                tempRows += " rowspan='" + rc.rows + "' ";//跨行
                            }
                            if (rc.cols > 0) {
                                tempRows += " colspan='" + rc.cols + "' ";//跨列
                            }
                            var subtotal = getSubtotal(e.settings);//获取"合计"行所在的行号(不包括标题行)
                            if (rowNumber == subtotal) {//if(当前行行号 == 合计行行号)
                                if (tdStyles) {
                                    tempRows += " style='mso-number-format:\"\@\"; " + tdStyles + "' ";//样式
                                }
                                else {
                                    tempRows += " style='mso-number-format:\"\@\";' ";//纯文本
                                }
                            }
                            else {
                                tempRows += " style='mso-number-format:\"\@\";' ";//纯文本
                            }
                            tempRows += ">" + $(q).html() + "</td>";
                        }
                    });
                    tempRows += "</tr>";//生成一行结束
                    rowNumber++;//行号+1
                });
                // exclude img tags
                if (e.settings.exclude_img) {
                    tempRows = exclude_img(tempRows);
                }
                // exclude link tags
                if (e.settings.exclude_links) {
                    tempRows = exclude_links(tempRows);
                }
                // exclude input tags
                if (e.settings.exclude_inputs) {
                    tempRows = exclude_inputs(tempRows);
                }
                e.tableRows.push(tempRows);
            });
            e.tableToExcel(e.tableRows, e.settings.name, e.settings.sheetName);
        },
        tableToExcel: function (table, name, sheetName) {
            var e = this, fullTemplate = "", i, link, a;
            e.format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                });
            };
            sheetName = typeof sheetName === "undefined" ? "Sheet" : sheetName;
            e.ctx = {
                worksheet: name || "Worksheet",
                table: table,
                sheetName: sheetName
            };
            fullTemplate = e.template.head;
            if ($.isArray(table)) {
                Object.keys(table).forEach(function (i) {
                    //fullTemplate += e.template.sheet.head + "{worksheet" + i + "}" + e.template.sheet.tail;
                    fullTemplate += e.template.sheet.head + sheetName + i + e.template.sheet.tail;
                });
            }
            fullTemplate += e.template.mid;
            if ($.isArray(table)) {
                Object.keys(table).forEach(function (i) {
                    fullTemplate += e.template.table.head + "{table" + i + "}" + e.template.table.tail;
                });
            }
            fullTemplate += e.template.foot;
            for (i in table) {
                e.ctx["table" + i] = table[i];
            }
            delete e.ctx.table;
            var isIE = navigator.appVersion.indexOf("MSIE 10") !== -1 || (navigator.userAgent.indexOf("Trident") !== -1 && navigator.userAgent.indexOf("rv:11") !== -1); // this works with IE10 and IE11 both :)
            //if (typeof msie !== "undefined" && msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // this works ONLY with IE 11!!!
            if (isIE) {
                if (typeof Blob !== "undefined") {
                    //use blobs if we can
                    fullTemplate = e.format(fullTemplate, e.ctx); // with this, works with IE
                    fullTemplate = [fullTemplate];
                    //convert to array
                    var blob1 = new Blob(fullTemplate, { type: "text/html" });
                    window.navigator.msSaveBlob(blob1, getFileName(e.settings));
                } else {
                    //otherwise use the iframe and save
                    //requires a blank iframe on page called txtArea1
                    txtArea1.document.open("text/html", "replace");
                    txtArea1.document.write(e.format(fullTemplate, e.ctx));
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, getFileName(e.settings));
                }
 
            } else {
                var blob = new Blob([e.format(fullTemplate, e.ctx)], { type: "application/vnd.ms-excel" });
                window.URL = window.URL || window.webkitURL;
                link = window.URL.createObjectURL(blob);
                a = document.createElement("a");
                a.download = getFileName(e.settings);
                a.href = link;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            return true;
        }
    };
    //获取excel文件名
    function getFileName(settings) {
        return (settings.filename ? settings.filename : "table2excel");
    }
    //获取"合计"行所在的行号(不包括标题行)
    function getSubtotal(settings) {
        return (settings.subtotal ? settings.subtotal : 0);//默认值0
    }
    //导出Excel的表格宽度百分比的值(不含%号),默认100%
    function getWidth(settings) {
        return (settings.width ? settings.width : 100);
    }
    // Removes all img tags
    function exclude_img(string) {
        var _patt = /(\s+alt\s*=\s*"([^"]*)"|\s+alt\s*=\s*'([^']*)')/i;
        return string.replace(/<img[^>]*>/gi, function myFunction(x) {
            var res = _patt.exec(x);
            if (res !== null && res.length >= 2) {
                return res[2];
            } else {
                return "";
            }
        });
    }
    // Removes all link tags
    function exclude_links(string) {
        return string.replace(/<a[^>]*>|<\/a>/gi, "");
    }
    // Removes input params
    function exclude_inputs(string) {
        var _patt = /(\s+value\s*=\s*"([^"]*)"|\s+value\s*=\s*'([^']*)')/i;
        return string.replace(/<input[^>]*>|<\/input>/gi, function myFunction(x) {
            var res = _patt.exec(x);
            if (res !== null && res.length >= 2) {
                return res[2];
            } else {
                return "";
            }
        });
    }
    $.fn[pluginName] = function (options) {
        var e = this;
        e.each(function () {
            if (!$.data(e, "plugin_" + pluginName)) {
                $.data(e, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
        // chain jQuery functions
        return e;
    };
})(jQuery, window, document);