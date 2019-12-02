// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

function main(
  instanceId = 'YOUR_INSTANCE_ID',
  tableId = 'YOUR_TABLE_ID',
  read = 'readRow'
) {
  // [START bigtable_reads_row]
  // [START bigtable_reads_row_partial]
  // [START bigtable_reads_rows]
  // [START bigtable_reads_row_range]
  // [START bigtable_reads_row_ranges]
  // [START bigtable_reads_prefix]
  // [START bigtable_reads_filter]
  const {Bigtable} = require('@google-cloud/bigtable');
  const bigtable = Bigtable();

  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const instanceId = 'YOUR_INSTANCE_ID';
  // const tableId = 'YOUR_TABLE_ID';
  const instance = bigtable.instance(instanceId);
  const table = instance.table(tableId);
  // [END bigtable_reads_row]
  // [END bigtable_reads_row_partial]
  // [END bigtable_reads_rows]
  // [END bigtable_reads_row_range]
  // [END bigtable_reads_row_ranges]
  // [END bigtable_reads_prefix]
  // [END bigtable_reads_filter]

  // [START bigtable_reads_row]
  async function readRow() {
    const rowkey = 'phone#4c410523#20190501';

    const [row] = await table.row(rowkey).get();

    printRow(rowkey, row.data);
  }

  // [END bigtable_reads_row]

  // [START bigtable_reads_row_partial]
  async function readRowPartial() {
    const COLUMN_FAMILY = 'stats_summary';
    const COLUMN_QUALIFIER = 'os_build';
    const rowkey = 'phone#4c410523#20190501';

    const [row] = await table
      .row(rowkey)
      .get([`${COLUMN_FAMILY}:${COLUMN_QUALIFIER}`]);

    printRow(rowkey, row);
  }

  // [END bigtable_reads_row_partial]

  // [START bigtable_reads_rows]
  async function readRows() {
    const rowKeys = ['phone#4c410523#20190501', 'phone#4c410523#20190502'];

    const [rows] = await table.getRows({keys: rowKeys});
    for (let i = 0; i < rows.length; i++) {
      printRow(rows[i].id, rows[i].data);
    }
  }

  // [END bigtable_reads_rows]

  // [START bigtable_reads_row_range]
  async function readRowRange() {
    const start = 'phone#4c410523#20190501';
    const end = 'phone#4c410523#201906201';

    await table
      .createReadStream({
        start,
        end,
      })
      .on('error', err => {
        // Handle the error.
        console.log(err);
      })
      .on('data', row => printRow(row.id, row.data))
      .on('end', () => {
        // All rows retrieved.
      });
  }

  // [END bigtable_reads_row_range]

  // [START bigtable_reads_row_ranges]
  async function readRowRanges() {
    await table
      .createReadStream({
        ranges: [
          {
            start: 'phone#4c410523#20190501',
            end: 'phone#4c410523#20190601',
          },
          {
            start: 'phone#5c10102#20190501',
            end: 'phone#5c10102#20190601',
          },
        ],
      })
      .on('error', err => {
        // Handle the error.
        console.log(err);
      })
      .on('data', row => printRow(row.id, row.data))
      .on('end', () => {
        // All rows retrieved.
      });
  }

  // [END bigtable_reads_row_ranges]

  // [START bigtable_reads_prefix]
  async function readPrefix() {
    const prefix = 'phone#';

    await table
      .createReadStream({
        prefix,
      })
      .on('error', err => {
        // Handle the error.
        console.log(err);
      })
      .on('data', row => printRow(row.id, row.data))
      .on('end', () => {
        // All rows retrieved.
      });
  }

  // [END bigtable_reads_prefix]

  // [START bigtable_reads_filter]
  async function readFilter() {
    const filter = {
      value: /PQ2A.*$/,
    };

    await table
      .createReadStream({
        filter,
      })
      .on('error', err => {
        // Handle the error.
        console.log(err);
      })
      .on('data', row => printRow(row.id, row.data))
      .on('end', () => {
        // All rows retrieved.
      });
  }

  // [END bigtable_reads_filter]

  // [START bigtable_reads_row]
  // [START bigtable_reads_row_partial]
  // [START bigtable_reads_rows]
  // [START bigtable_reads_row_range]
  // [START bigtable_reads_row_ranges]
  // [START bigtable_reads_prefix]
  // [START bigtable_reads_filter]
  function printRow(rowkey, rowData) {
    console.log(`Reading data for ${rowkey}:`);

    for (const columnFamily of Object.keys(rowData)) {
      const columnFamilyData = rowData[columnFamily];
      console.log(`Column Family ${columnFamily}`);

      for (const columnQualifier of Object.keys(columnFamilyData)) {
        const col = columnFamilyData[columnQualifier];

        for (let i = 0; i < col.length; i++) {
          const cell = col[i];
          const labels = cell.labels.length
            ? ` [${cell.labels.join(',')}]`
            : '';
          console.log(
            `\t${columnQualifier}: ${cell.value} @${cell.timestamp}${labels}`
          );
        }
      }
    }
    console.log();
  }

  // [END bigtable_reads_row]
  // [END bigtable_reads_row_partial]
  // [END bigtable_reads_rows]
  // [END bigtable_reads_row_range]
  // [END bigtable_reads_row_ranges]
  // [END bigtable_reads_prefix]
  // [END bigtable_reads_filter]

  eval(`${read}()`);
}

main(...process.argv.slice(2));