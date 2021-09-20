
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
  if (destination.description) {
    return Boolean(cityDescription.description);
  }
  return '';
};

const getIsPictures = (city, destination) => {
  const cityDescription = destination.find((item) => item.name === city);
  if (destination.pictures) {
    return Boolean(cityDescription.pictures);
  }
  return '';
};

const getIsOffers = (type, offers) => Boolean(getOffersByType(type, offers).length);


export {getOffersByType, getDestination, getIsDescription, getIsPictures, getIsOffers};
