using System.Text;
using System.Text.Json;
using practiseApi.Dtos;
using practiseApi.Services.Interfaces;

namespace practiseApi.Services.Implementations
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public GeminiService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<string> GetAiResponseAsync(string userMessage)
        {
            var apiKey = _config["Gemini:ApiKey"]?.Trim();

            // API key missing aano ennu check cheyyunnu
            if (string.IsNullOrWhiteSpace(apiKey) || apiKey.Contains("NinteActualKey"))
            {
                throw new Exception("Gemini API Key missing or not configured properly in appsettings.json.");
            }

            var model = _config["Gemini:Model"] ?? "gemini-1.5-flash";
            var baseUrl = _config["Gemini:BaseUrl"] ?? "https://generativelanguage.googleapis.com/v1beta/models/";

            if (!baseUrl.EndsWith("/"))
            {
                baseUrl += "/";
            }

            // Endpoint URL with API Key
            string url = $"{baseUrl}{model}:generateContent?key={apiKey}";

            string systemInstruction = "You are an intelligent ERP Assistant. Help the user with navigation, ERP modules, reports, and portal queries politely and concisely.";
            string promptWithContext = $"{systemInstruction}\n\nUser: {userMessage}";

            var requestBody = new GeminiRequestModel
            {
                Contents = new List<GeminiContent>
                {
                    new GeminiContent
                    {
                        Parts = new List<GeminiPart>
                        {
                            new GeminiPart { Text = promptWithContext }
                        }
                    }
                }
            };

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            string jsonPayload = JsonSerializer.Serialize(requestBody, jsonOptions);

            using var jsonContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorText = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API error: {response.StatusCode} - {errorText}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            var geminiResult = JsonSerializer.Deserialize<GeminiResponseModel>(responseJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return geminiResult?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text
                   ?? "Kshamikkanam, enikku marupadi labhichilla.";
        }
    }
}