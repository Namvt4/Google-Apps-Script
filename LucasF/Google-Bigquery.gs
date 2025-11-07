/**
 * @fileoverview This file contains functions for interacting with Google BigQuery.
 * It provides a simplified interface for creating tables, running queries, and exporting data.
 * Note: The BigQuery API must be enabled in the Google Cloud Platform project.
 */

//==================================================================================================
// Helper Function for Job Execution
//==================================================================================================

/**
 * Executes a BigQuery job and waits for it to complete.
 * @param {string} projectId The Google Cloud Platform project ID.
 * @param {object} request The request object for the BigQuery job.
 * @return {object} The completed job results.
 * @private
 */
function _executeBigQueryJob(projectId, request) {
  let queryResults = BigQuery.Jobs.query(request, projectId);
  const jobId = queryResults.jobReference.jobId;

  let sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }

  return queryResults;
}

//==================================================================================================
// BigQuery Table & Data Manipulation Functions
//==================================================================================================

/**
 * Creates a new table in BigQuery if it does not already exist.
 * @param {string} projectId The GCP project ID.
 * @param {string} tableName The name of the table to create.
 * @param {string} schema The schema of the table.
 * @param {string} partitionField The field to use for partitioning (optional).
 * @param {string} clusterFields The fields to use for clustering (optional).
 */
function createBigQueryTable(projectId, tableName, schema, partitionField, clusterFields) {
  const partitionClause = partitionField ? `PARTITION BY ${partitionField}` : '';
  const clusterClause = clusterFields ? `CLUSTER BY ${clusterFields}` : '';

  const createQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName}
    (${schema})
    ${partitionClause}
    ${clusterClause}
  `;

  const request = {
    query: createQuery,
    useLegacySql: false,
  };

  _executeBigQueryJob(projectId, request);
  Logger.log(`Table ${tableName} created or already exists.`);
}

/**
 * Drops a table from BigQuery if it exists.
 * @param {string} projectId The GCP project ID.
 * @param {string} tableName The name of the table to drop.
 */
function dropBigQueryTable(projectId, tableName) {
  const dropQuery = `DROP TABLE IF EXISTS ${tableName}`;
  const request = {
    query: dropQuery,
    useLegacySql: false,
  };

  _executeBigQueryJob(projectId, request);
  Logger.log(`Table ${tableName} dropped if it existed.`);
}

/**
 * Deletes data from a BigQuery table based on a condition.
 * @param {string} projectId The GCP project ID.
 * @param {string} tableName The name of the table to delete from.
 * @param {string} condition The WHERE clause condition for deletion.
 */
function deleteFromBigQueryTable(projectId, tableName, condition) {
  const deleteQuery = `DELETE FROM ${tableName} WHERE ${condition}`;
  const request = {
    query: deleteQuery,
    useLegacySql: false,
  };

  _executeBigQueryJob(projectId, request);
  Logger.log(`Data deleted from ${tableName} where ${condition}.`);
}

/**
 * Inserts data into a BigQuery table using a SELECT query.
 * @param {string} projectId The GCP project ID.
 * @param {string} tableName The name of the target table.
 * @param {string} selectQuery The SELECT query to generate the data to insert.
 */
function insertIntoBigQueryTable(projectId, tableName, selectQuery) {
  const insertQuery = `INSERT INTO ${tableName}\n${selectQuery}`;
  const request = {
    query: insertQuery,
    useLegacySql: false,
  };

  _executeBigQueryJob(projectId, request);
  Logger.log(`Data inserted into ${tableName}.`);
}

//==================================================================================================
// BigQuery Data Export Functions
//==================================================================================================

/**
 * Exports data from BigQuery by running a query.
 * @param {string} projectId The GCP project ID.
 * @param {string} query The SQL query to execute.
 * @return {Array<Array<any>>|null} The exported data as a 2D array, or null if no rows are returned.
 */
function exportBigQueryData(projectId, query) {
  const request = {
    query: query,
    useLegacySql: false,
  };

  const queryResults = _executeBigQueryJob(projectId, request);

  if (!queryResults.rows) {
    Logger.log('No rows returned from the query.');
    return null;
  }

  const data = queryResults.rows.map(row => row.f.map(cell => cell.v));
  return data;
}
