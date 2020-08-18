import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Brand} from '../../../models/brand';
import {BrandService} from '../../../services/brand.service';
import {ToastrService} from 'ngx-toastr';

declare const checkAll: any;

@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.scss']
})
export class BrandManagementComponent implements OnInit {
  @ViewChild('closeCreateModal') closeCreateModal;
  imgSrc = 'https://via.placeholder.com/150';
  selectedImage: any = null;
  downloadURL: Observable<string>;
  brandForm: FormGroup;
  brandFormArray: FormArray = new FormArray([]);
  brand: Brand;
  brandList: Brand[];
  size = 5;
  pageClick = 0;
  pages = [];
  totalPages = 1;
  search = '';
  isSearch = false;
  key = 'id';
  reverse = false;
  brandName: string;
  brandEditForm: FormGroup;
  deleteList = new Array();
  listError: any = {};
  WEBSITE_PATTERN = '^((https?|ftp|smtp):\\/\\/)?(www.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$';
  NAME_PATTERN = '^((?!\s{2,}).)*$';
  NAME_PATTERN2 = '^[a-zA-Z0-9\\_\\-\\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế]+$';

  constructor(
    private brandService: BrandService,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) {
    this.initCreateForm();
    this.brandEditForm = this.fb.group({
      id: [''],
      brandLogo: ['', Validators.required],
      brandName: ['', Validators.required],
      brandAddress: ['', Validators.required],
      brandWebsite: ['', [Validators.required, Validators.pattern(this.WEBSITE_PATTERN)]]
    });
  }

  getAllBrand(): void {
    this.onSubmit(0);
  }

  ngOnInit(): void {
    this.getAllBrand();
    checkAll();

  }

  initCreateForm(): void {
    this.brandForm = this.fb.group({
      brandLogo: [''],
      brandName: ['', [Validators.required, Validators.pattern(this.NAME_PATTERN2), Validators.maxLength(50)]],
      brandAddress: ['', [Validators.required, Validators.pattern(this.NAME_PATTERN2), Validators.maxLength(100)]],
      brandWebsite: ['', [Validators.required, Validators.pattern(this.WEBSITE_PATTERN), Validators.maxLength(50)]]
    });
  }


  showCreateSuccess(): void {
    this.toastr.success('Thêm mới thành công!');
  }

  showCreateError(): void {
    this.toastr.error('Tên thương hiệu đã tồn tại!');
  }

  showCreateWarning(): void {
    this.toastr.warning('Vui lòng nhập đầy đủ thông tin!');
  }

  showEditSuccess(): void {
    this.toastr.success('Thay đổi thành công!');
  }

  showDeleteSuccsess(): void {
    this.toastr.success('Xóa thành công!');
  }

  sort(key): void {
    this.key = key;
    this.reverse = !this.reverse;
  }

  onNext(): void {
    if (this.pageClick < this.totalPages - 1) {
      this.pageClick++;
      this.onSubmit(this.pageClick);
    }
  }

  onPrevious(): void {
    if (this.pageClick > 0) {
      this.pageClick--;
      this.onSubmit(this.pageClick);
    }
  }

  onFirst(): void {
    this.pageClick = 0;
    this.onSubmit(this.pageClick);
  }

  onLast(): void {
    this.pageClick = this.totalPages - 1;
    this.onSubmit(this.pageClick);
  }

  onSubmit(page): void {
    this.brandService.getAllBrand(page, this.size, this.search).subscribe(
      next => {
        this.pageClick = page;
        this.brandList = next.content;
        this.totalPages = next.totalPages;
        this.pages = Array.apply(null, {length: this.totalPages}).map(Number.call, Number);
      },
      error => console.log(error)
    );
  }

  searchName(): void {
    const temp = '';
    if (this.search === temp) {
      this.isSearch = false;
      this.ngOnInit();
    } else {
      this.isSearch = true;
      this.onSubmit(0);
    }
  }

  addNewBrand(): void {
    if (this.brandForm.valid) {
      this.brandService.createBrand(this.brandForm.value).subscribe(
        next => {
          this.showCreateSuccess();
          this.closeCreateModal.nativeElement.click();
          this.initCreateForm();
          this.onSubmit(0);
        },
        error => {
          if (error.status === 400) {
            this.listError = error.error;
          }
          if (error.status === 500) {
            this.showCreateError();
          }
        }
      );
    } else {
      this.showCreateWarning();
    }
  }


  cancelCreateForm(): void {
    this.imgSrc = 'https://via.placeholder.com/150';
    this.initCreateForm();

  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      const time = Date.now();
      const filePath = `BrandLogo/${this.selectedImage.name}_${time}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`BrandLogo/${this.selectedImage.name}_${time}`, this.selectedImage);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.imgSrc = url;
              }
              console.log(this.imgSrc);
            });
          })
        )
        .subscribe(url => {
          if (url) {
            console.log(url);
          }
        });
    } else {
      this.imgSrc = 'https://via.placeholder.com/150';
      this.selectedImage = null;
    }
  }

  catchBrandId(id: number): void {
    this.brandService.findById(id).subscribe(
      res => {
        this.brand = res;
        this.brandName = res.brandName;
        this.brandEditForm.patchValue(res);
      },
      error => {
        console.log(error);
      }
    );
  }

  edit(): void {
    console.log(this.brandForm.value);
    this.brandService.editBrand(this.brandEditForm.value).subscribe(
      next => {
        this.showEditSuccess();
      },
      error => console.log(error));
  }

  delete(): void {
    this.brandService.deleteBrand(this.brand).subscribe(
      next => {
        this.showDeleteSuccsess();
        this.ngOnInit();
        $('#close').click();
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteCheckbox(event, id): void {
    const indexOfId = this.deleteList.indexOf(id);
    if (event.target.checked) {
      if (indexOfId < 0) {
        this.deleteList.push(id);
        console.log(this.deleteList.indexOf(id));
      }
    } else {
      this.deleteList.splice(indexOfId, 1);
    }
  }

  deleteAllCheckbox(event): void {
    if (event.target.checked) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.brandList.length; i++) {
        this.deleteList.push(this.brandList[i].id);
        console.log(this.brandList[i]);
      }
    } else {
      this.deleteList.splice(0, this.deleteList.length);
    }
  }

  deleteManyBrand(): void {
    let deleteConfirm = false;
    if (this.deleteList.length <= 0) {
      // alert('Bạn chưa chọn thương hiệu nào để tiến hành xóa!');
      this.toastr.error('Bạn chưa chọn thương hiệu nào để tiến hành xóa!');
    } else {
      deleteConfirm = confirm('Bạn có chắc chắn muốn xóa những thương hiệu này không?');
    }
    if (deleteConfirm) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.deleteList.length; i++) {
        this.brandService.deleteBrandById(this.deleteList[i]).subscribe(
          next => {
            this.ngOnInit();
            console.log(this.brandList[i]);
          },
          error => console.log(error)
        );
      }
      this.ngOnInit();
    }
  }

  switchEdit(brand: Brand): void {
    brand.isEditable = !brand.isEditable;
    $('#submit' + brand.id).click();
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      brandLogo: [''],
      brandName: ['', [Validators.required, Validators.pattern(this.NAME_PATTERN2), Validators.maxLength(50)]],
      brandAddress: ['', [Validators.required, Validators.pattern(this.NAME_PATTERN2), Validators.maxLength(100)]],
      brandWebsite: ['', [Validators.required, Validators.pattern(this.WEBSITE_PATTERN), Validators.maxLength(50)]]
    });
  }
  onAddRow(): void{
    this.brandFormArray.push(this.createFormGroup());
  }
  onRemoveRow(rowIndex: number): void{
    this.imgSrc = 'https://via.placeholder.com/150';
    this.brandFormArray.removeAt(rowIndex);
  }

  quickAddNewBrand(brandFormArray, index): void {
    if (this.brandFormArray.valid) {
      this.brandService.createBrand(brandFormArray.at(index).value).subscribe(
        next => {
          this.onRemoveRow(index);
          this.showCreateSuccess();
          this.initCreateForm();
          this.onSubmit(0);
        },
        error => {
          if (error.status === 400) {
            this.listError = error.error;
          }
          if (error.status === 500) {
            this.showCreateError();
          }
        }
      );
    } else {
      this.showCreateWarning();
    }
  }
}
