// AZ-104 Exam Topic → Microsoft Learn URL Map
// Source: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104
// Skills measured as of April 17, 2026
// Grouped by the 5 official exam domains with their official weightings.

module.exports = {

  // ── Manage Azure identities and governance (20–25%) ──────────────────────
  identity: [
    {
      topic: "Create and manage Entra ID users and groups",
      url: "https://learn.microsoft.com/en-us/entra/fundamentals/how-to-create-delete-users",
      domain: "identity"
    },
    {
      topic: "Manage user properties and bulk user operations",
      url: "https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-user-profile-info",
      domain: "identity"
    },
    {
      topic: "Manage licenses in Microsoft Entra ID",
      url: "https://learn.microsoft.com/en-us/entra/fundamentals/license-users-groups",
      domain: "identity"
    },
    {
      topic: "Manage external users and B2B guest access",
      url: "https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b",
      domain: "identity"
    },
    {
      topic: "Configure self-service password reset (SSPR)",
      url: "https://learn.microsoft.com/en-us/entra/identity/authentication/tutorial-enable-sspr",
      domain: "identity"
    },
    {
      topic: "Manage built-in Azure RBAC roles",
      url: "https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles",
      domain: "identity"
    },
    {
      topic: "Configure Azure RBAC role assignments at different scopes",
      url: "https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal",
      domain: "identity"
    },
    {
      topic: "Interpret access assignments and effective permissions",
      url: "https://learn.microsoft.com/en-us/azure/role-based-access-control/check-access",
      domain: "identity"
    },
    {
      topic: "Create and manage custom RBAC roles",
      url: "https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles",
      domain: "identity"
    },
    {
      topic: "Understand and work with deny assignments",
      url: "https://learn.microsoft.com/en-us/azure/role-based-access-control/deny-assignments",
      domain: "identity"
    },
    {
      topic: "Implement and manage Azure Policy",
      url: "https://learn.microsoft.com/en-us/azure/governance/policy/overview",
      domain: "identity"
    },
    {
      topic: "Configure Azure Policy effects: Audit, Deny, DeployIfNotExists, Modify",
      url: "https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effects",
      domain: "identity"
    },
    {
      topic: "Configure resource locks (ReadOnly and Delete)",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources",
      domain: "identity"
    },
    {
      topic: "Apply and manage tags on resources and resource groups",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources",
      domain: "identity"
    },
    {
      topic: "Manage and move resource groups",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal",
      domain: "identity"
    },
    {
      topic: "Manage Azure subscriptions and transfer ownership",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/manage-azure-subscription-policy",
      domain: "identity"
    },
    {
      topic: "Manage costs using alerts, budgets, and Azure Advisor",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets",
      domain: "identity"
    },
    {
      topic: "Configure and manage Azure management groups",
      url: "https://learn.microsoft.com/en-us/azure/governance/management-groups/overview",
      domain: "identity"
    },
  ],

  // ── Implement and manage storage (15–20%) ────────────────────────────────
  storage: [
    {
      topic: "Configure Azure Storage firewalls and virtual networks",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security",
      domain: "storage"
    },
    {
      topic: "Create and use shared access signature (SAS) tokens",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview",
      domain: "storage"
    },
    {
      topic: "Configure stored access policies for storage",
      url: "https://learn.microsoft.com/en-us/rest/api/storageservices/define-stored-access-policy",
      domain: "storage"
    },
    {
      topic: "Manage storage account access keys",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage",
      domain: "storage"
    },
    {
      topic: "Configure identity-based access for Azure Files",
      url: "https://learn.microsoft.com/en-us/azure/storage/files/storage-files-active-directory-overview",
      domain: "storage"
    },
    {
      topic: "Create and configure Azure storage accounts",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create",
      domain: "storage"
    },
    {
      topic: "Configure Azure Storage redundancy (LRS, ZRS, GRS, RA-GRS, GZRS, RA-GZRS)",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy",
      domain: "storage"
    },
    {
      topic: "Configure object replication for blob storage",
      url: "https://learn.microsoft.com/en-us/azure/storage/blobs/object-replication-overview",
      domain: "storage"
    },
    {
      topic: "Configure storage account encryption and customer-managed keys",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/customer-managed-keys-overview",
      domain: "storage"
    },
    {
      topic: "Manage data using Azure Storage Explorer and AzCopy",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10",
      domain: "storage"
    },
    {
      topic: "Create and configure Azure Files file shares",
      url: "https://learn.microsoft.com/en-us/azure/storage/files/storage-how-to-create-file-share",
      domain: "storage"
    },
    {
      topic: "Create and configure Azure Blob Storage containers",
      url: "https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction",
      domain: "storage"
    },
    {
      topic: "Configure blob storage access tiers (Hot, Cool, Cold, Archive)",
      url: "https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview",
      domain: "storage"
    },
    {
      topic: "Configure soft delete for blobs and containers",
      url: "https://learn.microsoft.com/en-us/azure/storage/blobs/soft-delete-blob-overview",
      domain: "storage"
    },
    {
      topic: "Configure snapshots and soft delete for Azure Files",
      url: "https://learn.microsoft.com/en-us/azure/storage/files/storage-snapshots-files",
      domain: "storage"
    },
    {
      topic: "Configure blob lifecycle management policies",
      url: "https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview",
      domain: "storage"
    },
    {
      topic: "Configure blob versioning",
      url: "https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview",
      domain: "storage"
    },
    {
      topic: "Configure private endpoints for Azure Storage",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints",
      domain: "storage"
    },
  ],

  // ── Deploy and manage Azure compute resources (20–25%) ───────────────────
  compute: [
    {
      topic: "Interpret and modify Azure Resource Manager (ARM) templates",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/overview",
      domain: "compute"
    },
    {
      topic: "Deploy resources using ARM templates and Bicep files",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-portal",
      domain: "compute"
    },
    {
      topic: "Interpret and modify Bicep files",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview",
      domain: "compute"
    },
    {
      topic: "Export and convert ARM templates to Bicep",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/decompile",
      domain: "compute"
    },
    {
      topic: "Create and configure Azure virtual machines",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/overview",
      domain: "compute"
    },
    {
      topic: "Configure disk encryption at host for Azure virtual machines",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption",
      domain: "compute"
    },
    {
      topic: "Move virtual machines between resource groups, subscriptions, and regions",
      url: "https://learn.microsoft.com/en-us/azure/resource-mover/tutorial-move-region-virtual-machines",
      domain: "compute"
    },
    {
      topic: "Manage virtual machine sizes and resize VMs",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/resize-vm",
      domain: "compute"
    },
    {
      topic: "Manage virtual machine disks (OS, data, temp disks)",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",
      domain: "compute"
    },
    {
      topic: "Deploy VMs to availability zones and availability sets",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/availability",
      domain: "compute"
    },
    {
      topic: "Deploy and configure Azure Virtual Machine Scale Sets",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview",
      domain: "compute"
    },
    {
      topic: "Create and manage Azure Container Registry (ACR)",
      url: "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro",
      domain: "compute"
    },
    {
      topic: "Provision containers using Azure Container Instances (ACI)",
      url: "https://learn.microsoft.com/en-us/azure/container-instances/container-instances-overview",
      domain: "compute"
    },
    {
      topic: "Provision and manage containers using Azure Container Apps",
      url: "https://learn.microsoft.com/en-us/azure/container-apps/overview",
      domain: "compute"
    },
    {
      topic: "Manage sizing and scaling for Container Instances and Container Apps",
      url: "https://learn.microsoft.com/en-us/azure/container-apps/scale-app",
      domain: "compute"
    },
    {
      topic: "Provision and configure Azure App Service plans",
      url: "https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans",
      domain: "compute"
    },
    {
      topic: "Create and configure Azure App Service web apps",
      url: "https://learn.microsoft.com/en-us/azure/app-service/overview",
      domain: "compute"
    },
    {
      topic: "Configure App Service certificates, TLS, custom domains, and deployment slots",
      url: "https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate",
      domain: "compute"
    },
  ],

  // ── Implement and manage virtual networking (15–20%) ─────────────────────
  networking: [
    {
      topic: "Create and configure virtual networks and subnets",
      url: "https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview",
      domain: "networking"
    },
    {
      topic: "Create and configure virtual network peering",
      url: "https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview",
      domain: "networking"
    },
    {
      topic: "Configure public IP addresses (Basic vs Standard SKU)",
      url: "https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/public-ip-addresses",
      domain: "networking"
    },
    {
      topic: "Configure user-defined routes (UDRs) and route tables",
      url: "https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview",
      domain: "networking"
    },
    {
      topic: "Troubleshoot network connectivity in Azure",
      url: "https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-connectivity-overview",
      domain: "networking"
    },
    {
      topic: "Create and configure network security groups (NSGs)",
      url: "https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview",
      domain: "networking"
    },
    {
      topic: "Create and configure application security groups (ASGs)",
      url: "https://learn.microsoft.com/en-us/azure/virtual-network/application-security-groups",
      domain: "networking"
    },
    {
      topic: "Evaluate effective security rules in NSGs",
      url: "https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-security-group-view-overview",
      domain: "networking"
    },
    {
      topic: "Implement Azure Bastion for secure VM access",
      url: "https://learn.microsoft.com/en-us/azure/bastion/bastion-overview",
      domain: "networking"
    },
    {
      topic: "Configure service endpoints for Azure PaaS services",
      url: "https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview",
      domain: "networking"
    },
    {
      topic: "Configure private endpoints for Azure PaaS services",
      url: "https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview",
      domain: "networking"
    },
    {
      topic: "Configure Azure DNS public and private zones",
      url: "https://learn.microsoft.com/en-us/azure/dns/dns-overview",
      domain: "networking"
    },
    {
      topic: "Configure Azure Load Balancer (internal and public)",
      url: "https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview",
      domain: "networking"
    },
    {
      topic: "Troubleshoot Azure Load Balancer connectivity and health probes",
      url: "https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-troubleshoot",
      domain: "networking"
    },
    {
      topic: "Configure Azure Application Gateway and WAF",
      url: "https://learn.microsoft.com/en-us/azure/application-gateway/overview",
      domain: "networking"
    },
    {
      topic: "Configure VPN Gateway and ExpressRoute connectivity",
      url: "https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways",
      domain: "networking"
    },
    {
      topic: "Configure private DNS zones and VNet links for name resolution",
      url: "https://learn.microsoft.com/en-us/azure/dns/private-dns-overview",
      domain: "networking"
    },
  ],

  // ── Monitor and maintain Azure resources (10–15%) ────────────────────────
  monitoring: [
    {
      topic: "Interpret metrics in Azure Monitor",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/data-platform-metrics",
      domain: "monitoring"
    },
    {
      topic: "Configure log settings and diagnostic settings in Azure Monitor",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings",
      domain: "monitoring"
    },
    {
      topic: "Query and analyze logs in Azure Monitor using KQL",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-tutorial",
      domain: "monitoring"
    },
    {
      topic: "Set up alert rules, action groups, and alert processing rules",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-new-alert-rule",
      domain: "monitoring"
    },
    {
      topic: "Configure and interpret VM Insights, Storage Insights, and Network Insights",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/vm/vminsights-overview",
      domain: "monitoring"
    },
    {
      topic: "Use Azure Network Watcher and Connection Monitor",
      url: "https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-overview",
      domain: "monitoring"
    },
    {
      topic: "Create and configure a Recovery Services vault",
      url: "https://learn.microsoft.com/en-us/azure/backup/backup-create-recovery-services-vault",
      domain: "monitoring"
    },
    {
      topic: "Create and configure an Azure Backup vault",
      url: "https://learn.microsoft.com/en-us/azure/backup/backup-vault-overview",
      domain: "monitoring"
    },
    {
      topic: "Create and configure Azure Backup policies",
      url: "https://learn.microsoft.com/en-us/azure/backup/backup-azure-arm-vms-prepare",
      domain: "monitoring"
    },
    {
      topic: "Perform backup and restore operations using Azure Backup",
      url: "https://learn.microsoft.com/en-us/azure/backup/backup-azure-vms-first-look-arm",
      domain: "monitoring"
    },
    {
      topic: "Configure Azure Site Recovery for Azure resources",
      url: "https://learn.microsoft.com/en-us/azure/site-recovery/azure-to-azure-tutorial-enable-replication",
      domain: "monitoring"
    },
    {
      topic: "Perform failover to a secondary region using Azure Site Recovery",
      url: "https://learn.microsoft.com/en-us/azure/site-recovery/azure-to-azure-tutorial-failover-failback",
      domain: "monitoring"
    },
    {
      topic: "Configure and interpret backup reports and alerts",
      url: "https://learn.microsoft.com/en-us/azure/backup/configure-reports",
      domain: "monitoring"
    },
    {
      topic: "Configure Azure Monitor Data Collection Rules and Azure Monitor Agent",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/agents/data-collection-rule-overview",
      domain: "monitoring"
    },
    {
      topic: "Configure Log Analytics workspace retention and tables",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-archive",
      domain: "monitoring"
    },
  ],
};
