import { offlineModelsInfo, getLocalData } from "../utils/constants";

const dbName = "language-ai-models";
const dbVersion = 1;
let db;

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, dbVersion);
    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.errorCode);
      reject(event.target.error);
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("IndexedDB opened successfully");
      resolve();
    };
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      console.log("Creating object store for models");
      if (!db.objectStoreNames.contains("models")) {
        db.createObjectStore("models");
      }
    };
  });
};

export const storeModel = async (
  modelName,
  modelURL,
  setDownloadProgress,
  isVocabModel
) => {
  try {
    console.log("Fetching:", modelURL);
    const response = await fetch(modelURL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let modelData;
    if (!isVocabModel) {
      const reader = response.body.getReader();
      const contentLength = +response.headers.get("Content-Length");
      let receivedLength = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        // Update progress if provided
        if (setDownloadProgress) {
          const percentage = (receivedLength / contentLength) * 100;
          setDownloadProgress(percentage.toFixed());
        }
      }

      modelData = new Uint8Array(receivedLength);
      let position = 0;
      for (let chunk of chunks) {
        modelData.set(chunk, position);
        position += chunk.length;
      }
    } else {
      const vocabData = await response.arrayBuffer();
      const decoder = new TextDecoder("utf-8");
      modelData = decoder.decode(vocabData).split("\n");
    }

    const transaction = db.transaction(["models"], "readwrite");
    const store = transaction.objectStore("models");
    store.put(modelData, modelName);
    console.log(`Stored model ${modelName} in IndexedDB`);
  } catch (error) {
    console.error("Error storing model in IndexedDB:", error);
  }
};

export const isModelStored = (modelName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["models"], "readonly");
    const store = transaction.objectStore("models");
    const request = store.get(modelName);

    request.onerror = (event) => {
      console.error(
        "Error checking model in IndexedDB:",
        event.target.errorCode
      );
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(!!event.target.result);
    };
  });
};

export const loadOfflineModel = async (selectedLang, setDownloadProgress) => {
  try {
    await openDB();
    let modelName = "";
    let modelURL = "";
    let vocabURL = "";
    let vocabFileName = "";

    offlineModelsInfo.forEach((modelInfo) => {
      if (modelInfo.lang === selectedLang) {
        modelName = modelInfo.modelName;
        modelURL = modelInfo.modelURL;
        vocabURL = modelInfo.vocabUrl;
        vocabFileName = modelInfo.vacabFileName;
      }
    });

    // Check and store the vocabulary model if available
    if (vocabURL) {
      const vocabStored = await isModelStored(vocabFileName);
      if (!vocabStored) {
        await storeModel(vocabFileName, vocabURL, setDownloadProgress, true);
      } else {
        console.log(`Vocabulary model ${vocabFileName} is already stored`);
      }
    }

    // Check and store the main model
    const stored = await isModelStored(modelName);
    if (!stored) {
      await storeModel(modelName, modelURL, setDownloadProgress, false);
    } else {
      console.log(`Model ${modelName} is already stored in IndexedDB`);
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const loadOfflineModelSession = async (modelName) => {
  try {
    const transaction = db.transaction(["models"], "readonly");
    const store = transaction.objectStore("models");
    const request = store.get(modelName);

    request.onsuccess = async () => {
      const modelData = request.result;
      if (window.offlineSession === undefined) {
        window.offlineSession = await window.ort.InferenceSession.create(
          modelData
        );
        console.log("Offline model session created:", window.offlineSession);
      }
    };

    request.onerror = (err) => {
      console.error(`Error getting model data: ${err}`);
    };
  } catch (error) {
    console.error("Error loading offline model session:", error);
  }
};

export const loadOfflineVocab = async (vocabFileName) => {
  try {
    const transaction = db.transaction(["models"], "readonly");
    const store = transaction.objectStore("models");
    const request = store.get(vocabFileName);

    request.onsuccess = async () => {
      window.offlineVocab = request.result;
      console.log("Offline vocab loaded.");
    };

    request.onerror = (err) => {
      console.error(`Error getting vocab data: ${err}`);
    };
  } catch (error) {
    console.error("Error loading offline vocab:", error);
  }
};

/**
 * Updated handleRedirect:
 *  - Instead of blocking redirection until the model loads, we kick off the model loading in the background.
 *  - The progress callback (setDownloadProgress) will update the UI as the model downloads.
 *  - The redirect callback is called immediately.
 */
export const handleRedirect = async (lang, callback, setDownloadProgress) => {
  if (localStorage.getItem("isOfflineModel") === "true") {
    let modelName = "";
    let vacabFileName = "";

    offlineModelsInfo.forEach((modelInfoElement) => {
      if (modelInfoElement.lang === lang) {
        modelName = modelInfoElement.modelName;
        vacabFileName = modelInfoElement?.vacabFileName;
      }
    });

    await openDB();
    isModelStored(modelName)
      .then((stored) => {
        if (!stored) {
          console.log(
            `Model ${modelName} is not stored, starting download in background.`
          );
          // Kick off offline model loading (which shows progress) without awaiting it.
          loadOfflineModel(lang, setDownloadProgress).catch(console.error);
        } else {
          console.log(`Model ${modelName} is already stored in IndexedDB.`);
        }
      })
      .catch(console.error);

    // For non-English languages, kick off additional background tasks.
    if (lang !== "en") {
      // loadModelIndic and loadVocabIndic should be defined elsewhere.
      loadModelIndic(modelName).catch(console.error);
      loadVocabIndic(vacabFileName).catch(console.error);
    } else {
      if (!window.sherpaRecognizer) {
        window.sherpaModule.loadModel().catch(console.error);
        // Other operations for the English model can run in the background.
        fileExists("transducer-encoder.onnx");
        // Additional configuration and recognizer setup...
      }
    }

    // Immediately trigger the redirect callback without waiting for model loading to finish.
    callback && callback();
  }
};

function fileExists(filename) {
  let buffer = null;
  try {
    const filenameLen = Module.lengthBytesUTF8(filename) + 1;
    buffer = Module._malloc(filenameLen);
    if (!buffer) {
      throw new Error("Failed to allocate memory");
    }
    Module.stringToUTF8(filename, buffer, filenameLen);
    let exists = Module._SherpaOnnxFileExists(buffer);
    Module._free(buffer);
    return exists;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  } finally {
    if (buffer) {
      Module._free(buffer);
    }
  }
}
