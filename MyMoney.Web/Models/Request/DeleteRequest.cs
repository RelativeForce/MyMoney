namespace MyMoney.Web.Models.Request
{
    public class DeleteRequest
    {
        public long Id { get; set; }

        public DeleteRequest(long id)
        {
            Id = id;
        }
    }
}
