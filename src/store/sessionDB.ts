export let sessionDB: any;

export const setupSessionsDB = () => {
  return new Promise<void>((resolve, reject): void => {
    // If setup already run just resolve and return
    if (sessionDB) {
      resolve();
      return;
    }

    let dbReq = indexedDB.open("gbSessionCache", 1);

    // Fires when the version of the database goes up, or the database is
    // created for the first time
    dbReq.onupgradeneeded = function (event: any) {
      sessionDB = event.target.result;

      // Create an object store named sessions if it doesn't exist.
      // Object stores in databases are where data are stored.
      if (!sessionDB.objectStoreNames.contains("sessions")) {
        sessionDB.createObjectStore("sessions", {
          autoIncrement: true,
        });
      }
    };

    // Fires once the database is opened (and onupgradeneeded completes, if
    // onupgradeneeded was called)
    dbReq.onsuccess = function (event: any) {
      // Set the db variable to our database so we can use it!
      sessionDB = event.target.result;
      resolve();
    };

    // Fires when we can't open the database
    dbReq.onerror = function (event: any) {
      reject(`error opening sessions database ${event.target.errorCode}`);
    };
  });
};
