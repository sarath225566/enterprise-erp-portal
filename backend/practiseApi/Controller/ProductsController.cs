using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practiseApi.Data;
using practiseApi.Dtos;
using practiseApi.Models;

namespace practiseApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.products.ToListAsync();
            return Ok(products);
        }
        [HttpPost]
        public  async Task<IActionResult> Create([FromBody] ProductDto dto)
        {
            var products =new Product
            {
                Name=dto.Name,
                Category=dto.Category,
                Price=dto.Price,
                StockQuantity=dto.StockQuantity,
                IsActive=dto.IsActive
            };
            _context.products.Add(products);
            await _context.SaveChangesAsync();
            return Ok(products);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult>Update(int id, [FromBody] ProductDto dto)
        {
            var products = await _context.products.FindAsync(id);
            if (products == null) return NotFound(new { Message = "Product Not Found!" });
            products.Name = dto.Name;
            products.Category = dto.Category;
            products.Price = dto.Price;
            products.StockQuantity = dto.StockQuantity;
            products.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Product Updated Successfully" });
        }

        [HttpDelete("{id}/stock")]
        public async Task<IActionResult>Delete(int id)
        {
            var products = await _context.products.FindAsync(id);
            if(products==null) NotFound(new { Message = "Product Not Found!" });
            _context.products.Remove(products);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Proudct Deleted Successfully" });
        }
        //stock contollers
        [HttpPost("stock")]
        public async Task<IActionResult> CreateStock([FromBody] ProductDto dto)
        {
            // Required Validation Fail ആയാൽ 400 Bad Request അയക്കും
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // SKU മാപ്പും ഓട്ടോമാറ്റിക് Genaration-ഉം
            string productSku = string.IsNullOrWhiteSpace(dto.SKU)
                ? $"SKU-{Guid.NewGuid().ToString()[..6].ToUpper()}"
                : dto.SKU;

            var product = new Product
            {
                SKU = productSku,
                Name = dto.Name,
                Category = dto.Category,
                Description = dto.Description,
                PurchasePrice = dto.PurchasePrice,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                ReorderLevel = dto.ReorderLevel > 0 ? dto.ReorderLevel : 10,
                UnitOfMeasure = string.IsNullOrWhiteSpace(dto.UnitOfMeasure) ? "Pcs" : dto.UnitOfMeasure,
                IsActive = dto.IsActive
            };

            _context.products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }
        [HttpPut("{id}/stock")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] ProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _context.products.FindAsync(id);
            if (product == null) return NotFound(new { Message = "Product Not Found!" });

            product.SKU = string.IsNullOrWhiteSpace(dto.SKU) ? product.SKU : dto.SKU;
            product.Name = dto.Name;
            product.Category = dto.Category;
            product.Description = dto.Description;
            product.PurchasePrice = dto.PurchasePrice;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.ReorderLevel = dto.ReorderLevel;
            product.UnitOfMeasure = string.IsNullOrWhiteSpace(dto.UnitOfMeasure) ? product.UnitOfMeasure : dto.UnitOfMeasure;
            product.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product Updated Successfully", product });
        }
    }

}
