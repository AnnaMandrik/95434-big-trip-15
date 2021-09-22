const getOffersByType = (type, offers) => {

  if (!offers) {
    return [];
  }
  const currentOffers = offers.find((offer) => offer.type.toLowerCase() === type.toLowerCase());
  if (!currentOffers) {
    return [];
  }
  return currentOffers.offers.length ? currentOffers.offers : [];
};


const getDestination = (city, destination) => destination.find((item) => item.name === city);


const getIsDescription = (city, info) => {
  const cityDescription = info.find((item) => item.name === city);
  return cityDescription;
};


const getIsPictures = (city, photo) => {
  const cityDescription = photo.filter((item) => item.name === city);
  return cityDescription;
};

const getIsOffers = (type, offers) => Boolean(getOffersByType(type, offers).length);


export {getOffersByType, getDestination, getIsDescription, getIsPictures, getIsOffers};
