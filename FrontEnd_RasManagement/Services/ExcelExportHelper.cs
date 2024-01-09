using System;
using System.Data;
using System.IO;
using OfficeOpenXml;

public class ExcelExportHelper
{
    public static byte[] ExportDataTableToExcel(DataTable dataTable, string sheetName)
    {
        using (var package = new ExcelPackage())
        {
            // Add a new worksheet to the Excel package
            var worksheet = package.Workbook.Worksheets.Add(sheetName);

            // Load the data from DataTable to the Excel worksheet
            worksheet.Cells["A1"].LoadFromDataTable(dataTable, true);

            // Save the Excel package to a MemoryStream
            using (var stream = new MemoryStream())
            {
                package.SaveAs(stream);
                return stream.ToArray();
            }
        }
    }
}
