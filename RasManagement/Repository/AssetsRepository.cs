
using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;
using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class AssetsRepository : GeneralRepository<ProjectRasmanagementContext, AssetsManagement, int>
    {
        private readonly ProjectRasmanagementContext context;

        public AssetsRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<AssetsManagement>> GetAssetsByAccountId(string accountId)
        {
            var assetsAccount = await context.AssetsManagements
             .Where(e => e.AccountId == accountId)
             .ToListAsync();

            return assetsAccount;
        }

        public async Task<AssetsManagement> GetByAssetId(int assetId)
        {
            return await context.AssetsManagements.FindAsync(assetId);
        }

        public async Task<int> InsertAssets(AssetsManagement asset)
        {
            context.AssetsManagements.Add(asset);
            var save = await context.SaveChangesAsync();

            return save;

        }

        public async Task<int> UpdateAsset(AssetsManagement updatedAsset)
        {
            context.Entry(updatedAsset).State = EntityState.Modified;
            var save = await context.SaveChangesAsync();

            return save;
        }

        public async Task<bool> DeleteAsset(int assetId)
        {
            var delete = await context.AssetsManagements.FindAsync(assetId);
            if (delete != null)
            {
                context.AssetsManagements.Remove(delete);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }


    }
}