import { useEffect } from "react";

export function useMediaCache(dbName = "MediaCacheDB", storeName = "media") {
  useEffect(() => {
    initializeDB(dbName, storeName);
  }, [dbName, storeName]);

  const initializeDB = (dbName, storeName) => {
    const openDB = indexedDB.open(dbName, 1);

    openDB.onupgradeneeded = () => {
      const db = openDB.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "key" });
      }
    };

    openDB.onerror = (e) => {
      console.error("IndexedDB initialization error:", e.target.error);
    };
  };

  const saveMedia = async (key, blob) => {
    const db = await openDatabase(dbName);
    return await putMedia(db, storeName, { key, blob });
  };

  const getMedia = async (key) => {
    const db = await openDatabase(dbName);
    return await fetchMedia(db, storeName, key);
  };

  const cacheMedia = async (key, url) => {
    try {
      const cachedBlob = await getMedia(key);
      if (cachedBlob) {
        return URL.createObjectURL(cachedBlob);
      }
      return await fetchAndCacheMedia(key, url);
    } catch (error) {
      console.error(`Error caching media for key "${key}":`, error);
      throw error;
    }
  };

  const openDatabase = (dbName) => {
    return new Promise((resolve, reject) => {
      const openDB = indexedDB.open(dbName, 1);

      openDB.onsuccess = () => resolve(openDB.result);
      openDB.onerror = () => reject(openDB.error);
    });
  };

  const putMedia = (db, storeName, media) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const putRequest = store.put(media);

      putRequest.onsuccess = () => resolve(true);
      putRequest.onerror = () => reject(putRequest.error);

      tx.oncomplete = () => db.close();
    });
  };

  const fetchMedia = (db, storeName, key) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const getRequest = store.get(key);

      getRequest.onsuccess = () => resolve(getRequest.result?.blob || null);
      getRequest.onerror = () => reject(getRequest.error);

      tx.oncomplete = () => db.close();
    });
  };

  const fetchAndCacheMedia = async (key, url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    await saveMedia(key, blob);
    return URL.createObjectURL(blob);
  };

  return { cacheMedia };
}
