import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'attachment',
        data: { pageTitle: 'printingApp.attachment.home.title' },
        loadChildren: () => import('./attachment/attachment.module').then(m => m.AttachmentModule),
      },
      {
        path: 'autho-tracker',
        data: { pageTitle: 'printingApp.authoTracker.home.title' },
        loadChildren: () => import('./autho-tracker/autho-tracker.module').then(m => m.AuthoTrackerModule),
      },
      {
        path: 'client',
        data: { pageTitle: 'printingApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'client-reception-order',
        data: { pageTitle: 'printingApp.clientReceptionOrder.home.title' },
        loadChildren: () => import('./client-reception-order/client-reception-order.module').then(m => m.ClientReceptionOrderModule),
      },
      {
        path: 'company',
        data: { pageTitle: 'printingApp.company.home.title' },
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'supplier',
        data: { pageTitle: 'printingApp.supplier.home.title' },
        loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule),
      },
      {
        path: 'contract',
        data: { pageTitle: 'printingApp.contract.home.title' },
        loadChildren: () => import('./contract/contract.module').then(m => m.ContractModule),
      },
      {
        path: 'debtor',
        data: { pageTitle: 'printingApp.debtor.home.title' },
        loadChildren: () => import('./debtor/debtor.module').then(m => m.DebtorModule),
      },
      {
        path: 'delivery',
        data: { pageTitle: 'printingApp.delivery.home.title' },
        loadChildren: () => import('./delivery/delivery.module').then(m => m.DeliveryModule),
      },
      {
        path: 'division',
        data: { pageTitle: 'printingApp.division.home.title' },
        loadChildren: () => import('./division/division.module').then(m => m.DivisionModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'printingApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'financial-client-engagement',
        data: { pageTitle: 'printingApp.financialClientEngagement.home.title' },
        loadChildren: () =>
          import('./financial-client-engagement/financial-client-engagement.module').then(m => m.FinancialClientEngagementModule),
      },
      {
        path: 'invoice',
        data: { pageTitle: 'printingApp.invoice.home.title' },
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
      },
      {
        path: 'invoice-history',
        data: { pageTitle: 'printingApp.invoiceHistory.home.title' },
        loadChildren: () => import('./invoice-history/invoice-history.module').then(m => m.InvoiceHistoryModule),
      },
      {
        path: 'invoice-item',
        data: { pageTitle: 'printingApp.invoiceItem.home.title' },
        loadChildren: () => import('./invoice-item/invoice-item.module').then(m => m.InvoiceItemModule),
      },
      {
        path: 'receipt',
        data: { pageTitle: 'printingApp.receipt.home.title' },
        loadChildren: () => import('./receipt/receipt.module').then(m => m.ReceiptModule),
      },
      {
        path: 'job-card',
        data: { pageTitle: 'printingApp.jobCard.home.title' },
        loadChildren: () => import('./job-card/job-card.module').then(m => m.JobCardModule),
      },
      {
        path: 'job-card-assignment',
        data: { pageTitle: 'printingApp.jobCardAssignment.home.title' },
        loadChildren: () => import('./job-card-assignment/job-card-assignment.module').then(m => m.JobCardAssignmentModule),
      },
      {
        path: 'job-card-item',
        data: { pageTitle: 'printingApp.jobCardItem.home.title' },
        loadChildren: () => import('./job-card-item/job-card-item.module').then(m => m.JobCardItemModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'printingApp.location.home.title' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'location-level',
        data: { pageTitle: 'printingApp.locationLevel.home.title' },
        loadChildren: () => import('./location-level/location-level.module').then(m => m.LocationLevelModule),
      },
      {
        path: 'notification',
        data: { pageTitle: 'printingApp.notification.home.title' },
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
      },
      {
        path: 'p-organization',
        data: { pageTitle: 'printingApp.pOrganization.home.title' },
        loadChildren: () => import('./p-organization/p-organization.module').then(m => m.POrganizationModule),
      },
      {
        path: 'pay-roll',
        data: { pageTitle: 'printingApp.payRoll.home.title' },
        loadChildren: () => import('./pay-roll/pay-roll.module').then(m => m.PayRollModule),
      },
      {
        path: 'pay-roll-item',
        data: { pageTitle: 'printingApp.payRollItem.home.title' },
        loadChildren: () => import('./pay-roll-item/pay-roll-item.module').then(m => m.PayRollItemModule),
      },
      {
        path: 'person',
        data: { pageTitle: 'printingApp.person.home.title' },
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
      },
      {
        path: 'user-division-enrolment',
        data: { pageTitle: 'printingApp.userDivisionEnrolment.home.title' },
        loadChildren: () => import('./user-division-enrolment/user-division-enrolment.module').then(m => m.UserDivisionEnrolmentModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'printingApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'product-category',
        data: { pageTitle: 'printingApp.productCategory.home.title' },
        loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
