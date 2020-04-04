const { ipcMain } = require("electron");
const Store = require("electron-store");

const { FGDescription } = require("./helpers");
const { getJobs, createJob, getJobOutput } = require("./aws");

const store = new Store({
  name: "inventory"
});

const TIER = {
  BULK: "Bulk", // 0.0025 / GB - 5/12 Hours
  EXPEDITED: "Expedited", // 0.03 / GB - 1/5 Min
  STANDARD: "Standard" // 0.01 / GB - 3/5 Hours
};

function listen(eventName, func) {
  ipcMain.on(eventName, async function(event, args) {
    const data = await func(args);
    event.sender.send(`${eventName}_RESPONSE`, data);
  });
}

listen("GET_INVENTORY", getInventory);
listen("GET_JOBS", getJobs);
listen("DOWNLOAD_FILES", downloadFiles);

function formatInventory(inventory) {
  inventory.ArchiveList.map(
    item => (item.Path = FGDescription(item.ArchiveDescription))
  );
  return inventory;
}

async function getInventory() {
  if (store.has("inventory")) {
    const items = JSON.parse(store.get("inventory"));
    return {
      completed: true,
      items: formatInventory(items)
    };
  }
  const jobs = await getJobs({ action: "InventoryRetrieval" });
  if (!jobs.length) {
    const job = await createJob("inventory-retrieval");
    return {
      completed: false,
      startDate: job.CreationDate
    };
  }
  const [job] = jobs;
  if (!job.Completed) {
    return {
      completed: false,
      startDate: job.CreationDate
    };
  }
  const inventory = await getJobOutput(job.JobId);
  if (!inventory.body) {
    console.error("Error", inventory);
    return {
      error: "Error",
      completed: false
    };
  }
  const items = new TextDecoder("utf-8").decode(inventory.body);
  store.set("inventory", items);
  return {
    completed: true,
    items: formatInventory(items)
  };
}

async function downloadFiles(files) {
  const response = await Promise.all(
    files
      .map(file => ({ ArchiveId: file.id, Tier: TIER.STANDARD }))
      .map(options => createJob("archive-retrieval", options))
  );
  console.log(response);
}
