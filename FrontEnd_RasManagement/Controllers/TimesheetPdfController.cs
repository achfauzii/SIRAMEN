using Microsoft.AspNetCore.Mvc;

using System.Net.Http.Headers;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json;

namespace FrontEnd_RasManagement.Controllers
{
    public class TimesheetPdfController : Controller
    {
        public ActionResult GeneratePdf(string companyName, string month)
        {
            MemoryStream memoryStream = new MemoryStream();
            string Token = HttpContext.Session.GetString("Token");

            // Mendapatkan data dari API
            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
            var response = httpClient.GetAsync($"https://localhost:7177/api/TimeSheet/GetTimeSheetByCompanyNameAndMonth?companyName={companyName}&month={month}").Result;

            if (response.IsSuccessStatusCode)
            {
                var jsonData = response.Content.ReadAsStringAsync().Result;
                var responseData = JsonConvert.DeserializeObject<ApiResponse<TimeSheetEntry>>(jsonData);
                var timeSheetEntries = responseData.Data;

                Document document = new Document(PageSize.A4);
                PdfWriter writer = PdfWriter.GetInstance(document, memoryStream);
                document.Open(); // Buka dokumen di sini

                foreach (var entry in timeSheetEntries)
                {
                    PdfPTable table = new PdfPTable(4);
                    float[] columnWidths = { 10f, 4f, 2.5f, 4f };
                    table.SetWidths(columnWidths);
                    table.WidthPercentage = 100;

                    PdfPCell headerCell = new PdfPCell(new Phrase("Activity", FontFactory.GetFont(FontFactory.HELVETICA_BOLD)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);

                    headerCell = new PdfPCell(new Phrase("Category", FontFactory.GetFont(FontFactory.HELVETICA_BOLD)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);

                    headerCell = new PdfPCell(new Phrase("Status", FontFactory.GetFont(FontFactory.HELVETICA_BOLD)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);

                    headerCell = new PdfPCell(new Phrase("Date", FontFactory.GetFont(FontFactory.HELVETICA_BOLD)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);





                    // Mengisi data ke dalam tabel
                    foreach (var timeSheet in entry.TimeSheets)
                    {
                        PdfPCell activityCell = new PdfPCell(new Phrase(timeSheet.Activity, new Font(Font.FontFamily.HELVETICA, 10.8f)));
                        activityCell.PaddingBottom = 6.6f;
                        table.AddCell(activityCell);

                        PdfPCell categoryCell = new PdfPCell(new Phrase(timeSheet.Category ?? "",new Font(Font.FontFamily.HELVETICA, 10.8f)));
                        categoryCell.PaddingBottom = 6.6f;
                        table.AddCell(categoryCell);

                        PdfPCell statusCell = new PdfPCell(new Phrase(timeSheet.Status ?? "", new Font(Font.FontFamily.HELVETICA, 10.8f)));
                        statusCell.PaddingBottom = 6.6f;
                        table.AddCell(statusCell);

                        PdfPCell dateCell = new PdfPCell(new Phrase(timeSheet.Date.ToString("dd MMMM yyyy"), new Font(Font.FontFamily.HELVETICA, 10.8f)));
                        dateCell.PaddingBottom = 6.6f;
                        table.AddCell(dateCell);
                    }

                    document.Add(new Paragraph($"Name : {entry.AccountName}"));
                    document.Add(new Paragraph($"Client : {companyName}"));
                    document.Add(new Paragraph(" "));
                    document.Add(table); // Tambahkan tabel ke dokumen


                    // Menambahkan kolom-kolom untuk tanda tangan
                    PdfPTable signatureTable = new PdfPTable(3); // Tiga kolom untuk tanda tangan
                    signatureTable.WidthPercentage = 60;
                    signatureTable.SpacingBefore = 40f; // Spasi sebelum tempat tanda tangan
                    signatureTable.HorizontalAlignment = Element.ALIGN_RIGHT;

                    // Kolom pertama untuk tanda tangan pegawai
                    PdfPCell employeeSignatureCell = new PdfPCell(new Phrase("TTD Pegawai", FontFactory.GetFont(FontFactory.HELVETICA, 10f)));
                    employeeSignatureCell.Border = PdfPCell.NO_BORDER;
                    signatureTable.AddCell(employeeSignatureCell);

                    // Kolom kedua untuk tanda tangan yang mengetahui
                    PdfPCell acknowledgedByCell = new PdfPCell(new Phrase("Diketahui Oleh", FontFactory.GetFont(FontFactory.HELVETICA, 10f)));
                    acknowledgedByCell.Border = PdfPCell.NO_BORDER;
                    acknowledgedByCell.PaddingLeft = 2f;
                    signatureTable.AddCell(acknowledgedByCell);

                    // Kolom ketiga untuk tanda tangan yang mengetahui
                    PdfPCell acknowledgedByCell2 = new PdfPCell(new Phrase("Diketahui Oleh", FontFactory.GetFont(FontFactory.HELVETICA, 10f)));
                    acknowledgedByCell2.Border = PdfPCell.NO_BORDER;
                    acknowledgedByCell2.PaddingLeft = 2f;
                    signatureTable.AddCell(acknowledgedByCell2);

                    // Menambahkan nama di bawah setiap kolom tanda tangan
                    PdfPCell employeeNameCell = new PdfPCell(new Phrase(entry.AccountName, FontFactory.GetFont(FontFactory.HELVETICA, 10f)));
                    employeeNameCell.Border = PdfPCell.NO_BORDER;
                    employeeNameCell.PaddingTop = 35f;
                    signatureTable.AddCell(employeeNameCell);

                    PdfPCell acknowledgedByNameCell = new PdfPCell(new Phrase("Bella Oktavia", FontFactory.GetFont(FontFactory.HELVETICA, 10f)));
                    acknowledgedByNameCell.Border = PdfPCell.NO_BORDER;
                    acknowledgedByNameCell.PaddingTop = 35f;
                    acknowledgedByNameCell.PaddingLeft = 2f;
                    signatureTable.AddCell(acknowledgedByNameCell);

                    PdfPCell acknowledgedByNameCell2 = new PdfPCell(new Phrase(entry.Pic, FontFactory.GetFont(FontFactory.HELVETICA, 10f)));
                    acknowledgedByNameCell2.Border = PdfPCell.NO_BORDER;
                    acknowledgedByNameCell2.PaddingTop = 35f;
                    acknowledgedByNameCell2.PaddingLeft = 2f;
                    signatureTable.AddCell(acknowledgedByNameCell2);
                   
                    document.Add(signatureTable);




                    document.NewPage(); // Pindah ke halaman baru untuk entri selanjutnya
                }

                document.Close(); // Tutup dokumen di sini setelah selesai menghasilkan konten
                return File(memoryStream.ToArray(), "application/pdf", $"Recaptimesheet_{companyName}.pdf");
            }
            else
            {
                return Content("Failed to fetch data from API.");
            }
        }


        public class TimeSheetEntry
        {
            public string AccountId { get; set; }
            public string AccountName { get; set; }
            public string Pic { get; set; }
            public int WfhCount { get; set; }
            public int WfoCount { get; set; }
            public List<TimeSheet> TimeSheets { get; set; }
        }

        public class TimeSheet
        {
            public int TimeSheetId { get; set; }
            public string Activity { get; set; }
            public string Category { get; set; }
            public string Status { get; set; }
            public DateTime Date { get; set; }
        }


        public class ApiResponse<T>
        {
            public int Status { get; set; }
            public string Message { get; set; }
            public List<T> Data { get; set; }
        }
    }
}
