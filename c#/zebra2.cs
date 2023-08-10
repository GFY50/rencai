using System;
using System.Drawing.Printing;

namespace ZebraPrinterQRCodePrinting
{
    class Program
    {
        static void Main(string[] args)
        {
            // 创建一个PrintDocument对象
            PrintDocument pd = new PrintDocument();

            // 设置打印作业的属性
            pd.PrinterSettings.PrinterName = "Zebra GX430t";
            pd.DocumentName = "QR Code Printing";

            // 定义要打印的QR代码数据
            string qrCodeData = "https://www.example.com";

            // 生成QR代码图像
            Bitmap qrCodeBitmap = GenerateQRCode(qrCodeData);

            // 将QR代码图像转换为ZPL格式的位图
            string zplBitmap = ConvertQRCodeBitmapToZPL(qrCodeBitmap);

            // 将ZPL位图添加到打印作业中
            pd.PrintPage += new PrintPageEventHandler(PrintPage);

            // 调用Print方法将打印作业发送到打印机
            pd.Print();
        }

        private static Bitmap GenerateQRCode(string data)
        {
            // 使用第三方库生成QR代码图像（例如ZXing.Net）
            Bitmap qrCodeBitmap = new BarcodeLib.Barcode().Encode(BarcodeLib.TYPE.QR, data, Color.Black, Color.White, 200, 200);
            return qrCodeBitmap;
        }

        private static string ConvertQRCodeBitmapToZPL(Bitmap qrCodeBitmap)
        {
            // 将QR代码图像转换为ZPL格式的位图（例如使用Zebra Programming Language (ZPL)）
            string zplBitmap = "";
            using (MemoryStream memoryStream = new MemoryStream())
            {
                qrCodeBitmap.Save(memoryStream, ImageFormat.Png);
                zplBitmap = "^XA^FO20,20^BY2^BCN,100,Y^FD" + System.Text.Encoding.UTF8.GetBytes(memoryStream.ToArray()) + "^FS^XZ";
            }
            return zplBitmap;
        }

        private static void PrintPage(object sender, PrintPageEventArgs e)
        {
            // 获取打印机的Graphics对象
            Graphics g = e.Graphics;

            // 将ZPL位图发送到打印机
            g.DrawImage(ConvertZPLBitmapToImage(zplBitmap), 100, 100);
        }

        private static Image ConvertZPLBitmapToImage(string zplBitmap)
        {
            // 将ZPL格式的位图转换为图像（例如使用ZXing.Net）
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(zplBitmap.Substring(zplBitmap.Length - 24));
            MemoryStream memoryStream = new MemoryStream(bytes);
            return new BarcodeLib.Barcode().Decode(memoryStream.ToArray()).Image;
        }
    }
}