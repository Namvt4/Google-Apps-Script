/** Create table */
function gbq_create_table(prId, table_name, schema, partition, cluster) {
  const projectId = prId;
  if (partition != null) {
    var partition_by = `PARTITION BY ${partition}`;
  }
  else {
    var partition_by = '';
  }
  if (cluster != null) {
    var cluster_by = `CLUSTER BY ${cluster}`;
  }
  else {
    var cluster_by = '';
  }
  const create_code = `
    CREATE TABLE IF NOT EXISTS ${table_name}
    (${schema})
    ${partition_by}
    ${cluster_by}
  `
  // Logger.log(create_code)
  const request = {
    query: create_code,
    useLegacySql: false
  };
  let queryResults = BigQuery.Jobs.query(request, projectId);
  const jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  let sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }
}
//////////////////////////////////////////
/** Delete table GBQ (Trước khi chạy phải bật API BigQuery + Add service) */
function gbq_drop_table(prId, target_table) {
  const projectId = prId;
  const del_code = `DROP TABLE IF EXISTS ${target_table}`
  const request = {
    query: del_code,
    useLegacySql: false
  };
  let queryResults = BigQuery.Jobs.query(request, projectId);
  const jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  let sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }
}
//////////////////////////////////////////
/** Delete data GBQ (Trước khi chạy phải bật API BigQuery + Add service) */
function gbq_del(prId, target_table, condition) {
  const projectId = prId;
  const del_code = 'DELETE FROM ' + target_table + '\n' + 'where ' + condition
  const request = {
    query: del_code,
    useLegacySql: false
  };
  let queryResults = BigQuery.Jobs.query(request, projectId);
  const jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  let sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }
}

//////////////////////////////////////////
/** Transform data GBQ (Trước khi chạy phải bật API BigQuery + Add service) */
function gbq_trans(prId, target_table, code) {
  const projectId = prId;
  const trans_code = 'insert into ' + target_table + '\n' + code
  const request = {
    query: trans_code,
    useLegacySql: false
  };
  let queryResults = BigQuery.Jobs.query(request, projectId);
  const jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  let sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }
}

//////////////////////////////////////////
/** Export data từ GBQ (Trước khi chạy phải bật API BigQuery + Add service) */
function gbq_export(prId, code) {
  const projectId = prId;

  const request = {
    query: code,
    useLegacySql: false
  };
  let queryResults = BigQuery.Jobs.query(request, projectId);
  const jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  let sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }

  // Get all the rows of results.
  let rows = queryResults.rows;
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }

  if (!rows) {
    Logger.log('No rows returned.');
    return;
  }

  var data = new Array(rows.length);
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].f;
    data[i] = new Array(cols.length);
    for (let j = 0; j < cols.length; j++) {
      data[i][j] = cols[j].v;
    }
  }
  return data;
}
///////////////////////////////////////////
