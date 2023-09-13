import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
// import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import MUIDataTable from 'mui-datatables';

import SignalLight from 'components/SignalLight/SignalLight';

function OverviewTable() {
  const columns = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'name',
      label: 'Machine name',
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
      },
    },
    {
      name: 'noLoadTime',
      label: 'No-load operating time',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'loadTime',
      label: 'Under load operating time',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'signalLight',
      label: 'Signal Light',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) =>
          value === 1 ? (
            <SignalLight color="green" />
          ) : value === 2 ? (
            <SignalLight color="yellow" />
          ) : value === 3 ? (
            <SignalLight color="red" />
          ) : (
            <p>No operation</p>
          ),
      },
    },
    {
      name: 'action',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <FormControlLabel
              label={value ? 'Yes' : 'No'}
              value={value ? 'Yes' : 'No'}
              control={<Switch color="primary" checked={value} value={value ? 'Yes' : 'No'} />}
              onChange={(event) => {
                updateValue(event.target.value === 'Yes' ? false : true);
              }}
            />
          );
        },
      },
    },
  ];

  const data = [
    ['Robin Duncan', 'Business Analyst', 'Los Angeles', null, 1, false],
    ['Mel Brooks', 'Business Consultant', 'Oklahoma City', 1, 1, true],
    ['Harper White', 'Attorney', 'Pittsburgh', 52, 1, false],
    ['Kris Humphrey', 'Agency Legal Counsel', 'Laredo', 30, 1, true],
    ['Frankie Long', 'Industrial Analyst', 'Austin', 31, 1, false],
    ['Brynn Robbins', 'Business Analyst', 'Norfolk', 22, 2, true],
    ['Justice Mann', 'Business Consultant', 'Chicago', 24, 2, false],
    ['Addison Navarro', 'Business Management Analyst', 'New York', 50, 2, true],
    ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, 3, false],
    ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, 3, true],
    ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, 3, false],
    ['Danny Leon', 'Computer Scientist', 'Newark', 60, 3, true],
    ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, 3, false],
    ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, 3, true],
    ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, 3, false],
    ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, 3, true],
    ['Justice Mccarthy', 'Attorney', 'Tucson', 26, 330000, false],
    ['Silver Carey', 'Computer Scientist', 'Memphis', 47, 1, true],
    ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, 1, false],
    ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, 1, true],
    ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, 1, false],
    ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, 1, true],
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'standard',
    selectableRows: 'none',
  };

  return <MUIDataTable title={'ACME Employee list'} data={data} columns={columns} options={options} />;
}

export default OverviewTable;
