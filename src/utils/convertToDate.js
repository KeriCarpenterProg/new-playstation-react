import moment from "moment";

export const convertToDate = (timestamp) => {
  return moment.unix(timestamp).format("MMM DD, YYYY");
};
