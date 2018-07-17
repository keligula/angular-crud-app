using System.Threading.Tasks;

namespace Cargo.Core
{
    public interface IUnitOfWork
    {
        Task CompleteAsync();
    }
}