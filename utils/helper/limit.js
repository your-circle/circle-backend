const GetSkipAndLimit = (req) => {
  const default_size = 50;

  let start = +req.body.from;
  let end = +req.body.to;

  if (!start || !end) {
    throw new Error(
      "Invalid from-to size, make sure (1<=from<=end<=n and end-from+1<=" +
        default_size +
        ")"
    );
  }

  start = start - 1;

  const diff = end - start;

  if (diff < 0 || diff > default_size || start < 0) {
    throw new Error(
      "Invalid from-to size, make sure (1<=from<=end<=n and end-from+1<=" +
        default_size +
        ")"
    );
  }

  let skip = start;
  let limit = diff;

  return { skip: skip, limit: limit };
};

exports.GetSkipAndLimit = GetSkipAndLimit;
