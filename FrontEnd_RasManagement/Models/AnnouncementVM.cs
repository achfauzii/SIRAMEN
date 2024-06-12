namespace FrontEnd_RasManagement.Models
{
    public class KelahiranVM
    {
        public string title { get; set; }
        public string employee { get; set; }
        public string name { get; set; }
        public string gender { get; set; }

        public string child { get; set; }
        public string birthdate { get; set; }
        public string birthtime { get; set; }
        public string birthplace { get; set; }
        public string weight { get; set; }
        public string length { get; set; }

        public List<String> email { get; set; }
    }

    public class DukaCitaVM
    {
        public string title { get; set; }
        public string employee { get; set; }
        public string name { get; set; }
        public string age { get; set; }
        public string relation { get; set; }

        public string deathday { get; set; }
        public string deathtime { get; set; }
        public string deathplace { get; set; }

        public List<String> email { get; set; }
    }

    public class BirthdayVM
    {
        public List<string> email { get; set; }
        public List<string> name { get; set; }
    }

    public class EmployeeData
    {
        public List<string> Email { get; set; }
        public List<string> Fullname { get; set; }
    }

}
