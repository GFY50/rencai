using System;
using System.Drawing.Printing;

namespace ZebraPrinterPrinting
{
    class Program
    {
        static void Main(string[] args)
        {
            // 创建一个PrintDocument对象
            PrintDocument pd = new PrintDocument();

            // 设置打印作业的属性
            pd.PrinterSettings.PrinterName = "Zebra GX430t";
            pd.DocumentName = "Zebra Printer Printing";

            // 定义要打印的文本
            string printText = "Hello, Zebra Printer!";

            // 将文本添加到打印作业中
            pd.PrintPage += new PrintPageEventHandler(PrintPage);

            // 调用Print方法将打印作业发送到打印机
            pd.Print();
        }

        private static void PrintPage(object sender, PrintPageEventArgs e)
        {
            // 获取打印机的Graphics对象
            Graphics g = e.Graphics;

            // 设置字体和字体大小
            Font font = new Font("Arial", 10);

            // 计算文本的宽度和高度
            float textWidth = g.MeasureString(printText, font).Width;
            float textHeight = g.MeasureString(printText, font).Height;

            // 将文本绘制到打印页面上
            g.DrawString(printText, font, Brushes.Black, 100, 100);
        }
    }
}