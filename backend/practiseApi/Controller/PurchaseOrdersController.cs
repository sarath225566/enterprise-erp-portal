using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practiseApi.Data;
using practiseApi.Dtos;
using practiseApi.Models;

namespace practiseApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PurchaseOrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PurchaseOrders
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.PurchaseOrders
                .Include(p => p.Items)
                .OrderByDescending(p => p.Id)
                .ToListAsync();

            return Ok(orders);
        }

        // POST: api/PurchaseOrders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] PurchaseOrderCreateDto dto)
        {
            if (!ModelState.IsValid || dto.Items.Count == 0)
            {
                return BadRequest(new { message = "Valid items are required to create a Purchase Order." });
            }

            int count = await _context.PurchaseOrders.CountAsync() + 1;
            string generatedPoNo = $"PO-{DateTime.UtcNow.Year}-{count:D4}";

            decimal subTotal = 0;
            decimal totalTax = 0;

            var po = new PurchaseOrder
            {
                PoNumber = generatedPoNo,
                VendorName = dto.VendorName,
                OrderDate = DateTime.UtcNow,
                ExpectedDeliveryDate = dto.ExpectedDeliveryDate,
                Status = "Pending Approval",
                Notes = dto.Notes
            };

            foreach (var item in dto.Items)
            {
                decimal itemSubtotal = item.Quantity * item.UnitPrice;
                decimal itemTax = itemSubtotal * (item.TaxPercent / 100m);
                decimal lineTotal = itemSubtotal + itemTax;

                subTotal += itemSubtotal;
                totalTax += itemTax;

                po.Items.Add(new PurchaseOrderItem
                {
                    ItemSku = item.ItemSku,
                    ItemName = item.ItemName,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TaxPercent = item.TaxPercent,
                    LineTotal = lineTotal
                });
            }

            po.SubTotal = subTotal;
            po.TaxAmount = totalTax;
            po.GrandTotal = subTotal + totalTax;

            _context.PurchaseOrders.Add(po);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Purchase Order created successfully", poNumber = po.PoNumber });
        }

        // PUT: api/PurchaseOrders/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _context.PurchaseOrders.FindAsync(id);
            if (order == null) return NotFound(new { message = "PO not found" });

            order.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Status updated to {status}" });
        }
    }
}
