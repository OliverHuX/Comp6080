import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import Title from './Title';

function createData (question, amount) {
  return { question, amount };
}

export default function Chart ({ title, data }) {
  const theme = useTheme();
  return (
    <React.Fragment>
      <Title>{title}</Title>
      <ResponsiveContainer>
        {data && (<LineChart
          data={Array.from(data).map((val, index) => createData('Q' + index, val))}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis dataKey="question" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>)}
      </ResponsiveContainer>
    </React.Fragment>
  );
}
Chart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};
