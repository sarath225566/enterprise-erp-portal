namespace practiseApi.Dtos
{
    public class ChatRequestDto
    {
        public string Message { get; set; } = string.Empty;
    }
    public class ChatResponseDto
    {
        public string Reply { get; set; } = string.Empty;
        public bool Success { get; set; } = true;
    }
    public class GeminiRequestModel
    {
        public List<GeminiContent> Contents { get; set; } = new();
    }
}
