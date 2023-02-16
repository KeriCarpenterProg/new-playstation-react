import { CAMPSITES } from "../../app/shared/CAMPSITES";

export const selectAllCampsites = () => {
  return CAMPSITES;
};

// export const selectRandomCampsite = () => {
//   const a = Math.floor(Math.random() * CAMPSITES.length);
//   return CAMPSITES[a];
// };

export const selectCampsiteById = (id) => {
  return CAMPSITES.find((campsite)=>campsite.id === id);
}
