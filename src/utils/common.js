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

const getIsDescription = (city, info) => info.find((item) => item.name === city);

const getIsPictures = (city, photo) => photo.filter((item) => item.name === city);

const getIsOffers = (type, offers) => Boolean(getOffersByType(type, offers).length);

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';


export {isEscEvent, getOffersByType, getDestination, getIsDescription, getIsPictures, getIsOffers};
