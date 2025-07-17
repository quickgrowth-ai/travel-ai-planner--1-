export const canadianProvinces = [
  { id: 'all', name: 'All of Canada', cities: [] },
  { id: 'ab', name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Banff', 'Jasper', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Fort McMurray'] },
  { id: 'bc', name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Burnaby', 'Richmond', 'Surrey', 'Kelowna', 'Kamloops', 'Nanaimo', 'Prince George', 'Whistler'] },
  { id: 'mb', name: 'Manitoba', cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie', 'Winkler', 'Selkirk'] },
  { id: 'nb', name: 'New Brunswick', cities: ['Fredericton', 'Saint John', 'Moncton', 'Bathurst', 'Edmundston', 'Campbellton', 'Miramichi'] },
  { id: 'nl', name: 'Newfoundland and Labrador', cities: ['St. Johns', 'Corner Brook', 'Mount Pearl', 'Conception Bay South', 'Paradise', 'Grand Falls-Windsor', 'Gander'] },
  { id: 'ns', name: 'Nova Scotia', cities: ['Halifax', 'Sydney', 'Dartmouth', 'Truro', 'New Glasgow', 'Glace Bay', 'Kentville', 'Amherst'] },
  { id: 'nt', name: 'Northwest Territories', cities: ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith', 'Behchoko', 'Iqaluit'] },
  { id: 'nu', name: 'Nunavut', cities: ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Baker Lake', 'Cambridge Bay', 'Igloolik'] },
  { id: 'on', name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London', 'Markham', 'Vaughan', 'Kitchener', 'Windsor', 'Richmond Hill', 'Oakville', 'Burlington', 'Sudbury', 'Oshawa', 'Barrie', 'St. Catharines', 'Cambridge', 'Kingston', 'Guelph', 'Thunder Bay', 'Waterloo', 'Brantford', 'Pickering', 'Niagara Falls'] },
  { id: 'pe', name: 'Prince Edward Island', cities: ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague', 'Kensington', 'Souris'] },
  { id: 'qc', name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Levis', 'Trois-Rivieres', 'Terrebonne', 'Saint-Jean-sur-Richelieu', 'Repentigny', 'Brossard', 'Drummondville', 'Saint-Jerome', 'Granby', 'Blainville', 'Saint-Hyacinthe', 'Shawinigan', 'Dollard-des-Ormeaux', 'Rimouski', 'Victoriaville', 'Joliette', 'Sorel-Tracy', 'Vaudreuil-Dorion', 'Val-dOr', 'Thetford Mines', 'Sept-Iles', 'Rouyn-Noranda', 'Alma'] },
  { id: 'sk', name: 'Saskatchewan', cities: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current', 'Yorkton', 'North Battleford', 'Estevan', 'Weyburn', 'Lloydminster'] },
  { id: 'yt', name: 'Yukon', cities: ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction', 'Mayo', 'Carmacks', 'Faro'] }
];

export const getProvinceCities = (provinceId: string): string[] => {
  const province = canadianProvinces.find(p => p.id === provinceId);
  return province ? province.cities : [];
};

export const getProvinceByCity = (cityName: string): string | null => {
  for (const province of canadianProvinces) {
    if (province.cities.some(city => city.toLowerCase() === cityName.toLowerCase())) {
      return province.name;
    }
  }
  return null;
};