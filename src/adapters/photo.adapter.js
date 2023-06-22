export const photoAdapter = (photo) => {
    const adaptedPhotos = {
        id: photo.id,
        title: photo.title,
        url: photo.url
    }

    return adaptedPhotos;
}