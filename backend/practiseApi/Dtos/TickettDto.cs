namespace practiseApi.Dtos
{
    public class TickettDto
    {
        public string Title { get; set; } = string.Empty;
        public string Descripton { get; set; } = string.Empty;
        public string Priority { get; set; } = "Low";
        public string Status { get; set; } = "Pending";
    }
}
