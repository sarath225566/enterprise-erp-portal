using Microsoft.AspNetCore.Mvc;
using practiseApi.Data;
using practiseApi.Dtos;
using practiseApi.Models;
using Microsoft.EntityFrameworkCore;

namespace practiseApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class GrnController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GrnController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: All GRN Records with items
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.GoodsReceiptNotes
                .Include(g => g.Items)
                .OrderByDescending(g => g.Id)
                .AsNoTracking()
                .ToListAsync();

            return Ok(list);
        }

        // 2. GET: Pending Approved POs for Inward selection
        [HttpGet("pending-pos")]
        public async Task<IActionResult> GetPendingPOs()
        {
            var pos = await _context.PurchaseOrders
                .Include(p => p.Items)
                .Where(p => p.Status == "Approved" || p.Status == "Issued")
                .AsNoTracking()
                .Select(p => new
                {
                    p.Id,
                    p.PoNumber,
                    p.VendorName,
                    Items = p.Items.Select(i => new
                    {
                        i.ItemSku,
                        i.ItemName,
                        i.Quantity,
                        i.UnitPrice
                    })
                })
                .ToListAsync();

            return Ok(pos);
        }

        // 3. POST: Create GRN & Auto-Update Inventory
        [HttpPost]
        public async Task<IActionResult> CreateGrn([FromBody] GrnCreateDto dto)
        {
            if (!ModelState.IsValid || dto.Items.Count == 0)
            {
                return BadRequest(new { message = "Valid items are required for inward entry." });
            }

            int count = await _context.GoodsReceiptNotes.CountAsync() + 1;
            string generatedGrnNo = $"GRN-{DateTime.UtcNow.Year}-{count:D4}";

            var grn = new GoodsReceiptNote
            {
                GrnNumber = generatedGrnNo,
                PurchaseOrderId = dto.PurchaseOrderId,
                PoNumber = dto.PoNumber,
                VendorName = dto.VendorName,
                ChallanNumber = dto.ChallanNumber,
                WarehouseLocation = dto.WarehouseLocation,
                ReceivedDate = DateTime.UtcNow,
                Status = "Completed",
                Remarks = dto.Remarks
            };

            foreach (var item in dto.Items)
            {
                int accepted = item.ReceivedQty - item.DamagedQty;
                if (accepted < 0) accepted = 0;

                grn.Items.Add(new GoodsReceiptNoteItem
                {
                    ItemSku = item.ItemSku,
                    ItemName = item.ItemName,
                    OrderedQty = item.OrderedQty,
                    ReceivedQty = item.ReceivedQty,
                    DamagedQty = item.DamagedQty,
                    AcceptedQty = accepted,
                    BatchNumber = string.IsNullOrWhiteSpace(item.BatchNumber) ? $"BAT-{DateTime.UtcNow:yyyyMMdd}" : item.BatchNumber,
                    ExpiryDate = item.ExpiryDate,
                    StorageBinLocation = string.IsNullOrWhiteSpace(item.StorageBinLocation) ? "Bin-General" : item.StorageBinLocation,
                    UnitPrice = item.UnitPrice
                });
            }

            // Linked PO-yude status update cheyyunnu
            if (dto.PurchaseOrderId.HasValue)
            {
                var po = await _context.PurchaseOrders.FindAsync(dto.PurchaseOrderId.Value);
                if (po != null)
                {
                    po.Status = "Closed"; // or Partially Received
                }
            }

            _context.GoodsReceiptNotes.Add(grn);
            await _context.SaveChangesAsync();

            return Ok(new { message = "GRN created successfully", grnNumber = grn.GrnNumber });
        }
    }
}
