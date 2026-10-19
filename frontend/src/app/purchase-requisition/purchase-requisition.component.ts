import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-requisition',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './purchase-requisition.component.html',
  styleUrl: './purchase-requisition.component.css'
})
export class PurchaseRequisitionComponent implements OnInit{
  filteredRequisitions: any[] = [];
  requisitions: any[] = [
    {
      id: 1,
      prNumber: 'PR-0001',
      requestDate: '26-09-2026',
      requestedBy: 'Sarath',
      department: 'IT',
      requiredDate: '10-10-2026',
      amount: 250000,
      status: 'Pending Approval'
    },
    {
      id: 2,
      prNumber: 'PR-0002',
      requestDate: '25-09-2026',
      requestedBy: 'Arun',
      department: 'HR',
      requiredDate: '05-10-2026',
      amount: 50000,
      status: 'Approved'
    }
  ];
  ngOnInit(): void {
    this.filteredRequisitions = [...this.requisitions];
  }
  filter = {
  search: '',
  status: 'All',
  department: 'All',
  fromDate: '',
  toDate: ''
};
  showForm = false;
  isEditMode = false;

  isFilterApplied = false;

  prForm: any = {
    prNumber: '',
    requestDate: '',
    requestedBy: '',
    department: '',
    requiredDate: '',
    priority: 'Medium',
    costCenter: '',
    project: '',
    justification: '',
    items: []
  };

validationErrors: any = {
  department: '',
  requiredDate: '',
  priority: '',
  items: '',
  justification: ''
};
validatePurchaseRequisition(): boolean {

  this.clearValidationErrors();

  let isValid = true;


  // Department
  if (!this.prForm.department) {

    this.validationErrors.department =
      'Please select a department.';

    isValid = false;
  }


  // Required Date
  if (!this.prForm.requiredDate) {

    this.validationErrors.requiredDate =
      'Please select the required date.';

    isValid = false;

  } else {

    const requiredDate =
      new Date(this.prForm.requiredDate);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (requiredDate < today) {

      this.validationErrors.requiredDate =
        'Required date cannot be earlier than today.';

      isValid = false;
    }
  }


  // Priority
  if (!this.prForm.priority) {

    this.validationErrors.priority =
      'Please select a priority.';

    isValid = false;
  }


  // Items
  if (!this.prForm.items ||
      this.prForm.items.length === 0) {

    this.validationErrors.items =
      'Please add at least one item.';

    isValid = false;

  } else {

    this.itemErrors = [];

    this.prForm.items.forEach((item: any, index: number) => {

      const errors: any = {};

      if (!item.product) {
        errors.product =
          'Please select a product.';
      }

      if (!item.quantity || item.quantity <= 0) {
        errors.quantity =
          'Quantity must be greater than 0.';
      }

      if (
        item.estimatedPrice === null ||
        item.estimatedPrice === undefined ||
        item.estimatedPrice < 0
      ) {
        errors.estimatedPrice =
          'Please enter a valid estimated price.';
      }

      this.itemErrors[index] = errors;

      if (Object.keys(errors).length > 0) {
        isValid = false;
      }

    });
  }


  // Justification
  if (!this.prForm.justification?.trim()) {

    this.validationErrors.justification =
      'Please provide the business justification.';

    isValid = false;
  }


  return isValid;
}
clearValidationErrors(): void {

  this.validationErrors = {
    department: '',
    requiredDate: '',
    priority: '',
    items: '',
    justification: ''
  };

  this.itemErrors = [];
}
itemErrors: any[] = [];
  newRequisition() {

    this.isEditMode = false;

    this.prForm = {
      prNumber: this.generatePRNumber(),
      requestDate: this.getToday(),
      requestedBy: 'Sarath',
      department: '',
      requiredDate: '',
      priority: 'Medium',
      costCenter: '',
      project: '',
      justification: '',
      items: []
    };

    this.addItem();

    this.showForm = true;
  }
  applyFilter(): void {

  const search = this.filter.search.trim().toLowerCase();

  this.filteredRequisitions = this.requisitions.filter(pr => {

    const matchesSearch =
      !search ||
      pr.prNumber?.toLowerCase().includes(search) ||
      pr.requestedBy?.toLowerCase().includes(search);

    const matchesStatus =
      this.filter.status === 'All' ||
      pr.status === this.filter.status;

    const matchesDepartment =
      this.filter.department === 'All' ||
      pr.department === this.filter.department;

    const matchesFromDate =
      !this.filter.fromDate ||
      this.convertToDate(pr.requestDate) >=
      this.convertToDate(this.filter.fromDate);

    const matchesToDate =
      !this.filter.toDate ||
      this.convertToDate(pr.requestDate) <=
      this.convertToDate(this.filter.toDate);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDepartment &&
      matchesFromDate &&
      matchesToDate
    );
  });

  this.isFilterApplied =
    !!this.filter.search ||
    this.filter.status !== 'All' ||
    this.filter.department !== 'All' ||
    !!this.filter.fromDate ||
    !!this.filter.toDate;
}
private convertToDate(date: string): Date {

  if (!date) {
    return new Date(0);
  }

  // dd-MM-yyyy
  if (date.includes('-') && date.split('-')[0].length === 2) {

    const [day, month, year] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  return new Date(date);
}
clearFilter(): void {

  this.filter = {
    search: '',
    status: 'All',
    department: 'All',
    fromDate: '',
    toDate: ''
  };

  this.filteredRequisitions = [...this.requisitions];

  this.isFilterApplied = false;
}

  generatePRNumber(): string {

    const number = this.requisitions.length + 1;

    return 'PR-' + number.toString().padStart(4, '0');
  }


  getToday(): string {

    return new Date().toISOString().split('T')[0];
  }


  addItem() {

    this.prForm.items.push({
      product: '',
      description: '',
      quantity: 1,
      uom: 'Nos',
      estimatedPrice: 0
    });

  }


  removeItem(index: number) {

    if (this.prForm.items.length === 1) {
      return;
    }

    this.prForm.items.splice(index, 1);

    this.calculateTotal();
  }


  getItemAmount(item: any): number {

    return (item.quantity || 0) * (item.estimatedPrice || 0);
  }


  calculateTotal(): number {

    return this.prForm.items.reduce(
      (total: number, item: any) =>
        total + this.getItemAmount(item),
      0
    );
  }


  saveDraft() {

    console.log('Saving Draft', this.prForm);

    alert('Purchase Requisition saved as Draft');

    this.closeForm();
  }


  submitForApproval(): void {

  const isValid = this.validatePurchaseRequisition();

  if (!isValid) {

    // Scroll to validation area
    setTimeout(() => {

      const errorElement =
        document.querySelector('.validation-error');

      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

    }, 100);

    return;
  }


  // Calculate total
  const totalAmount = this.calculateTotal();


  // Prepare submission object
  const submission = {
    ...this.prForm,
    totalAmount: totalAmount,
    status: 'Pending Approval'
  };


  console.log('Purchase Requisition Submitted:', submission);


  alert(
    `Purchase Requisition ${this.prForm.prNumber} submitted successfully for approval.`
  );


  this.closeForm();
}


  viewRequisition(pr: any) {

    console.log('View PR', pr);

    // Later API call will load complete PR details
  }


  editRequisition(pr: any) {

    this.isEditMode = true;

    this.prForm = {
      ...pr,
      items: [
        {
          product: 'Laptop',
          description: 'Business Laptop',
          quantity: 5,
          uom: 'Nos',
          estimatedPrice: 50000
        }
      ]
    };

    this.showForm = true;
  }


  closeForm() {

    this.showForm = false;
  }
}
