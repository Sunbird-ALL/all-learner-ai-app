import { useEffect } from "react";

export function useMediaCache(dbName = "MediaCacheDB", storeName = "media") {
  useEffect(() => {
    // Initialize IndexedDB
    const openDB = indexedDB.open(dbName, 1);
    openDB.onupgradeneeded = () => {
      const db = openDB.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "key" }); // Ensure keyPath matches the stored object structure
      }
    };

    openDB.onerror = (e) => {
      console.error("IndexedDB initialization error:", e.target.error);
    };
  }, [dbName, storeName]);

  // Save media to IndexedDB
  const saveMedia = async (key, blob) => {
    return new Promise((resolve, reject) => {
      const openDB = indexedDB.open(dbName, 1);
      openDB.onsuccess = () => {
        const db = openDB.result;
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);

        // Put media object into the store
        const putRequest = store.put({ key, blob });

        putRequest.onsuccess = () => resolve(true);
        putRequest.onerror = () => reject(putRequest.error);
        tx.oncomplete = () => db.close(); // Close the connection
      };

      openDB.onerror = () => reject(openDB.error);
    });
  };

  // Fetch media from IndexedDB
  const getMedia = async (key) => {
    return new Promise((resolve, reject) => {
      const openDB = indexedDB.open(dbName, 1);
      openDB.onsuccess = () => {
        const db = openDB.result;
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);

        // Get the media object
        const getRequest = store.get(key);

        getRequest.onsuccess = () => resolve(getRequest.result?.blob || null);
        getRequest.onerror = () => reject(getRequest.error);
        tx.oncomplete = () => db.close(); // Close the connection
      };

      openDB.onerror = () => reject(openDB.error);
    });
  };

  // Cache media
  const cacheMedia = async (key, url) => {
    try {
      const cachedBlob = await getMedia(key);
      if (cachedBlob) {
        // console.log(`Media for key "${key}" found in cache.`);
        return URL.createObjectURL(cachedBlob);
      } else {
        console.log(`Fetching media for key "${key}" from URL.`);
        const response = await fetch(url);
        const blob = await response.blob();
        await saveMedia(key, blob);
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error(`Error caching media for key "${key}":`, error);
      throw error;
    }
  };

  return { cacheMedia };
}
