using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialNetworkWithSignalR.Entities;
using SocialNetworkWithSignalR.Models;
using System.Diagnostics;

namespace SocialNetworkWithSignalR.Controllers
{
    [Authorize(Roles ="Admin")]
    public class HomeController : Controller
    {
        private UserManager<CustomIdentityUser> _userManager;
        private  IHttpContextAccessor httpContextAccessor;
        private CustomIdentityDbContext _dbContext;

        public HomeController(UserManager<CustomIdentityUser> userManager,
            IHttpContextAccessor httpContextAccessor,
            CustomIdentityDbContext dbContext)
        {
            _userManager = userManager;
            this.httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
        }

        public async Task<IActionResult> Index()
        {
            var user=await _userManager.GetUserAsync(HttpContext.User);
            ViewBag.User = user;
            return View();
        }

        public async Task<IActionResult> SendFollow(string id)
        {
            var sender=await _userManager.GetUserAsync(HttpContext.User);

            var receiverUser = _userManager.Users.FirstOrDefault(u => u.Id == id);
            if (receiverUser != null)
            {
                receiverUser.FriendRequests.Add(new FriendRequest
                {
                    Content=$"{sender.UserName} send friend request at {DateTime.Now.ToLongDateString()}",
                    SenderId=sender.Id,
                    CustomIdentityUser=sender,
                    ReceiverId=id,
                    Status="Request"
                });

                await _userManager.UpdateAsync(receiverUser);


            }
            return Ok();
        }
        public async Task<IActionResult> GetAllUsers()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var users = _dbContext.Users.Where(u=>u.Id!=user.Id).OrderByDescending(x => x.IsOnline);
            return Ok(users);
        }

        public async Task<IActionResult> GetAllRequests()
        {
            var current=await _userManager.GetUserAsync(HttpContext.User);
            var users = _dbContext.Users.Include(nameof(CustomIdentityUser.FriendRequests));
            var user = users.FirstOrDefault(u => u.Id == current.Id);
            var items = user.FriendRequests.Where(r => r.ReceiverId == user.Id);
            return Ok(items);   
        }


      
    }
}