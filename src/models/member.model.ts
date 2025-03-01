export class MemberModel {
  id: number;
  name: string;
  phoneNumber: string;

  toString = () => {
    return this.name;
  };
}
