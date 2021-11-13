declare var wkof: any;

export const getSessions = () => {
  const reviews = wkof.Apiv2.fetch_endpoint("reviews", {
    last_update: new Date(Date.now() - 3 * 24 * 3600 * 1000),
  });

  const sess = [];
  let prev: any;
  reviews.forEach((r) => {
    let cur = new Date(r.data.created_at);
    if (prev) {
      sess.push(cur);
    }
    prev = cur;
  });

  if (reviews.length === 1) {
    sess.push(new Date(reviews[0].data.created_at + 600000));
  }
  return sess;
};
