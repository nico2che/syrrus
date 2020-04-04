const AWS = require("aws-sdk");

const glacier = new AWS.Glacier({
  region: "eu-west-1"
});

function getJobs(filter = {}) {
  const { action } = filter;
  return new Promise((res, rej) => {
    glacier.listJobs(
      {
        accountId: "-",
        vaultName: "chevigne"
      },
      function(err, data) {
        if (err) {
          return rej(err);
        }
        if (!action) {
          return res(data.JobList);
        }
        const jobs = data.JobList.filter(job => job.Action === action);
        return res(jobs);
      }
    );
  });
}

function createJob(jobType, options = {}) {
  const { ArchiveId, Tier } = options;
  return new Promise((res, rej) => {
    glacier.initiateJob(
      {
        accountId: "-",
        vaultName: "chevigne",
        jobParameters: {
          Type: jobType,
          ...(ArchiveId && { ArchiveId }),
          ...(Tier && { Tier })
        }
      },
      function(err, data) {
        if (err) {
          return rej(err);
        }
        return res(data);
      }
    );
  });
}

function getJobOutput(jobId) {
  return new Promise((res, rej) => {
    glacier.getJobOutput(
      {
        accountId: "-",
        vaultName: "chevigne",
        jobId
      },
      function(err, data) {
        if (err) {
          return rej(err);
        }
        return res(data);
      }
    );
  });
}

module.exports = {
  getJobs,
  createJob,
  getJobOutput
};
