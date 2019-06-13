import LinearProgress from '@material-ui/core/LinearProgress';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import { State } from '../reducers/store';

const useStyles = makeStyles((theme: Theme) => ({
  progress: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(6)}px`,
    display: 'none',
    '&.loading': {
      display: 'block',
    },
  },
}));

// tslint:disable-next-line: variable-name
const Search = (): JSX.Element => {
  const querying = useSelector((stt: State) => stt.wex.querying);

  const classes = useStyles();

  const progressClasses = clsx(classes.progress, {
    loading: querying,
  });
  return (
    <React.Fragment>
      <SearchInput />
      <SearchResult />
      <LinearProgress className={progressClasses} variant="query" />
    </React.Fragment>
  );
};

export default Search;
