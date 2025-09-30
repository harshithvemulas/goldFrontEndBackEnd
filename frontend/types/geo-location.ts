export class GeoLocation {
  as: string;
  asname: string;
  city: string;
  continent: string;
  continentCode: string;
  country: string;
  countryCode: string;
  currency: string;
  district: string;
  hosting: boolean;
  isp: string;
  lat: number;
  lon: number;
  mobile: boolean;
  offset: number;
  org: string;
  proxy: boolean;
  query: string;
  region: string;
  regionName: string;
  reverse: string;
  status: string;
  timezone: string;
  zip: string;

  constructor(data: any) {
    this.as = data.as;
    this.asname = data.asname;
    this.city = data.city;
    this.continent = data.continent;
    this.continentCode = data.continentCode;
    this.country = data.country;
    this.countryCode = data.countryCode;
    this.currency = data.currency;
    this.district = data.district;
    this.hosting = data.hosting;
    this.isp = data.isp;
    this.lat = data.lat;
    this.lon = data.lon;
    this.mobile = data.mobile;
    this.offset = data.offset;
    this.org = data.org;
    this.proxy = data.proxy;
    this.query = data.query;
    this.region = data.region;
    this.regionName = data.regionName;
    this.reverse = data.reverse;
    this.status = data.status;
    this.timezone = data.timezone;
    this.zip = data.zip;
  }

  printLocation(): string {
    return `${this.city}, ${this.country} (${this.lat}, ${this.lon})`;
  }
}
