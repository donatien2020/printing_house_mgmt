export interface IUser {
  id: number | null;
  login?: string;
  firstName?: string | null;
  lastName?: string | null;
  nid?: string | null;
  docType?: string | null;
  birthDate?: Date | null;
  birthAddress?: string | null;
  maritalStatus?: string;
  gender?: string | null;
  phone?: string | null;
  organizationId?: string | null;
  email?: string;
  activated?: boolean | false;
  langKey?: string;
  authorities?: string[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export class User implements IUser {
  constructor(
    public id: number | null,
    public login?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public nid?: string | null,
    public docType?: string | null,
    public gender?: string | null,
    public birthDate?: Date | null,
    public birthAddress?: string | null,
    public maritalStatus?: string,
    public phone?: string | null,
    public organizationId?: string | null,
    public email?: string,
    public activated?: boolean,
    public langKey?: string,
    public authorities?: string[],
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date
  ) {}
}
