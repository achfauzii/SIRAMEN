using System.ComponentModel.DataAnnotations;

namespace RasManagement.ViewModel
{
    public class ChangePassVM
    {

        [Required(ErrorMessage = "Email is required.")]
        /*[EmailAddress(ErrorMessage = "Invalid email address.")]*/
        public string Email { get; set; }

        public string CurrentPassword { get; set; }
        [Required(ErrorMessage = "New password is required.")]
        //[DataType(DataType.Password)]
        //[StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        public string NewPassword { get; set; }
    }
}
