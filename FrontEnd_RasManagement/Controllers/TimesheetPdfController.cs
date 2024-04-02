using Microsoft.AspNetCore.Mvc;

using System.Net.Http.Headers;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json;
using System.Globalization;

namespace FrontEnd_RasManagement.Controllers
{
    public class TimesheetPdfController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public TimesheetPdfController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        public ActionResult GeneratePdf(string companyName, string month)
        {

            //Get Holiday
            var holidayHttpClient = new HttpClient();
            var holidayResponse = holidayHttpClient.GetAsync("https://localhost:7177/api/MasterHoliday").Result;

            List<Holiday> holidays = new List<Holiday>();

            if (holidayResponse.IsSuccessStatusCode)
            {
                var holidayJsonData = holidayResponse.Content.ReadAsStringAsync().Result;
                var holidayData = JsonConvert.DeserializeObject<ApiResponse<Holiday>>(holidayJsonData);
                holidays = holidayData.Data;
            }
            else
            {
                return Content("Failed to fetch holiday data from API.");
            }


          
            string wwwRootPath = _hostingEnvironment.WebRootPath;
            string logoRelativePath = "img/logo_putih.png";
            string companyLogoPath = Path.Combine(wwwRootPath, logoRelativePath);
            string companyAddress = "Alamat Perusahaan Anda";


            MemoryStream memoryStream = new MemoryStream();
            string Token = HttpContext.Session.GetString("Token");

            DateTime dateTimeMonth = DateTime.ParseExact(month, "yyyy-MM", CultureInfo.InvariantCulture);
            string formattedMonth = dateTimeMonth.ToString("MMMM yyyy", CultureInfo.GetCultureInfo("id-ID"));

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
                int count = 1;
    
                
                foreach (var entry in timeSheetEntries)
                {

                    PdfPTable table = new PdfPTable(6);
                    float[] columnWidths = { 3.5f, 10f,1.8f,3.1f, 3f, 5.1f };
                    table.SetWidths(columnWidths);
                    table.WidthPercentage = 100; 

                    PdfPCell headerCell = new PdfPCell(new Phrase("Date", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10.2f)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);

                    headerCell = new PdfPCell(new Phrase("Activity", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10.2f)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);

                    headerCell = new PdfPCell(new Phrase("Flag", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10.2f)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);

                    headerCell = new PdfPCell(new Phrase("Category", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10.2f)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);

                    headerCell = new PdfPCell(new Phrase("Status", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10.2f)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);

                    headerCell = new PdfPCell(new Phrase("Known By", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10.2f)));
                    headerCell.BackgroundColor = new BaseColor(173, 216, 230);
                    headerCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    table.AddCell(headerCell);


                    string previousDate = null; // Menyimpan tanggal sebelumnya
                    string previousDateFlag = null;
                    // Mengisi data ke dalam tabel
                    foreach (var timeSheet in entry.TimeSheets)
                    {

                        string currentDate = timeSheet.Date.ToString("dd MMMM yyyy"); // Ambil tanggal saat ini


                        // Periksa apakah tanggal saat ini sama dengan tanggal sebelumnya
                        if (currentDate != previousDate)
                        {
                            // Jika tanggal saat ini tidak sama dengan tanggal sebelumnya,
                            // tambahkan sel tanggal dengan Rowspan yang sesuai
                            PdfPCell dateCell = new PdfPCell(new Phrase(currentDate, new Font(Font.FontFamily.HELVETICA, 10f)));
                            dateCell.PaddingBottom = 6.6f;

                            // Hitung Rowspan berdasarkan jumlah entri TimeSheets dengan tanggal yang sama
                            int rowspan = entry.TimeSheets.Count(ts => ts.Date.ToString("dd MMMM yyyy") == currentDate);
                            dateCell.Rowspan = rowspan;

                            table.AddCell(dateCell); // Tambahkan sel tanggal ke tabel

                            // Tetapkan tanggal saat ini sebagai tanggal sebelumnya
                            previousDate = currentDate;
                        }
                       /* var holiday = holidays.FirstOrDefault(h => h.date.Date == timeSheet.Date.Date);
                        var addHoliady = holidays.FirstOrDefault(h => h.date.Date != timeSheet.Date.Date);

                        if (holiday != null)
                        {
                            // Jika ada libur pada tanggal tersebut, gunakan aktivitas dari timesheet
                            timeSheet.Activity = timeSheet.Activity;
                        }
                        else
                        {
                            PdfPTable holidayTable = new PdfPTable(1);
                            PdfPCell holidayCell = new PdfPCell(new Phrase(holiday.name, new Font(Font.FontFamily.HELVETICA, 10f)));
                            holidayCell.PaddingBottom = 6.6f;
                            holidayTable.AddCell(holidayCell); 
                            document.Add(holidayTable); // Tambahkan tabel libur ke dalam dokumen
                        }*/

                        PdfPCell activityCell = new PdfPCell(new Phrase(timeSheet.Activity, new Font(Font.FontFamily.HELVETICA, 10f)));
                        activityCell.PaddingBottom = 6.6f;
                        table.AddCell(activityCell);

                        // Periksa apakah tanggal saat ini sama dengan tanggal sebelumnya
                        if (currentDate != previousDateFlag)
                        {
                            // Jika tanggal saat ini tidak sama dengan tanggal sebelumnya,
                            // tambahkan sel tanggal dengan Rowspan yang sesuai
                            PdfPCell flagCell = new PdfPCell(new Phrase(timeSheet.Flag, new Font(Font.FontFamily.HELVETICA, 10f)));
                            flagCell.PaddingBottom = 6.6f;
                            flagCell.HorizontalAlignment = Element.ALIGN_CENTER;

                            // Hitung Rowspan berdasarkan jumlah entri TimeSheets dengan tanggal yang sama
                            int rowspan = entry.TimeSheets.Count(ts => ts.Date.ToString("dd MMMM yyyy") == currentDate);
                            flagCell.Rowspan = rowspan;


                            table.AddCell(flagCell);

                            // Tetapkan tanggal saat ini sebagai tanggal sebelumnya
                            previousDateFlag = currentDate;
                        }

            

                        PdfPCell categoryCell = new PdfPCell(new Phrase(timeSheet.Category ?? "",new Font(Font.FontFamily.HELVETICA, 10f)));
                        categoryCell.PaddingBottom = 6.6f;
                        table.AddCell(categoryCell);

                        PdfPCell statusCell = new PdfPCell(new Phrase(timeSheet.Status ?? "", new Font(Font.FontFamily.HELVETICA, 10f)));
                        statusCell.PaddingBottom = 6.6f;
                        table.AddCell(statusCell);

                        PdfPCell knownByCell = new PdfPCell(new Phrase(timeSheet.KnownBy ?? "", new Font(Font.FontFamily.HELVETICA, 10f)));
                        knownByCell.PaddingBottom = 6.6f;
                        table.AddCell(knownByCell);


                    }


                    // Membuat tabel untuk menyusun logo dan alamat secara sejajar
                    //PdfPTable headingLogo = new PdfPTable(2); // 2 kolom untuk logo dan alamat
                    //headingLogo.WidthPercentage = 100;


                    //iTextSharp.text.Image logo = iTextSharp.text.Image.GetInstance(companyLogoPath);
                    //logo.ScaleAbsolute(128f, 30f); // Sesuaikan ukuran logo sesuai kebutuhan
                    //PdfPCell logoCell = new PdfPCell(logo);
                    //logoCell.Border = PdfPCell.NO_BORDER;
                    //headingLogo.AddCell(logoCell);

                    //Paragraph addressParagraph = new Paragraph(companyAddress);
                    //addressParagraph.Alignment = Element.ALIGN_RIGHT;
                    //PdfPCell addressCell = new PdfPCell(addressParagraph);
                    //addressCell.Border = PdfPCell.NO_BORDER;
                    //headingLogo.AddCell(addressCell);

                    //// Tambahkan tabel ke dalam dokumen
                    //document.Add(headingLogo);



                    document.Add(new Paragraph(" "));
                    // Membuat objek Font dengan properti yang diinginkan
                    Font header = FontFactory.GetFont("HECTIVA", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 10.2f, Font.NORMAL, BaseColor.BLACK);

                    PdfPTable topTable = new PdfPTable(3);
                    topTable.HorizontalAlignment = 0;
                    topTable.TotalWidth = 280f;
                    topTable.SetWidths(new int[] { 70, 10, 200 });
                    topTable.LockedWidth = true;
                    topTable.SpacingBefore = 0;
                    topTable.DefaultCell.Border = Rectangle.NO_BORDER;
                    topTable.AddCell(new Paragraph($"Name",header));
                    topTable.AddCell(new Phrase(":",header));
                    topTable.AddCell(new Phrase(entry.AccountName,header));
                    topTable.AddCell(new Phrase("Role",header));
                    topTable.AddCell(new Phrase(":",header));
                    topTable.AddCell(new Phrase(entry.Position,header));
                    topTable.AddCell(new Phrase("Client Site",header));
                    topTable.AddCell(new Phrase(":", header));
                    topTable.AddCell(new Phrase(companyName,header));
                    topTable.AddCell(new Phrase("Month",header));
                    topTable.AddCell(new Phrase(":",header));
                    topTable.AddCell(new Phrase(formattedMonth,header));

                    document.Add(topTable);

                    int total = entry.WfhCount + entry.WfoCount;
                    document.Add(new Paragraph(" "));
                    document.Add(table); // Tambahkan tabel ke dokumen
                    document.Add(new Paragraph("Timesheet Total : "+total+" days", FontFactory.GetFont(FontFactory.HELVETICA, 10f)));

                    // Menambahkan kolom-kolom untuk tanda tangan
                    PdfPTable signatureTable = new PdfPTable(3); // Tiga kolom untuk tanda tangan
                    signatureTable.WidthPercentage = 60;
                    signatureTable.SpacingBefore = 40f; // Spasi sebelum tempat tanda tangan
                    signatureTable.HorizontalAlignment = Element.ALIGN_RIGHT;

                    // Kolom pertama untuk tanda tangan pegawai
                    PdfPCell employeeSignatureCell = new PdfPCell(new Phrase("TTD Pegawai", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10f)));
                    employeeSignatureCell.Border = PdfPCell.NO_BORDER;
                    signatureTable.AddCell(employeeSignatureCell);

                    // Kolom kedua untuk tanda tangan yang mengetahui
                    PdfPCell acknowledgedByCell = new PdfPCell(new Phrase("Diketahui Oleh", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10f)));
                    acknowledgedByCell.Border = PdfPCell.NO_BORDER;
                    acknowledgedByCell.PaddingLeft = 2f;
                    signatureTable.AddCell(acknowledgedByCell);

                    // Kolom ketiga untuk tanda tangan yang mengetahui
                    PdfPCell acknowledgedByCell2 = new PdfPCell(new Phrase("Diketahui Oleh", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10f)));
                    acknowledgedByCell2.Border = PdfPCell.NO_BORDER;
                    acknowledgedByCell2.PaddingLeft = 2f;
                    signatureTable.AddCell(acknowledgedByCell2);

                    // Menambahkan nama di bawah setiap kolom tanda tangan
                    PdfPCell employeeNameCell = new PdfPCell(new Phrase(entry.AccountName, FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10f)));
                    employeeNameCell.Border = PdfPCell.NO_BORDER;
                    employeeNameCell.PaddingTop = 35f;
                    signatureTable.AddCell(employeeNameCell);

                    PdfPCell acknowledgedByNameCell = new PdfPCell(new Phrase("Bela Oktavia", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10f)));
                    acknowledgedByNameCell.Border = PdfPCell.NO_BORDER;
                    acknowledgedByNameCell.PaddingTop = 35f;
                    acknowledgedByNameCell.PaddingLeft = 2f;
                    signatureTable.AddCell(acknowledgedByNameCell);

                    PdfPCell acknowledgedByNameCell2 = new PdfPCell(new Phrase(entry.Pic, FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10f)));
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
            public string Position { get; set; }
            public List<TimeSheet> TimeSheets { get; set; }
        }

        public class TimeSheet
        {
            public int TimeSheetId { get; set; }
            public string Activity { get; set; }
            public string Category { get; set; }
            public string Status { get; set; }
            public string Flag { get; set; }
            public string KnownBy { get; set; }
            public DateTime Date { get; set; }
        }


        public class ApiResponse<T>
        {
            public int Status { get; set; }
            public string Message { get; set; }
            public List<T> Data { get; set; }
        }

        public class Holiday
        {
            public int holiday_Id { get; set; }
            public string name { get; set; }
            public DateTime date { get; set; }
            public string description { get; set; }
        }

    }
}
