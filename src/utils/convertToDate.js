import moment from "moment";

export const convertToDate = (timestamp) => {
  return moment.unix(timestamp).format("MMMM DD, YYYY");
};
