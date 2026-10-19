namespace practiseApi.Services.Interfaces
{
    public interface IGeminiService
    {
        Task<string> GetAiResponseAsync(string userMessage);
    }
}
