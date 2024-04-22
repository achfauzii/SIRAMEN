using System.Data;
using FrontEnd_RasManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class ResourceReport : Controller
    {
        public DataTable DataTableSrc { get; set; }

        public void OnGet()
        {
            // Replace this with your logic to populate the DataTable
            DataTableSrc = GetDataTable();
        }

        public IActionResult Index()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin" && role != "Super_Admin" && role != "Sales" && role != "Manager")
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult ShorlistCandidate()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin" && role != "Super_Admin" && role != "Sales")
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        public IActionResult Statistic()
        {
            //Validate Role
            if (!JwtHelper.IsAuthenticated(HttpContext))
            {
                return RedirectToAction("Login", "Accounts");
            }

            var role = JwtHelper.GetRoleFromJwt(HttpContext);

            if (role != "Admin" && role != "Super_Admin" && role !="Trainer" && role !="Sales" && role !="Manager" )
            {
                return RedirectToAction("Login", "Accounts");
            }
            //End Validate
            return View();
        }

        [HttpPost]
        public IActionResult ExportToExcel([FromBody] Object request)
        {
            // Assume you have a DataTable named "myDataTable"
            DataTable myDataTable = GetDataTable();

            // var dataSrc = request.GetType().GetProperties();
            // Console.WriteLine(request.ToString());
            // myDataTable.Rows.Clear();

            // Add new rows from the clientDataTable
            // foreach (DataRow row in request.Rows)
            // {
            //     myDataTable.Rows.Add(row.ItemArray);
            // }
            // Console.WriteLine(dataSrc.Length);

            // for (int i = 0; i < request.Length; i++) {
            //     myDataTable.Rows.Add(request[i])
            // }

            myDataTable.Rows.Add(1, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");

            // Specify the sheet name for the Excel file
            string sheetName = "Shortlist Candidate";

            // Use the ExcelExportHelper to export DataTable to Excel
            var fileBytes = ExcelExportHelper.ExportDataTableToExcel(myDataTable, sheetName);

            // Return the Excel file as a FileResult
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Shortlist Candidate.xlsx");
        }

        // Replace this with your logic to get the DataTable
        private DataTable GetDataTable()
        {
            // Sample DataTable creation
            var dataTable = new DataTable("ShortlistCandidate");
            // Add columns and rows to the DataTable
            dataTable.Columns.Add("No", typeof(int));
            dataTable.Columns.Add("Fullname", typeof(string));
            dataTable.Columns.Add("Position", typeof(string));
            dataTable.Columns.Add("Skill Set", typeof(string));
            dataTable.Columns.Add("Level", typeof(string));
            dataTable.Columns.Add("Degree", typeof(string));
            dataTable.Columns.Add("GPA", typeof(string));
            dataTable.Columns.Add("University", typeof(string));
            dataTable.Columns.Add("Domicile", typeof(string));
            dataTable.Columns.Add("Age", typeof(string));
            dataTable.Columns.Add("Experience", typeof(string));
            dataTable.Columns.Add("Filtering by", typeof(string));
            dataTable.Columns.Add("Work Status", typeof(string));
            dataTable.Columns.Add("Notice Periode", typeof(string));
            dataTable.Columns.Add("Financial Industry", typeof(string));
            dataTable.Columns.Add("RAW CV", typeof(string));
            dataTable.Columns.Add("Berca CV", typeof(string));
            dataTable.Columns.Add("English", typeof(string));
            dataTable.Columns.Add("Current Salary", typeof(string));
            dataTable.Columns.Add("Expected Salary", typeof(string));
            dataTable.Columns.Add("Negotiable", typeof(string));
            dataTable.Columns.Add("Tech Test", typeof(string));
            dataTable.Columns.Add("Interview by RAS", typeof(string));
            dataTable.Columns.Add("Interview Date by RAS", typeof(string));
            dataTable.Columns.Add("Name of User", typeof(string));
            dataTable.Columns.Add("Interview User", typeof(string));
            dataTable.Columns.Add("Interview Date by User", typeof(string));
            dataTable.Columns.Add("Recommendation", typeof(string));
            dataTable.Columns.Add("Status", typeof(string));
            dataTable.Columns.Add("Notes", typeof(string));
            dataTable.Columns.Add("Last Modified", typeof(string));

            // dataTable.Rows.Add(1, "John Doe");
            // dataTable.Rows.Add(2, "Jane Doe");
            return dataTable;
        }
    }
}
