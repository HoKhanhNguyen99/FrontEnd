import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {OrderService} from '../../services/order.service';
import {Customer} from '../../models/customer';
import {Order} from '../../models/order';
import {Province} from '../../models/province';
import {District} from '../../models/district';
import {Commune} from '../../models/commune';
import {AddressService} from '../../services/address.service';

export class Option {
  text: string;
  value: string;
}

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  shippingForm: FormGroup;
  listProvince: Province[] = [];
  provinceOptions: Option [] = [];
  customer: Customer;
  order: Order = new Order();
  submitted = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private orderService: OrderService,
              private addressService: AddressService) {
  }

  ngOnInit(): void {
    this.orderService.currentCustomer.subscribe(message => {
      this.customer = message;
    }, error => {
      console.log(error);
      this.customer = null;
    });
    this.addressService.findAllProvince().subscribe(next => {
      this.listProvince = next;
      this.listProvince.forEach(province => {
        this.provinceOptions.push({value: province.matp, text: province.name});
      });
      this.renderForm();

    }, error => {
      console.log(error);
    });
    this.shippingForm = this.fb.group({
      name: ['', [Validators.required]],
      district: ['', [Validators.required]],
      city: ['', [Validators.required]],
      commune: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]

    });
  }

  renderForm(): void {
    const service = this.addressService;
    const selectCommune = $('#commune');
    const selectDistrict = $('#district');
    const selectProvince = $('#city');
    let a: District[] = [];
    let c: Commune[] = [];
    let b: Option[] = [];
    let d: Option[] = [];

    function getDistrictList(id: string): void {
      service.findAllDistrictByProvinceId(id).toPromise().then(res => {
        a = res;
        b = [];
        a.forEach(district => {
          b.push({text: district.name, value: district.maqh});
        });
        selectDistrict[0].selectize.clear();
        selectDistrict[0].selectize.clearOptions();
        selectDistrict[0].selectize.addOption(b);
        selectCommune[0].selectize.clear();
        selectCommune[0].selectize.clearOptions();
      });
    }

    function getCommuneList(id: string): void {
      service.findAllCommuneByDistrictId(id).toPromise().then(next => {
        c = next;
        d = [];
        c.forEach(commune => {
          d.push({text: commune.name, value: commune.xaid});
        });
        selectCommune[0].selectize.clear();
        selectCommune[0].selectize.clearOptions();
        selectCommune[0].selectize.addOption(d);
      });
    }

    $(document).ready(function() {
      $('#other-address').click(function() {
        $('#other-address-form').addClass('show');
        $('#name').focus();
      });
      $('#cancel').click(function() {
        $('#other-address-form').removeClass('show');
      });
    });
    selectProvince.selectize({
      sortField: 'text',
      options: this.provinceOptions,
      onChange(value: string): void {
        getDistrictList(value);
      }
    });
    selectDistrict.selectize({
      sortField: 'text',
      onChange(value: string): void {
        if (value !== '') {
          getCommuneList(value);
        } else {
          selectCommune[0].selectize.clear();
          selectCommune[0].selectize.clearOptions();
        }
      }
    });
    selectCommune.selectize({
      sortField: 'text'
    });
  }

  onSubmit(): void {
    this.order.orderAddress = this.customer.address;
    this.order.receiver = (this.customer.userName);
    this.order.deliveryPhoneNumber = (this.customer.phone);
    this.orderService.chanceOrder(this.order);
    this.router.navigate(['checkout/payment']);
  }

  async onSubmitOther(): Promise<void> {
    this.submitted = true;
    const selectCommune = $('#commune');
    const selectDistrict = $('#district');
    const selectProvince = $('#city');
    this.shippingForm.get('city').patchValue(selectProvince[0].selectize.getValue());
    this.shippingForm.get('district').patchValue(selectDistrict[0].selectize.getValue());
    this.shippingForm.get('commune').patchValue(selectCommune[0].selectize.getValue());

    if (this.shippingForm.valid) {
      const promise1 = this.addressService.findProvinceById(this.shippingForm.get('city').value).toPromise();
      const promise2 = this.addressService.findDistrictById(this.shippingForm.get('district').value).toPromise();
      const promise3 = this.addressService.findCommuneById(this.shippingForm.get('commune').value).toPromise();
      const promise = await Promise.all([promise1, promise2, promise3]);
      this.order.orderAddress = this.shippingForm.get('address').value + ', '
        + promise[2].name + ', ' + promise[1].name + ', ' + promise[0].name;
      this.order.receiver = (this.shippingForm.get('name').value);
      this.order.deliveryPhoneNumber = (this.shippingForm.get('phone').value);
      this.orderService.chanceOrder(this.order);
      this.router.navigate(['checkout/payment']);

    }
  }
}
