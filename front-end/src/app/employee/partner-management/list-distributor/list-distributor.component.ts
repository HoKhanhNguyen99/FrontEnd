import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
// @ts-ignore
import {
  Commune,
  DeleteListDistributor,
  Distributor,
  District,
  Province,
  TypeOfDistributor
} from '../../../models/distributor';
import {DistributorService} from '../../../services/distributor.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {finalize, map} from 'rxjs/operators';
import {Bill} from '../../../models/bill';
import {element} from 'protractor';

declare var $: any;

@Component({
  selector: 'app-list-distributor',
  templateUrl: './list-distributor.component.html',
  styleUrls: ['./list-distributor.component.scss']
})
export class ListDistributorComponent implements OnInit, AfterViewInit {
  distributorList: Distributor[];
  size = 6;
  pageClick = 0;
  pages = [];
  search = '';
  isSearch = false;
  idHasModifined: number;
  totalPages = 1;
  listError: any = '';
  img: any;
  myForm: FormGroup;
  src = 'https://worklink.vn/wp-content/uploads/2018/07/no-logo.png';
  imgDefault = 'https://worklink.vn/wp-content/uploads/2018/07/no-logo.png';
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  getUrlUploadImgPromise: any;
  typeOfDistributorPromise: any;
  isChangedImg = false;
  isChangedImgList: boolean[] = [];
  myDistributor: Distributor;
  functionTitle: string;
  functionButton: string;
  functionMode: string;
  percentUpload: Observable<number>;
  percentListUpload: Observable<number>[] = [];
  isSubmiting = false;
  deleteList: DeleteListDistributor[] = [];
  imgFile: any;
  imgFileList: any[] = [];
  listProvinces: any[] = [];
  listDistrict: any[] = [];
  listCommune: any[] = [];
  listFormGroup: FormGroup[] = [];
  listBill: Bill[] = [];
  deleteDistributorListFail: Distributor[] = [];
  srcList: string[] = [];
  imgHeight: string;
  modifiedFormGroupList: FormGroup[] = [];
  sentModifiedList: Distributor[] = [];
  failModifiedList: Distributor[] = [];
  numberOfModifiedFormGroupList = 0;
  distributorListName: string[] = [];
  countListSentEditMore = 0;
  listModifiedIdSuccess: number[] = [];
  listDeleteSucces: string[] = [];
  distributorName: string;
  distributorId: number;
  deleteIsModifyingList: Distributor[] = [];
  deleteSuccessList: Distributor[] = [];
  deleteUnsuccessList: Distributor[] = [];

  constructor(private fb: FormBuilder,
              private distributorService: DistributorService,
              private router: Router, private afStorage: AngularFireStorage) {
    // console.log(this.myForm)
    this.myForm = fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\_\\-\\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮ' +
        'ẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế]+$')]],
      numberPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z][a-z0-9_\\.]{5,}@[a-z0-9]{1,}(\\.[a-z0-9]{2,4}){1,2}$')]],
      address: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\/\\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế]+$')]],
      fax: ['', [Validators.pattern('^[0-9]{10}$')]],
      website: ['', [Validators.pattern('^((http:\/\/www\.)|(https:\/\/www\.))([a-zA-Z0-9]+\.){1,2}[a-zA-Z0-9]+$')]],
      img: [''],
      typeOfDistributor: [''],
      deleted: ['false']
    });
    this.autoGenFormGroupList();

  }

  ngAfterViewInit(): void {
    $('.selectpicker').selectpicker('refresh');
  }

  onNext(): void {
    if (this.pageClick < this.totalPages - 1) {
      this.pageClick++;
      this.onChange(this.pageClick);
      $('#all').prop('checked', false);
    }
  }

  onPrevious(): void {
    if (this.pageClick > 0) {
      this.pageClick--;
      this.onChange(this.pageClick);
      $('#all').prop('checked', false);
    }
  }

  onFirst(): void {
    this.pageClick = 0;
    this.onChange(this.pageClick);
    $('#all').prop('checked', false);
  }

  onLast(): void {
    this.pageClick = this.totalPages - 1;
    $('#all').prop('checked', false);
    this.onChange(this.pageClick);
  }

  onChange(page): void {
    // this.listModifiedIdSuccess = [];
    this.resetSessionAll();
    this.distributorService.getAllDistributor(page, this.size, this.search).subscribe(
      next => {
        if (next !== null) {
          this.pageClick = page;
          this.distributorList = next.content;
          this.totalPages = next.totalPages;
          this.pages = Array.apply(null, {length: this.totalPages}).map(Number.call, Number);
          this.router.navigate(['employee/partner-management/list-distributor']);
          this.resetEditMore();
          for (let i = 0; i < this.size; i++) {
            if (this.sentModifiedList[i] !== null) {
              this.listFormGroup[i].reset();
            }
          }
        } else {
          this.distributorList = [];

        }

      },
      error => {
        this.distributorList = [];
        // this.fillListToSize();
      }
    );
    this.deleteList = [];
    $('#all').prop('checked', false);
    $('#editMore').prop('hidden', true);
    for (let i = 1; i < this.size; i++) {
      this.listFormGroup[i].reset();
    }
    this.enableModifiedMoreButton();
  }


  setTypeOfDistrubutor(i: number): void {
    $('#selectType' + i).selectpicker('refresh');
    $('#selectType' + i).val(this.listFormGroup[i].value.typeOfDistributor.id);
    $('#selectType' + i).selectpicker('refresh');

  }

  getTypeOfDistributor(i: number): void {
    let typeOfDistributor = $('#selectType' + i + ' option:selected').text();
    typeOfDistributor = typeOfDistributor.replace('Phân phối ', '');
    this.distributorService.findTypeOfDistributorByName(typeOfDistributor).subscribe(
      res => {
        this.listFormGroup[i].value.typeOfDistributor = res;
        console.log(res);
      },
      error => {
        console.log(error);
      }
    );

  }

  // Không xóa data list formGroup
  onChange2(page): void {
    this.distributorService.getAllDistributor(page, this.size, this.search).subscribe(
      next => {
        if (next !== null) {
          this.pageClick = page;
          this.distributorList = next.content;
          this.totalPages = next.totalPages;
          this.pages = Array.apply(null, {length: this.totalPages}).map(Number.call, Number);
          this.router.navigate(['employee/partner-management/list-distributor']);
          this.resetEditMore();
        } else {
          this.distributorList = [];
        }
      },
      error => {
        this.distributorList = [];
        // this.fillListToSize();
      }
    );
    this.deleteList = [];
    $('#all').prop('checked', false);
  }

  getAllDistributor(): void {
    this.onChange(this.pageClick);
  }

  ngOnInit(): void {
    this.getAllDistributor();
    // Thach
    $('.icon-upload-alt').css('opacity', '-1');
    // tslint:disable-next-line:typedef
    $('.button').click(function() {
      const buttonId = $(this).attr('id');
      $('#modal-container').removeAttr('class').addClass(buttonId);
      $('body').addClass('modal-active');
    });
    // tslint:disable-next-line:typedef
    $('#modal-container').click(function() {
      $(this).addClass('out');
      $('body').removeClass('modal-active');
    });

    document.body.addEventListener('click', (e: any) => {
      const elem = e.target;
      if (elem.getAttribute('aria-label') === 'expand row') {
        changeToggleButtonIcon(elem);
      }
    })
    ;

    $('.province').on('change', function() {
      $('.district').selectpicker('refresh');
    });
  }


  onSubmit(): void {
    this.myForm.markAllAsTouched();
    this.checkValidateTypeOfDistributor();
    if (this.isSubmiting === false) {
      if (this.myForm.valid) {
        if (this.functionMode === 'create') {
          if (this.isChangedImg) {
            this.uploadFireBaseAndSubmit();
          } else {
            this.submitForm();
          }
        } else if (this.functionMode === 'edit') {
          this.createAndUpdateForm();
        }
      } else {
        if (this.isSubmiting === false) {
          this.showNotications('Vui lòng kiểm tra lại các trường');
        } else {
          this.showNotications('Bạn đã hủy đăng ký');
        }
      }
    }
  }

  createAndUpdateForm(): void {
    if (this.isChangedImg) {
      this.uploadFireBaseAndSubmit();
    } else {
      this.submitForm();
    }
  }

  deleteDistributor(id: number): void {
    this.distributorService.deleteById(id).subscribe(
      res => {
        this.showNotications('Xóa nhà phân phối thành công');
        this.resetList();
      },
      error => {
        this.showNotications('Xóa nhà phân phối thất bại');
      }
    );
  }

  private submitForm(): void {
    if (this.functionMode === 'create') {
      if (this.typeOfDistributorPromise !== undefined) {
        this.typeOfDistributorPromise.then(value => {
          this.myForm.value.typeOfDistributor = value;
          this.distributorService.create(this.myForm.value).subscribe(
            res => {
              this.showNotications('Thêm mới thành công');
              this.resetList();
              this.isSubmiting = true;
              $('#closeForm').click();
            },
            error => {
              this.showNotications('Thêm mới thất bại');
            }
          );
        });
      }
    } else if (this.functionMode === 'edit') {
      if (this.typeOfDistributorPromise !== undefined) {
        this.typeOfDistributorPromise.then(value => {
          this.myForm.value.typeOfDistributor = value;
          this.distributorService.create(this.myForm.value).subscribe(
            res => {
              this.idHasModifined = this.myForm.value.id;
              this.showNotications('Chỉnh sửa thành công');
              this.resetList();
              this.isSubmiting = true;
              $('#closeForm').click();
            },
            error => {
              this.showNotications('Chỉnh sửa thất bại');
            }
          );
        });
      } else {
        this.distributorService.create(this.myForm.value).subscribe(
          res => {
            this.idHasModifined = this.myForm.value.id;
            this.showNotications('Chỉnh sửa thành công');
            this.resetList();
            this.isSubmiting = true;
            $('#closeForm').click();
          },
          error => {
            this.showNotications('Chỉnh sửa thất bại');
          }
        );
      }
    }
  }

  private submitForm2(i: number): void {
    this.listFormGroup[i].markAllAsTouched();
    if (this.listFormGroup[i].valid) {
      $('#submit' + i).prop('disabled', true);
      this.getAddress(i);
      this.uploadFireBaseAndSubmit2(i);
    }
  }

  resetSessionAll(): void {
    for (let i = 0; i < this.size; i++) {
      if (this.listFormGroup[i] !== undefined && this.listFormGroup[i].value.id !== null) {
        this.distributorService.removeSession(this.listFormGroup[i].value.id).subscribe(
          res => console.log('Remove Session'),
          error => {
          }
        );
      }
    }
  }

  loadImgAvatar(target: any): void {
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        $('#avatar').attr('src', e.target.result);
      };
      reader.readAsDataURL(target.files[0]);
      this.imgFile = target.files[0];
      $('#myAvatar').val(null);
      this.isChangedImg = true;
    } else {
      console.log('error');
    }
  }

  enableSubmitButton(i: number): void {
    if (this.listFormGroup[i].valid) {
      $('#submit' + i).prop('disabled', false);
    } else {
      $('#submit' + i).prop('disabled', true);
    }

  }

  loadImgAvatar2(target: any, i: number): void {
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        $('#img' + i).attr('src', e.target.result);
      };
      reader.readAsDataURL(target.files[0]);
      this.imgFileList[i] = target.files[0];
      $('#img' + i).val(null);
      this.isChangedImgList[i] = true;
    } else {
      console.log('error');
    }
  }

// UPLOAD FIREBASE ========================================================
  private uploadFireBaseAndSubmit(): void {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(this.imgFile);
    this.percentUpload = this.task.snapshotChanges()
      .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.getUrlUploadImgPromise = new Promise((resolve, reject) => {
            resolve(url);
            this.myForm.value.img = url;
            this.submitForm();
          });
        });
      }))
      .subscribe();

  }

  private uploadFireBaseAndSubmit2(i: number): void {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    if (this.isChangedImgList[i]) {
      this.task = this.ref.put(this.imgFileList[i]);
      this.percentUpload = this.task.snapshotChanges()
        .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.getUrlUploadImgPromise = new Promise((resolve, reject) => {
              resolve(url);
              this.listFormGroup[i].value.img = url;
              this.saveModifiedDistributor(i);
            });
          });
        }))
        .subscribe();
    } else {
      this.saveModifiedDistributor(i);
    }
  }

  private uploadFireBaseAndSubmitEditMore(i: number): void {
    if (this.isChangedImgList[i]) {
      const id = Math.random().toString(36).substring(2);
      this.ref = this.afStorage.ref(id);
      this.task = this.ref.put(this.imgFileList[i]);
      this.percentListUpload[i] = this.task.snapshotChanges()
        .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.sentModifiedList[i].img = url;
            this.saveModifiedDistributorNoNotications(i);
          });
        }))
        .subscribe();
    } else {
      // this.percentListUpload[i] = this.task.snapshotChanges()
      //   .pipe(map(s => 100));
      this.saveModifiedDistributorNoNotications(i);
    }
  }


  private saveModifiedDistributor(i: number): void {
    this.distributorService.save(this.listFormGroup[i].value).subscribe(
      res => {
        this.distributorService.removeSession(this.listFormGroup[i].value.id).subscribe(
          res2 => {
            console.log('remove Session');
          }, error => {

          }
        );
        this.showNotications('Chỉnh sửa nhà phân phối thành công');
        this.listModifiedIdSuccess[i] = this.listFormGroup[i].get('id').value;
        for (let a = 0; a < this.size; a++) {
          this.listFormGroup[a].reset();
        }

        // this.numberOfModifiedFormGroupList = 0;
        // this.modifiedFormGroupList = [];
        this.resetList();
        this.enableModifiedMoreButton();
      }, error => console.log(error));
  }


  private saveModifiedDistributorNoNotications(i: number): void {
    this.distributorService.save(this.sentModifiedList[i]).subscribe(
      res => {
        this.distributorService.removeSession(this.listFormGroup[i].value.id).subscribe(
          res2 => {
            console.log('remove Session');
          }, error => {

          }
        );
        this.idHasModifined = this.sentModifiedList[i].id;
        $('#checkboxEditMore' + i).prop('disable', false);
        $('#checkboxEditMore' + i).prop('checked', true);
        $('#checkboxEditMore' + i).prop('disable', true);
        this.listModifiedIdSuccess.push(this.sentModifiedList[i].id);
        this.countListSentEditMore++;
        this.enableAcceptEditMoreButton();
        this.distributorListName[i] += ' (OK)';
        this.onChange2(this.pageClick);
      }, error => console.log(error));
  }

  checkHighlightRecord(id: number): boolean {
    return this.listModifiedIdSuccess.indexOf(id) !== -1 ? true : false;
  }

  hoverUploadPic(): void {
    $('.icon-upload-alt').css('opacity', '0.8');
  }

  hoverUploadPic2(i: number): void {
    $('#inputIcon' + i).css('opacity', '0.8');
  }

  // tslint:disable-next-line:typedef
  leaveUploadPic() {
    $('.icon-upload-alt').css('opacity', '-1');
  }

  leaveUploadPic2(i: number): void {
    $('#inputIcon' + i).css('opacity', '-1');
  }


  // tslint:disable-next-line:typedef
  selectAvatar() {
    $('#myAvatar').click();
  }

  selectAvatar2(i: number): void {
    $('#inputImg' + i).click();
  }

  chooseAll(item: HTMLInputElement): void {
    if ($('#box-1').prop('checked')) {
      $('#box-2, #box-3').prop('checked', true);
      this.distributorService.findTypeOfDistributorByName('Tất cả').subscribe(
        res => {
          this.typeOfDistributorPromise = new Promise(resolve => resolve(res));
        },
        error => console.log(error)
      );
    } else {
      $('#box-2, #box-3').prop('checked', false);
      this.myForm.value.typeOfDistributor = null;
    }
    this.checkValidateTypeOfDistributor();
  }

  chooseOne(target: HTMLInputElement): void {
    if ($('#box-2').is(':checked') && $('#box-3').is(':checked')) {
      $('#box-1').prop('checked', true);
      this.distributorService.findTypeOfDistributorByName('Tất cả').subscribe(
        res => this.typeOfDistributorPromise = new Promise(resolve => resolve(res)),
        error => console.log(error)
      );
    } else if ($('#box-2').is(':checked')) {
      $('#box-1').prop('checked', false);
      this.distributorService.findTypeOfDistributorByName('Bánh').subscribe(
        res => {
          this.typeOfDistributorPromise = new Promise(resolve => resolve(res));
        },
        error => console.log(error)
      );
    } else {
      $('#box-1').prop('checked', false);
      this.distributorService.findTypeOfDistributorByName('Kẹo').subscribe(
        res => {
          this.typeOfDistributorPromise = new Promise(resolve => resolve(res));
        },
        error => console.log(error)
      );
    }
    this.checkValidateTypeOfDistributor();
  }

  // CHECK VALIDATE TYPE OF DISTRIBUTOR ========================================================
  private checkValidateTypeOfDistributor(): void {
    const checkedBox2 = $('#box-2').prop('checked');
    const checkedBox3 = $('#box-3').prop('checked');
    const checkTypeOfDistributor = (checkedBox2 === false && checkedBox3 === false);
    if (checkTypeOfDistributor) {
      this.myForm.get('typeOfDistributor').setErrors({required: true});
    } else {
      this.myForm.get('typeOfDistributor').setErrors(null);
    }
  }


  private getAddress(i: number): void {
    const province = $('#province' + i + ' option:selected').text();
    const district = $('#district' + i + ' option:selected').text();
    const commune = $('#commune' + i + ' option:selected').text();
    this.listFormGroup[i].value.address = commune + ' - ' + district + ' - ' + province;
  }

  setAddress(i: number, str: string): void {
    const arr = str.split(' - ');
    this.distributorService.findProvinceByName(arr[2]).subscribe(
      res => {
        this.changeProvince(res.matp, i);
        $('#province' + i).val(res.matp);
        $('#province' + i).selectpicker('refresh');
        this.distributorService.findDistrictByName(arr[1]).subscribe(
          res1 => {
            this.changeDistrict(res1.maqh, i);
            this.distributorService.findCommuneByName(arr[0]).subscribe(
              res2 => {
                this.changeCommune(res2.xaid, i);
                $('#commune' + i).val(res2.xaid);
                $('#commune' + i).selectpicker('refresh');
              }, error => {

              }
            );
          }, error => {

          }
        );

      }, error => {
        console.log(error);
      }
    );

  }

  openEditForm(id: number): void {
    this.functionMode = 'edit';
    this.switchCreateAndDetailForm();
    this.isSubmiting = false;
    this.myForm.markAllAsTouched();
    this.percentUpload = new Observable<number>();
    this.functionTitle = 'CHỈNH SỬA NHÀ PHÂN PHỐI';
    this.functionButton = 'SỬA';
    this.isChangedImg = false;
    this.distributorService.findById(id).subscribe(
      res => {
        this.myDistributor = res;
        this.myForm.patchValue(res);
        if (this.myForm.value.img !== '') {
          this.src = this.myForm.value.img;
        }
        switch (this.myForm.value.typeOfDistributor.name) {
          case 'Tất cả' : {
            $('#box-2, #box-3,#box-1').prop('checked', true);
            break;
          }
          case 'Bánh': {
            $('#box-2').prop('checked', true);
            $('#box-1,#box-3').prop('checked', false);
            break;
          }
          case 'Kẹo' : {
            $('#box-3').prop('checked', true);
            $('#box-1,#box-2').prop('checked', false);
            break;
          }
        }
      },
      error => console.log(error)
    );
    $('#openForm').click();

  }


  openCreateForm(): void {
    this.functionMode = 'create';
    this.switchCreateAndDetailForm();
    this.isSubmiting = false;
    this.percentUpload = new Observable<number>();
    this.src = 'https://worklink.vn/wp-content/uploads/2018/07/no-logo.png';
    $('#avatar').attr('src', this.src);
    $('#box-2, #box-3,#box-1').prop('checked', false);

    this.myForm.reset();
    this.functionTitle = 'THÊM MỚI NHÀ PHÂN PHỐI';
    this.functionButton = 'THÊM';
    $('#openForm').click();
  }

// HIEN THONG BAO ========================================================
  showNotications(mess: string): void {
    const temp = document.getElementById('snackbar');
    temp.textContent = '';
    temp.append(mess);
    // Add the "show" class to DIV
    temp.className = 'showSnackbar';
    // After 3 seconds, remove the show class from DIV
    setTimeout(() => {
      temp.className = temp.className.replace('show', '');
    }, 3000);
  }


  openDeleteForm(id: number, name: string, index: number): void {
    this.distributorService.checkIsNotModifying(id).subscribe(
      res => {
        this.distributorName = name;
        this.distributorId = id;
        if (res) {
          this.distributorService.findAllBillIsExistDistributor(id).toPromise().then(
            value => {
              if (value.length !== 0) {
                this.listBill = value;
                this.distributorService.removeSession(id).subscribe(
                  res2 => console.log('remove Session success'),
                  error => {

                  }
                );
                $('#deleteInformation').click();
              } else {

                $('#deleteForm').click();
              }
            }
          );
        } else {
          $('#multiTab').click();
        }
      }, error => {

      }
    );

  }


  private removeSessionAndCheckDeleteDistributor(id: number): void {
    this.distributorService.findByIdToDo(id, 2).subscribe(
      res => {
        if (res !== null) {
          this.myDistributor = res;
          this.distributorName = res.name;
          this.distributorService.findAllBillIsExistDistributor(id).toPromise().then(
            value => {
              this.listBill = value;
              if (this.listBill.length === 0) {
                $('#deleteForm').click();
              } else {
                this.distributorService.removeSession(id).subscribe(
                  res4 => console.log('Remove Session Success'),
                  error => {
                  }
                );
                $('#deleteInformation').click();
              }
            }, reason => {
              console.log(reason);
            }
          );
        } else {
          $('#multiTab').click();
        }
      },
      error => console.log(error)
    );
  }

  searchName(): void {
    if (this.search === '') {
      this.isSearch = false;
    } else {
      this.isSearch = true;
    }
    this.onChange(0);
  }

  backToSearch(): void {
    this.search = '';
    this.isSearch = false;
    this.ngOnInit();
  }

  openDetailForm(id: number): void {
    this.functionMode = 'detail';
    this.functionTitle = 'XEM THÔNG TIN NHÀ PHÂN PHỐI';
    this.switchCreateAndDetailForm();
    this.distributorService.findById(id).subscribe(
      res => {
        this.myForm.patchValue(res);
        if (this.myForm.value.img !== '') {
          this.src = this.myForm.value.img;
        }
        switch (this.myForm.value.typeOfDistributor.name) {
          case 'Tất cả' : {
            $('#box-2, #box-3,#box-1').prop('checked', true);
            break;
          }
          case 'Bánh': {
            $('#box-2').prop('checked', true);
            $('#box-1,#box-3').prop('checked', false);
            break;
          }
          case 'Kẹo' : {
            $('#box-3').prop('checked', true);
            $('#box-1,#box-2').prop('checked', false);
            break;
          }
        }
      },
      error => console.log(error)
    );
    $('#openForm').click();


  }

// CHUYEN TRANG THAI CAC NUT ========================================================
  switchCreateAndDetailForm(): void {
    const input = $('input');
    const inputFile = $('input[type=file]');
    const inputCheckbox = $('input[name=checkbox]');
    if (this.functionMode === 'create' || this.functionMode === 'edit') {
      input.prop('readonly', false);
      inputCheckbox.prop('disabled', false);
      inputFile.prop('disabled', false);
    } else {
      input.prop('readonly', true);
      inputCheckbox.prop('disabled', true);
      inputFile.prop('disabled', true);
    }
    $('#search').prop('readonly', false);
  }

// RESET LIST SAU CRUD ========================================================
  resetList(): void {
    let count = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.distributorList.length; i++) {
      if (this.distributorList[i].id !== undefined) {
        count++;
      }
    }
    if (this.distributorList.length === 1 || this.deleteList.length === count) {
      if (this.pageClick >= 1) {
        this.onChange(this.pageClick - 1);
      } else {
        this.onChange(this.pageClick);
      }
    } else {
      this.onChange(this.pageClick);
    }
    this.router.navigate(['employee/partner-management/list-distributor']);
  }


// GET MESS VALIDATE ========================================================
  getErrorMessage(field: string): string {
    const isFormField = this.myForm.get(field);
    if (isFormField.hasError('required') && isFormField.touched) {
      switch (field) {
        case ('email'):
          return 'Email nhà phân phối không được trống!';
          break;
        case ('numberPhone'):
          return 'SĐT nhà phân phối không được trống!';
          break;
        case ('name'):
          return 'Tên nhà phân phối không được trống!';
          break;
        case ('address'):
          return 'Địa chỉ nhà phân phối không được trống!';
          break;
        case 'typeOfDistributor' : {
          return 'Bạn chưa lựa chọn loại phân phối';
          break;
        }
        default:
          return '';
      }

    }
    if (isFormField.hasError('pattern') && isFormField.touched) {
      switch (field) {
        case ('email'):
          return 'Email không hợp lệ. Email theo định dạng :  abc@def.ghk';
          break;
        case ('numberPhone'):
          return 'Số điện thoại không hợp lệ (yêu cầu 10 số)';
          break;
        case ('name'):
          return 'Tên không được chứa kí tự đặc biệt';
          break;
        case ('address'):
          return 'Địa chỉ không được chứa kí tự đặc biệt';
          break;
        case ('fax'):
          return 'Số fax gồm 9 số';
          break;
        case ('website'):
          return 'Website phải đúng định dạng : http(s)://www.abc.def(.hjk)';
          break;
        default:
          return '';
      }
    }
    if (isFormField.hasError('exist') && isFormField.touched) {
      switch (field) {
        case 'name': {
          return 'Nhà phân phối đã tồn tại trong dữ liệu';
          break;
        }
        default : {

        }
      }
    }

  }

  getErrorMessage2(field: string, f: FormGroup): string {
    const isFormField = f.get(field);
    if (isFormField.hasError('required') && isFormField.touched) {
      switch (field) {
        case ('email'):
          return 'Email nhà phân phối không được trống!';
          break;
        case ('numberPhone'):
          return 'SĐT nhà phân phối không được trống!';
          break;
        case ('name'):
          return 'Tên nhà phân phối không được trống!';
          break;
        case ('address'):
          return 'Địa chỉ nhà phân phối không được trống!';
          break;
        case 'typeOfDistributor' : {
          return 'Bạn chưa lựa chọn loại phân phối';
          break;
        }
        default:
          return '';
      }

    }
    if (isFormField.hasError('pattern') && isFormField.touched) {
      switch (field) {
        case ('email'):
          return 'Email không hợp lệ. Email theo định dạng :  abc@def.ghk';
          break;
        case ('numberPhone'):
          return 'Số điện thoại không hợp lệ (yêu cầu 10 số)';
          break;
        case ('name'):
          return 'Tên không được chứa kí tự đặc biệt';
          break;
        case ('address'):
          return 'Địa chỉ không được chứa kí tự đặc biệt';
          break;
        case ('fax'):
          return 'Số fax gồm 10 số';
          break;
        case ('website'):
          return 'Website phải đúng định dạng : http(s)://www.abc.def(.hjk)';
          break;
        default:
          return '';
      }
    }
    if (isFormField.hasError('exist') && isFormField.touched) {
      switch (field) {
        case 'name': {
          return 'Nhà phân phối đã tồn tại trong dữ liệu';
          break;
        }
        default : {

        }
      }
    }
    if (isFormField.hasError('province')) {
      return 'Bạn chưa chọn tỉnh';
    }

  }

  addToListDelete(id: any, name: string): void {
    if (id !== 'all') {
      if (id !== undefined) {
        if ($('#checkbox' + id).prop('checked')) {
          this.deleteList === null ? this.deleteList[0] = new DeleteListDistributor(id, name)
            : this.deleteList[this.deleteList.length] = new DeleteListDistributor(id, name);
        } else {
          this.deleteList.splice(this.deleteList.indexOf(id), 1);
        }
        console.log(this.deleteList);
      }
    } else {
      let item: DeleteListDistributor;
      if ($('#all').prop('checked')) {
        for (let i = 0; i < this.distributorList.length; i++) {
          if (this.distributorList[i].id !== undefined) {
            item = new DeleteListDistributor(this.distributorList[i].id, this.distributorList[i].name);
            this.deleteList[i] = item;
            $('#checkbox' + item.id).prop('checked', true);
          }
        }
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.distributorList.length; i++) {
          if (this.distributorList[i].id !== undefined) {
            item = new DeleteListDistributor(this.distributorList[i].id, this.distributorList[i].name);
            $('#checkbox' + item.id).prop('checked', false);
            this.deleteList.splice(this.deleteList.indexOf(item), 1);
          }
        }
      }
    }
    if (this.deleteList.length !== 0) {
      $('#deleteMore').prop('hidden', false);
    } else {
      $('#deleteMore').prop('hidden', true);
    }
  }

  deleteAll(): void {
    this.distributorService.deleteAllDistributor(this.deleteList).subscribe(
      res => {
        this.deleteIsModifyingList = res.modifyingList;
        this.deleteSuccessList = res.successList;
        this.deleteUnsuccessList = res.unsuccessList;
        $('#deleteAllFormInfor').click();
        this.resetList();
        $('#all').prop('checked', false);
        $('#deleteMore').prop('hidden', true);

      },
      error => {
        this.showNotications('Xóa thất bại');
      }
    );
  }

  confirmDeleteAll(): void {
    if (this.deleteList.length !== 0) {
      $('#deleteAllForm').click();
    } else {
      this.showNotications('Bạn chưa chọn nhà phân phối');
    }
  }

  removeFromDeleteList(item: DeleteListDistributor): void {
    this.deleteList.splice(this.deleteList.indexOf(item), 1);
    $('#checkbox' + item.id).prop('checked', false);
    if (this.deleteList.length === 0) {
      $('#closeDeleteAllForm').click();
      $('#all').prop('checked', false);
      $('#deleteMore').prop('hidden', true);
      for (let i = 0; i < this.distributorList.length; i++) {
        $('#checkbox' + i).prop('checked', false);
      }
    }
  }


  checkValidateDistributorIsExist2(i: number, id: number): void {
    const searchName = this.listFormGroup[i].get('name').value;
    if (searchName !== '') {
      this.distributorService.isExistDistributorName(searchName, id).subscribe(
        res => {
          if (res !== null && searchName === res.name) {
            this.listFormGroup[i].get('name').setErrors({exist: true});
          }
        },
        error => {
          console.log(error);
        }
      );
    }
    for (let a = i - 1; a >= 0; a--) {
      if (this.listFormGroup[i].value.name === this.listFormGroup[a].value.name) {
        this.listFormGroup[i].get('name').setErrors({exist: true});
      }
    }

  }


  openEditForm2(index: number, id: number, name: string): void {
    const isHidden = $('#panel' + index).prop('hidden');
    if (isHidden) {
      $('#submit' + index).prop('disabled', false);
      this.isChangedImgList[index] = false;
      this.distributorService.checkIsNotModifying(id).subscribe(
        res1 => {
          if (res1) {
            this.distributorService.setSession(id, 1).subscribe(
              res => console.log('Set Session success'),
              error => {
              }
            );
            this.distributorService.findById(id).subscribe(
              res => {
                this.distributorListName[index] = res.name;
                this.listFormGroup[index].patchValue(res);
                this.modifiedFormGroupList[this.numberOfModifiedFormGroupList] = this.listFormGroup[index];
                this.numberOfModifiedFormGroupList++;
                this.enableModifiedMoreButton();
                this.setAddress(index, res.address);
                this.setTypeOfDistrubutor(index);
                if (res.img !== '') {
                  this.srcList[index] = res.img;
                } else {
                  this.srcList[index] = this.imgDefault;
                }
                this.enableSubmitButton(index);
                $('#panel' + index).prop('hidden', !isHidden);
                this.imgHeight = $('.imgWidth')[index].clientWidth + 'px';
              }, error => {

              }
            );
          } else {
            this.distributorName = name;
            $('#multiTab').click();
          }
        },

        error1 => {
        }
      );
    } else {
      this.closeEditForm2(index, id);
    }


  }

  changeProvince(value: string, i: number): void {
    this.distributorService.findAllDistrictByProvinceId(value).subscribe(
      res => {
        this.listDistrict[i] = res;
        // setTimeout(this.ngAfterViewInit, 10);
        this.changeDistrict(this.listDistrict[i][0].maqh, i);
        $('#province' + i).val(value);
        $('#province' + i).selectpicker('refresh');

      },
      error1 => {
      }
    );
  }

  enableModifiedMoreButton(): void {
    let count = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.listFormGroup[i] !== null && this.listFormGroup[i] !== undefined) {
        if (this.listFormGroup[i].value.name !== null && this.listFormGroup[i].value.name !== undefined) {
          count++;
        }
      } else {
        count++;
      }

    }
    if (count >= 2) {
      $('#editMore').prop('hidden', false);
    } else {
      $('#editMore').prop('hidden', true);
    }
  }

  changeDistrict(value: string, i: number): void {
    this.distributorService.findAllCommuneByDistrictId(value).subscribe(
      res => {
        this.listCommune[i] = res;
        $('#district' + i).selectpicker();
        $('#district' + i).val(value);
        $('#district' + i).selectpicker('refresh');
        setTimeout(this.ngAfterViewInit, 10);
        this.changeCommune(this.listCommune[i][0].xaid, i);


      },
      error1 => {
      }
    );
  }

  changeCommune(xaid: string, i: number): void {
    this.distributorService.findCommuneById(xaid).subscribe(
      res => {
        $('#commune' + i).val(xaid);
        $('#commune' + i).selectpicker('refresh');
        setTimeout(this.ngAfterViewInit, 10);
      }, error => {

      }
    );
  }


  autoGenFormGroupList(): void {
    for (let i = 0; i < this.size; i++) {
      this.listFormGroup[i] = this.fb.group({
        id: [''],
        name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\_\\-\\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮ' +
          'ẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế]+$')]],
        numberPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.pattern('^[a-z][a-z0-9_\\.]{5,}@[a-z0-9]{1,}(\\.[a-z0-9]{2,4}){1,2}$')]],
        address: [''],
        fax: ['', [Validators.pattern('^[0-9]{10}$')]],
        website: ['', [Validators.pattern('(^((http:\/\/www\.)|(https:\/\/www\.))([a-zA-Z0-9]+\.){1,2}[a-zA-Z0-9]+$)|(^$)')]],
        img: [''],
        typeOfDistributor: [''],
        deleted: ['false']
      });

    }
    this.autoGenProvinceList();
    // this.autoGenDistrictList();
    // this.autoGenCommuneList();
  }

  autoGenProvinceList(): void {
    this.distributorService.findAllProvince().subscribe(
      res => {
        for (let i = 0; i < this.size; i++) {
          this.listProvinces[i] = res;
        }
      }, error => console.log(error)
    );
  }

  autoGenDistrictList(): void {
    this.distributorService.findAllDistrictByProvinceId('01').subscribe(
      res => {
        for (let i = 0; i < this.size; i++) {
          this.listDistrict[i] = res;
        }
      }, error => console.log(error)
    );
  }

  autoGenCommuneList(): void {
    this.distributorService.findAllCommuneByDistrictId('001').subscribe(
      res => {
        for (let i = 0; i < this.size; i++) {
          this.listCommune[i] = res;
        }
      }, error => console.log(error)
    );
  }

  getDetailBill(id: number, name: string): void {
    this.distributorService.findAllBillIsExistDistributor(id).subscribe(
      res1 => {
        this.distributorName = name;
        this.distributorId = id;
        this.listBill = res1;
        this.removeSession(id);
        $('#deleteInformation').click();
        $('#deleteAllForm').hide();
      }, error => {
      }
    );
  }


  closeEditForm2(index: number, id: number): void {
    const isHidden = $('#panel' + index).prop('hidden');
    this.distributorService.removeSession(id).subscribe(
      res => {
        $('#panel' + index).prop('hidden', !isHidden);
        this.modifiedFormGroupList.splice(this.modifiedFormGroupList.indexOf(this.listFormGroup[index]), 1);
        this.listFormGroup[index].reset();
        this.numberOfModifiedFormGroupList--;
        this.enableModifiedMoreButton();
      }, error => {

      }
    );

  }

  showEditMoreInfor(): void {
    this.countListSentEditMore = 0;
    this.failModifiedList = [];
    for (let i = 0; i < this.size; i++) {
      if (this.listFormGroup[i].valid) {
        this.getAddress(i);
        this.sentModifiedList[i] = this.listFormGroup[i].value;
      } else {
        this.sentModifiedList[i] = null;
        if (this.listFormGroup[i] !== undefined && this.listFormGroup[i] !== null && this.listFormGroup[i].value.name !== null) {
          this.failModifiedList.push(this.listFormGroup[i].value);
        }
      }
    }
    console.log(this.failModifiedList);
    $('#modifiedMoreForm').click();
    let count = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.listFormGroup[i] !== null && this.listFormGroup[i] !== undefined) {
        if (this.listFormGroup[i].valid) {
          count++;
        }

      }
    }
    if (count >= 1) {
      $('#submitEditMore').prop('disabled', false);
    } else {
      $('#submitEditMore').prop('disabled', true);
    }
    $('#cancelEditMore').prop('hidden', false);
    $('#submitEditMore').prop('hidden', false);
    $('#closeEditMore').prop('hidden', true);
    $('#closeEditMore').prop('disabled', true);
  }

  submitModifiedMore(): void {
    for (let i = 0; i < this.size; i++) {
      if (this.sentModifiedList[i] !== null) {
        this.uploadFireBaseAndSubmitEditMore(i);
      }
      if (this.failModifiedList[i] !== undefined) {
        this.distributorService.removeSession(this.failModifiedList[i].id).subscribe(
          res => console.log('Remove Session Success'),
          error => {

          }
        );
      }

    }
    $('#cancelEditMore').prop('hidden', true);
    $('#submitEditMore').prop('hidden', true);
    $('#closeEditMore').prop('hidden', false);
  }

  private resetEditMore(): void {
    this.numberOfModifiedFormGroupList = 0;
    this.modifiedFormGroupList = [];
    this.enableModifiedMoreButton();
  }

  closeEditMoreForm(): void {
    for (let i = 0; i < this.size; i++) {
      this.listFormGroup[i].reset();
    }
    $('#editMore').prop('hidden', true);
  }


  // Enalble button xac nhan Form EDIT MORE
  enableAcceptEditMoreButton(): void {
    const count = this.countSentList();
    console.log(count + ' ' + this.countListSentEditMore);
    if (count === this.countListSentEditMore) {
      $('#closeEditMore').prop('disabled', false);
    }
  }

  private countSentList(): number {
    let count = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.sentModifiedList[i] !== null) {
        count++;
      }
    }
    return count;
  }

  removeSession(id: number): void {
    this.distributorService.removeSession(id).subscribe(
      res => console.log('Remove session Success'),
      error => {

      }
    );
  }
}

function changeToggleButtonIcon(button): void {
  const attrName = 'uk-icon';
  const icon = button.querySelector(`[${attrName}]`);
  if (icon.getAttribute(attrName) === 'chevron-right') {
    icon.setAttribute(attrName, 'chevron-down');
  } else {
    icon.setAttribute(attrName, 'chevron-right');
  }
}

