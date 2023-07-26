
﻿using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;
using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class CertificateRepository : GeneralRepository<ProjectRasmanagementContext, Certificate, int>
    {
        private readonly ProjectRasmanagementContext context;

        public CertificateRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<Certificate>> GetCertificateByAccountId(string accountId)
        {
            var certificateAccount = await context.Certificates
                .Where(e => e.AccountId == accountId)
                .ToListAsync();

            return certificateAccount;
        }
    }
}
