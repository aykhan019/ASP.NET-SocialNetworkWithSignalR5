using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using SocialNetworkWithSignalR.Entities;
using SocialNetworkWithSignalR.Helpers;

namespace SocialNetworkWithSignalR.Hubs
{
    public class ChatHub:Hub
    {

        private readonly IWebHostEnvironment _hostEnvironment;
        private UserManager<CustomIdentityUser> _userManager;
        private IHttpContextAccessor _contextAccessor;
        private CustomIdentityDbContext _context;

        public ChatHub(UserManager<CustomIdentityUser> userManager, IHttpContextAccessor contextAccessor, CustomIdentityDbContext context, IWebHostEnvironment hostEnvironment)
        {
            _userManager = userManager;
            _contextAccessor = contextAccessor;
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        public async override Task OnConnectedAsync()
        {
            var user = await _userManager.GetUserAsync(_contextAccessor.HttpContext.User);

            var userItem=_context.Users.SingleOrDefault(x => x.Id == user.Id);
            userItem.IsOnline = true;
            await _context.SaveChangesAsync();
            UserHelper.ActiveUsers.Add(user);

            string info = user.UserName + " connected successfully";
            await Clients.Others.SendAsync("Connect", info);
        }

        public async override Task OnDisconnectedAsync(Exception? exception)
        {
            var user = await _userManager.GetUserAsync(_contextAccessor.HttpContext.User);
            if (user != null)
            {
                var userItem = _context.Users.SingleOrDefault(x => x.Id == user.Id);
                userItem.IsOnline = false;
                await _context.SaveChangesAsync();
                UserHelper.ActiveUsers.RemoveAll(u=>u.Id==user.Id);
            }
            string info = user.UserName + " disconnected";
            await Clients.Others.SendAsync("Disconnect", info);
        }

        public async Task SendFollow(string id)
        {
            await Clients.Users(new String[] { id}).SendAsync("ReceiveNotification");
        }

        public async Task GetMessages(string receiverId,string senderId)
        {
            await Clients.Users(new String[] { receiverId, senderId }).SendAsync("ReceiveMessages", receiverId,senderId);
            // Create a SoundPlayer instance with the audio file path
            //string wwwrootPath = _hostEnvironment.WebRootPath;
            //string filePath = Path.Combine(wwwrootPath, "simple-notification-152054.mp3");
            Console.Beep(800, 200);
        }
        public async Task DeclineNotification(string id)
        {
            await Clients.Users(new String[] { id }).SendAsync("ReceiveNotification2");
        }
        

    }
}
