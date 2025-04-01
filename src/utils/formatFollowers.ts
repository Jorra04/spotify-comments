export const formatFollowers = (followers: number): string => {
  if (isNaN(followers) || followers === -1) {
    return "0";
  }
  if (followers < 1000) {
    return followers.toString();
  }
  return followers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
