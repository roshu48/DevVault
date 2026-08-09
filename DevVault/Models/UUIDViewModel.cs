namespace DevVault.Models
{
    public class UUIDViewModel
    {
        public string UUIDVersion {get; set;}
        public int UUIDQty
        {
            get; set;
        }

        public List<String> UUIDLst
        {
            get; set;
        } = new List<string>();
    }
}
