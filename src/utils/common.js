
const getOffersByType = (type, offers) => {
  if (!offers) {
    return [];
  }

  const currentOffers = offers.find((offer) => offer.type === type);
  return currentOffers.offers.length ? currentOffers.offers : [];
};

const getDestination = (city, destination) => destination.find((item) => item.name === city);

const getIsDescription = (city, destination) => {
  const cityDescription = destination.find((item) => item.name === city);
  return Boolean(cityDescription.description);
};

const getIsPictures = (city, dest) => {
  const cityDescription = dest.find((item) => item.name === city);
  return Boolean(cityDescription.pictures.length);
};

const getIsOffers = (type, offers) => Boolean(getOffersByType(type, offers).length);


export {getOffersByType, getDestination, getIsDescription, getIsPictures, getIsOffers};
