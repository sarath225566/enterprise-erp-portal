using Microsoft.AspNetCore.Mvc;
using practiseApi.Dtos;
using practiseApi.Services.Interfaces;

namespace practiseApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiAssistantController : ControllerBase
    {
        private readonly IGeminiService _geminiService;

        public AiAssistantController(IGeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new ChatResponseDto
                {
                    Success = false,
                    Reply = "Message empty aavan paadila."
                });
            }

            try
            {
                var responseText = await _geminiService.GetAiResponseAsync(request.Message);
                return Ok(new ChatResponseDto
                {
                    Success = true,
                    Reply = responseText
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ChatResponseDto
                {
                    Success = false,
                    Reply = $"Error: {ex.Message}"
                });
            }
        }
    }
}
