const GetSkipAndLimit = (size) => {
  const default_size = 2;

  if (!size) {
    return { skip: 0, limit: default_size };
  }

  let limit_reminder = size % default_size;
  let skip =
    size > default_size
      ? limit_reminder == 0
        ? default_size * (Math.floor(size / default_size) - 1)
        : default_size * Math.floor(size / default_size)
      : 0;
  let limit = limit_reminder == 0 ? default_size : limit_reminder;

  return { skip: skip, limit: limit };
};

exports.GetSkipAndLimit = GetSkipAndLimit;
