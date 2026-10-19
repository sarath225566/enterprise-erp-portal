using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practiseApi.Data;
using practiseApi.Dtos;
using practiseApi.Models;

namespace practiseApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TicketsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tickets = await _context.Tickets.OrderByDescending(t => t.CreatedAt).ToListAsync();
            return Ok(tickets);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TickettDto dto)
        {
            var ticket = new Ticket
            {
                Title = dto.Title,
                Descripton = dto.Descripton,
                Priority = dto.Priority,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            return Ok(ticket);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult>Update(int id, [FromBody] TickettDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return NotFound(new { message = "Ticket Not Found!" });
            ticket.Title = dto.Title;
            ticket.Descripton = dto.Descripton;
            ticket.Priority=dto.Priority;
            ticket.Status=dto.Status;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Ticket Updated Successfully" });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) 
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return NotFound(new { message="Ticket not Found!" });
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Ticket Deleted Successfully" });
        }

    }
}
