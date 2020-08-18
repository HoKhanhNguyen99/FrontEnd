export class Distributor {
  id: number;
  name: string;
  address: string;
  numberPhone: string;
  email: string;
  img: string;
  deleted: boolean;
  fax: string;
  website: string;
  typeOfDistributor: TypeOfDistributor;
  status: number;

  constructor(id: number, name: string, address: string, numberPhone: string, email: string, img: string,
              fax: string, website: string, typeOfDistributor: TypeOfDistributor, deleted: boolean) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.numberPhone = numberPhone;
    this.email = email;
    this.img = img;
    this.fax = fax;
    this.website = website;
    this.typeOfDistributor = typeOfDistributor;
    this.deleted = deleted;
  }
}

export class TypeOfDistributor {
  id: number;
  name: string;
}

export class DeleteListDistributor {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class Province {
  matp: string;
  name: string;
  type: string;
  districts: District[];
}

export class District {
  maqh: string;
  name: string;
  type: string;
  matp: string;

}

export class Commune {
  xaid: string;
  name: string;
  type: string;
  maqh: string;
}


export class DistributorDeleteAllResuilt {
  successList: Distributor[];
  modifyingList: Distributor[];
  unsuccessList: Distributor[];
  constructor() {
  }
}
