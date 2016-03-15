exports.oneYearAgo = function() {
  var d = new Date();
  d.setYear(d.getYear() + 1899);
  return d;
};
