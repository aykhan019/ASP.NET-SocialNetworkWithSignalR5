using SocialNetworkWithSignalR.Entities;

namespace SocialNetworkWithSignalR
{
    public class ChatViewModel
    {
        public Chat CurrentChat { get; set; }
        public ICollection<Chat> Chats { get; set; }
    }
}